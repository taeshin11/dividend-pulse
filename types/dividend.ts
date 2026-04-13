export interface DividendStock {
  ticker: string;
  name: string;
  sector: string;
  exDate: string;
  payDate: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "annual" | "semi-annual";
  yield: number;
  consecutiveYears: number;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  avgYield: number;
  stockCount: number;
  description: string;
}

export interface PortfolioItem {
  ticker: string;
  shares: number;
  stock?: DividendStock;
}

export interface DividendHistoryPoint {
  month: string;
  yield: number;
  amount: number;
}
