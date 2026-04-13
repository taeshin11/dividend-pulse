export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatYield(yieldPct: number): string {
  return `${yieldPct.toFixed(2)}%`;
}

export function getYieldColor(yieldPct: number): string {
  if (yieldPct >= 4) return "bg-green-100 text-green-800";
  if (yieldPct >= 2) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function getSectorLabel(sector: string): string {
  const labels: Record<string, string> = {
    technology: "Technology",
    financials: "Financials",
    utilities: "Utilities",
    healthcare: "Healthcare",
    energy: "Energy",
    "consumer-staples": "Consumer Staples",
    "real-estate": "Real Estate",
    industrials: "Industrials",
    etf: "ETF",
    materials: "Materials",
    communication: "Communication",
  };
  return labels[sector] || sector;
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
