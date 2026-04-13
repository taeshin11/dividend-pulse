"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DividendStock } from "@/types/dividend";
import { formatYield, getYieldColor } from "@/lib/utils";

interface Props {
  stocks: DividendStock[];
  month: number;
  year: number;
}

export default function DividendCalendar({ stocks, month, year }: Props) {
  const params = useParams();
  const locale = params.locale || "en";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const stocksByDay: Record<number, DividendStock[]> = {};
  stocks.forEach((stock) => {
    const d = new Date(stock.exDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!stocksByDay[day]) stocksByDay[day] = [];
      stocksByDay[day].push(stock);
    }
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 bg-gray-50">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          const dayStocks = day ? stocksByDay[day] || [] : [];
          const today = new Date();
          const isToday = day && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

          return (
            <div
              key={idx}
              className={`min-h-[80px] p-1 border-b border-r border-gray-50 ${
                !day ? "bg-gray-50" : ""
              } ${isToday ? "bg-green-50" : ""}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium ${isToday ? "text-green-700 font-bold" : "text-gray-600"}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayStocks.slice(0, 3).map((stock) => (
                      <Link
                        key={stock.ticker}
                        href={`/${locale}/stocks/${stock.ticker}`}
                        className={`block text-xs px-1 rounded truncate ${getYieldColor(stock.yield)} hover:opacity-80`}
                      >
                        {stock.ticker} {formatYield(stock.yield)}
                      </Link>
                    ))}
                    {dayStocks.length > 3 && (
                      <span className="text-xs text-gray-400">+{dayStocks.length - 3} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
