export const ORDER_ITEM_SNAPSHOT_KEY = "__mtdgc_snapshot";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RequiredOrderDetail = {
  label: string;
  value: string;
  missing: boolean;
};

export type PreFulfilmentChecklist = {
  snapshotStatus: "captured" | "not_captured" | "unrecognised";
  region: string | null;
  selectedOption: string | null;
  requiredFields: RequiredOrderDetail[];
  capturedFields: [string, string][];
  missingRequiredCount: number | null;
};

type OrderItemSnapshot = {
  version: 1;
  region: string;
  requiredFields: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((field: unknown) => typeof field === "string");
}

function normaliseRequiredFields(value: unknown): string[] {
  if (!isStringArray(value)) throw new Error("Product requirements are unavailable");
  return [...new Set(value.filter((field) => field.trim().length > 0))];
}

export function hasReservedOrderItemField(fields: Record<string, string>): boolean {
  return Object.prototype.hasOwnProperty.call(fields, ORDER_ITEM_SNAPSHOT_KEY);
}

/**
 * Add a server-owned order-time snapshot to the existing order_items.fields JSONB.
 * The customer-provided fields remain top-level string values; metadata is isolated
 * under a reserved key and must never be accepted from the browser.
 */
export function buildOrderItemFieldsSnapshot(
  customerFields: Record<string, string>,
  region: unknown,
  requirements: unknown,
): Json {
  if (hasReservedOrderItemField(customerFields)) {
    throw new Error("Reserved order metadata cannot be supplied as a customer detail");
  }
  if (typeof region !== "string") {
    throw new Error("Product region is unavailable");
  }

  const snapshot: OrderItemSnapshot = {
    version: 1,
    region,
    requiredFields: normaliseRequiredFields(requirements),
  };

  return {
    ...customerFields,
    [ORDER_ITEM_SNAPSHOT_KEY]: snapshot,
  };
}

function parseSnapshot(value: unknown): OrderItemSnapshot | null {
  if (!isRecord(value)) return null;
  const version = value["version"];
  const region = value["region"];
  const requiredFields = value["requiredFields"];
  if (version !== 1 || typeof region !== "string") return null;
  if (!isStringArray(requiredFields)) return null;

  return {
    version: 1,
    region,
    requiredFields: normaliseRequiredFields(requiredFields),
  };
}

/**
 * Read the admin checklist without consulting the current product record. This
 * prevents today's region/requirements from being mistaken for order-time facts.
 */
export function getPreFulfilmentChecklist(fields: unknown, variantName: unknown): PreFulfilmentChecklist {
  const record = isRecord(fields) ? fields : {};
  const hasSnapshot = Object.prototype.hasOwnProperty.call(record, ORDER_ITEM_SNAPSHOT_KEY);
  const snapshot = hasSnapshot ? parseSnapshot(record[ORDER_ITEM_SNAPSHOT_KEY]) : null;
  const snapshotStatus = snapshot ? "captured" : hasSnapshot ? "unrecognised" : "not_captured";

  const capturedFields = Object.entries(record)
    .filter(([key, value]) => key !== ORDER_ITEM_SNAPSHOT_KEY && typeof value === "string")
    .map(([key, value]) => [key, value as string] as [string, string]);

  const requiredFields = snapshot
    ? snapshot.requiredFields.map((label) => {
        const raw = record[label];
        const value = typeof raw === "string" ? raw : "";
        return { label, value, missing: value.trim().length === 0 };
      })
    : [];

  return {
    snapshotStatus,
    region: snapshot ? (snapshot.region.trim() ? snapshot.region : null) : null,
    selectedOption: typeof variantName === "string" && variantName.trim() ? variantName : null,
    requiredFields,
    capturedFields,
    missingRequiredCount: snapshot ? requiredFields.filter((field) => field.missing).length : null,
  };
}
