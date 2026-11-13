export type SupportIssueTypeRow = { issue_type: string | null };

export type SupportCategoryCount = {
  category: string;
  count: number;
};

export function countSupportCategories(rows: readonly SupportIssueTypeRow[]): SupportCategoryCount[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const category = typeof row.issue_type === "string" && row.issue_type.trim()
      ? row.issue_type.trim()
      : "Uncategorised";
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts, ([category, count]) => ({ category, count })).sort(
    (a, b) => b.count - a.count || a.category.localeCompare(b.category),
  );
}

export function supportTicketsPer100Orders(ticketCount: number, orderCount: number): number | null {
  if (
    !Number.isSafeInteger(ticketCount) ||
    ticketCount < 0 ||
    !Number.isSafeInteger(orderCount) ||
    orderCount < 0 ||
    orderCount === 0
  ) {
    return null;
  }

  return Math.round((ticketCount / orderCount) * 1000) / 10;
}
