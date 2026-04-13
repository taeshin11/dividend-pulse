import dividendsData from "@/data/dividends-fallback.json";
import sectorsData from "@/data/sectors-fallback.json";
import { DividendStock, Sector } from "@/types/dividend";

export function getAllStocks(): DividendStock[] {
  return dividendsData as DividendStock[];
}

export function getStockByTicker(ticker: string): DividendStock | undefined {
  return (dividendsData as DividendStock[]).find(
    (s) => s.ticker.toLowerCase() === ticker.toLowerCase()
  );
}

export function getStocksBySector(sector: string): DividendStock[] {
  return (dividendsData as DividendStock[]).filter(
    (s) => s.sector.toLowerCase() === sector.toLowerCase()
  );
}

export function getAllSectors(): Sector[] {
  return sectorsData as Sector[];
}

export function getSectorBySlug(slug: string): Sector | undefined {
  return (sectorsData as Sector[]).find((s) => s.slug === slug);
}

export function getUpcomingExDates(days: number = 30): DividendStock[] {
  const today = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return (dividendsData as DividendStock[])
    .filter((s) => {
      const exDate = new Date(s.exDate);
      return exDate >= today && exDate <= future;
    })
    .sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime());
}

export function getThisWeekStocks(): DividendStock[] {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return (dividendsData as DividendStock[])
    .filter((s) => {
      const exDate = new Date(s.exDate);
      return exDate >= startOfWeek && exDate <= endOfWeek;
    })
    .sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime());
}

export function getTopYieldStocks(limit: number = 10): DividendStock[] {
  return [...(dividendsData as DividendStock[])]
    .sort((a, b) => b.yield - a.yield)
    .slice(0, limit);
}

export function getDividendAristocrats(): DividendStock[] {
  return (dividendsData as DividendStock[])
    .filter((s) => s.consecutiveYears >= 25)
    .sort((a, b) => b.consecutiveYears - a.consecutiveYears);
}

export function generateDividendHistory(stock: DividendStock) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const baseYield = stock.yield;
  return months.map((month, i) => ({
    month,
    yield: parseFloat((baseYield + (Math.random() - 0.5) * 0.5).toFixed(2)),
    amount: parseFloat((stock.amount + (Math.random() - 0.5) * 0.05).toFixed(4)),
  }));
}
