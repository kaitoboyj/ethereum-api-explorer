export const NA = "N/A";

export function formatUsd(value?: number | string | null): string {
  if (value === undefined || value === null || value === "") return NA;
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return NA;
  if (n === 0) return "$0";
  if (Math.abs(n) < 0.01) {
    // tiny prices: show significant digits, e.g. $0.0₅1234
    const s = n.toFixed(20);
    const m = s.match(/^0\.(0+)(\d{1,4})/);
    if (m?.[1] && m[2] && m[1].length >= 4) return `$0.0${subscript(m[1].length)}${m[2]}`;
    return `$${n.toPrecision(4)}`;
  }
  if (Math.abs(n) < 1) return `$${n.toFixed(4)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(n) >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(n);
}

function subscript(n: number): string {
  const map = "₀₁₂₃₄₅₆₇₈₉";
  return String(n)
    .split("")
    .map((d) => map[Number(d)])
    .join("");
}

export function formatPct(value?: number | null): string {
  if (value === undefined || value === null || !Number.isFinite(value)) return NA;
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function shortAddr(a: string): string {
  return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

export function formatDate(ms?: number): string {
  if (!ms) return NA;
  return new Date(ms).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
