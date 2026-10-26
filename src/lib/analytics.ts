// Thin GA4 wrapper. No-ops when gtag isn't loaded (localhost, previews, ad blockers) so nothing ever throws.
type Gtag = (command: string, ...args: unknown[]) => void;

export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof g === "function") g("event", event, params);
}
