import type { TicketRow } from "./panel-types";
export function SupportPanel({ tickets }: { tickets: TicketRow[] }) {
 return (
            <section className="mt-8">
              <h2 className="font-display text-lg font-medium">Support requests</h2>
              {tickets.length ? (
                <ul className="mt-2 divide-y divide-border text-sm">
                  {tickets.map((t) => (
                    <li key={t.id} className="flex flex-wrap justify-between gap-2 py-2">
                      <span>{t.issue_type}</span>
                      <span className="text-muted-foreground">{t.order_number ?? "No order number"}</span>
                      <span>{t.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">No support requests yet.</p>
              )}
            </section>
 );
}
