import Link from "next/link";
import { TrendingUp, Calendar } from "lucide-react";
import { DividendStock } from "@/types/dividend";
import { formatDate, formatYield, getYieldColor, getSectorLabel } from "@/lib/utils";

interface Props {
  stock: DividendStock;
  locale: string;
}

export default function StockCard({ stock, locale }: Props) {
  const yieldClass = getYieldColor(stock.yield);

  return (
    <Link href={`/${locale}/stocks/${stock.ticker}`}>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="font-mono font-bold text-lg text-green-800">{stock.ticker}</span>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{stock.name}</p>
          </div>
          <span className={`px-2 py-1 rounded text-sm font-bold ${yieldClass}`}>
            {formatYield(stock.yield)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3 text-green-500" />
            <span>Ex: {formatDate(stock.exDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span>{getSectorLabel(stock.sector)}</span>
          </div>
        </div>

        {stock.consecutiveYears >= 25 && (
          <div className="mt-3 text-xs text-amber-700 font-semibold">
            🏆 {stock.consecutiveYears}-Year Dividend Aristocrat
          </div>
        )}
      </div>
    </Link>
  );
}
