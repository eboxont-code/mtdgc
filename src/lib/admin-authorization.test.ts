import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import * as ts from "typescript";

const source = readFileSync(new URL("./admin.functions.ts", import.meta.url), "utf8");
const sourceFile = ts.createSourceFile("admin.functions.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function callName(call: ts.CallExpression): string | undefined {
  if (ts.isIdentifier(call.expression)) return call.expression.text;
  if (ts.isPropertyAccessExpression(call.expression)) return call.expression.name.text;
  return undefined;
}

function callChain(expression: ts.Expression): ts.CallExpression[] {
  const calls: ts.CallExpression[] = [];
  let current: ts.Expression = expression;

  while (ts.isCallExpression(current)) {
    calls.unshift(current);
    const target = current.expression;
    if (ts.isPropertyAccessExpression(target) || ts.isElementAccessExpression(target)) current = target.expression;
    else break;
  }

  return calls;
}

function getExportedVariables() {
  return sourceFile.statements.flatMap((statement) => {
    if (!ts.isVariableStatement(statement)) return [];
    const exported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    if (!exported) return [];
    return statement.declarationList.declarations.filter((declaration) => ts.isIdentifier(declaration.name));
  });
}

const exportedVariables = getExportedVariables();
const adminServerFunctions = exportedVariables.flatMap((declaration) => {
  if (!declaration.initializer || !ts.isCallExpression(declaration.initializer)) return [];
  const chain = callChain(declaration.initializer);
  const isServerFunction = chain.some((call) => callName(call) === "createServerFn") && chain.some((call) => callName(call) === "handler");
  return isServerFunction ? [{ name: (declaration.name as ts.Identifier).text, chain }] : [];
});

function hasAuthenticatedMiddleware(chain: ts.CallExpression[]): boolean {
  return chain.some((call) => {
    if (callName(call) !== "middleware") return false;
    const argument = call.arguments[0];
    return Boolean(argument && ts.isArrayLiteralExpression(argument) &&
      argument.elements.some((entry) => ts.isIdentifier(entry) && entry.text === "requireSupabaseAuth"));
  });
}

function hasFirstStatementAdminGuard(chain: ts.CallExpression[]): boolean {
  const handler = chain.find((call) => callName(call) === "handler")?.arguments[0];
  if (!handler || !ts.isArrowFunction(handler) || !ts.isBlock(handler.body)) return false;

  const first = handler.body.statements[0];
  if (!first || !ts.isExpressionStatement(first) || !ts.isAwaitExpression(first.expression)) return false;

  const awaited = first.expression.expression;
  if (!ts.isCallExpression(awaited) || !ts.isIdentifier(awaited.expression) || awaited.expression.text !== "assertAdmin") return false;

  const argument = awaited.arguments[0];
  return Boolean(argument && ts.isAsExpression(argument) &&
    ts.isIdentifier(argument.expression) && argument.expression.text === "context");
}

function assertAdminGuardIsFailClosed(): boolean {
  const declaration = sourceFile.statements.find(
    (statement) => ts.isFunctionDeclaration(statement) && statement.name?.text === "assertAdmin",
  );
  if (!declaration || !ts.isFunctionDeclaration(declaration) || !declaration.body) return false;

  let checksCurrentUserAdminRole = false;
  function visit(node: ts.Node) {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "rpc") {
      const [name, options] = node.arguments;
      if (name && ts.isStringLiteral(name) && name.text === "has_role" && options && ts.isObjectLiteralExpression(options)) {
        const properties = options.properties.filter(ts.isPropertyAssignment);
        const userProperty = properties.find((property) => ts.isIdentifier(property.name) && property.name.text === "_user_id");
        const roleProperty = properties.find((property) => ts.isIdentifier(property.name) && property.name.text === "_role");
        const usesCurrentUser = Boolean(userProperty && ts.isPropertyAccessExpression(userProperty.initializer) &&
          ts.isIdentifier(userProperty.initializer.expression) && userProperty.initializer.expression.text === "context" &&
          userProperty.initializer.name.text === "userId");
        const checksAdminRole = Boolean(roleProperty && ts.isStringLiteral(roleProperty.initializer) && roleProperty.initializer.text === "admin");
        checksCurrentUserAdminRole = usesCurrentUser && checksAdminRole;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(declaration.body);

  const deniesOnRpcErrorOrMissingRole = declaration.body.statements.some((statement) => {
    if (!ts.isIfStatement(statement) || !ts.isBinaryExpression(statement.expression) ||
      statement.expression.operatorToken.kind !== ts.SyntaxKind.BarBarToken) return false;

    const left = statement.expression.left;
    const right = statement.expression.right;
    const checksError = ts.isIdentifier(left) && left.text === "error";
    const checksMissingRole = ts.isPrefixUnaryExpression(right) &&
      right.operator === ts.SyntaxKind.ExclamationToken &&
      ts.isIdentifier(right.operand) && right.operand.text === "data";

    return checksError && checksMissingRole && ts.isThrowStatement(statement.thenStatement);
  });

  return checksCurrentUserAdminRole && deniesOnRpcErrorOrMissingRole;
}

const expectedAdminFunctions = [
  "updateOrderStatus",
  "addOrderNote",
  "approveReview",
  "saveProduct",
  "archiveProduct",
  "saveVariant",
  "archiveVariant",
  "saveCategory",
  "getAdminPaymentSettings",
  "savePaymentSettings",
  "uploadPaymentQr",
  "listPaymentsToVerify",
  "getPaymentProofUrl",
  "reviewPayment",
];

describe("MT-0164 server-side administrator authorization contract", () => {
  test("the admin module exposes exactly the audited 14 server functions", () => {
    assert.equal(exportedVariables.length, expectedAdminFunctions.length,
      "review every new export in admin.functions.ts before updating the audited endpoint inventory");
    assert.deepEqual(adminServerFunctions.map((fn) => fn.name).sort(), [...expectedAdminFunctions].sort());
    assert.equal(adminServerFunctions.length, exportedVariables.length,
      "every exported admin binding must be a server function covered by this test");
  });

  test("every exported admin server function authenticates and checks the admin role before handler work", () => {
    for (const fn of adminServerFunctions) {
      assert.equal(hasAuthenticatedMiddleware(fn.chain), true,
        `${fn.name} must use requireSupabaseAuth middleware`);
      assert.equal(hasFirstStatementAdminGuard(fn.chain), true,
        `${fn.name} must await assertAdmin(context) before any handler operation`);
    }
  });

  test("the shared admin guard checks the current user's admin role and rejects RPC errors or missing role results", () => {
    assert.equal(assertAdminGuardIsFailClosed(), true);
  });
});
