"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown } from "lucide-react";
import { DividendStock } from "@/types/dividend";
import { formatDate, formatCurrency, formatYield, getYieldColor, getSectorLabel } from "@/lib/utils";

interface Props {
  stocks: DividendStock[];
  showSector?: boolean;
}

type SortKey = "yield" | "exDate" | "consecutiveYears" | "amount";

export default function DividendTable({ stocks, showSector = true }: Props) {
  const t = useTranslations("table");
  const params = useParams();
  const locale = params.locale || "en";
  const [sortKey, setSortKey] = useState<SortKey>("yield");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...stocks].sort((a, b) => {
    let av: number, bv: number;
    if (sortKey === "exDate") {
      av = new Date(a.exDate).getTime();
      bv = new Date(b.exDate).getTime();
    } else if (sortKey === "yield") {
      av = a.yield;
      bv = b.yield;
    } else if (sortKey === "consecutiveYears") {
      av = a.consecutiveYears;
      bv = b.consecutiveYears;
    } else {
      av = a.amount;
      bv = b.amount;
    }
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />;
  };

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-green-700 select-none";

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className={thClass}>{t("ticker")}</th>
            <th className={thClass}>{t("name")}</th>
            <th className={thClass} onClick={() => handleSort("yield")}>
              {t("yield")} <SortIcon k="yield" />
            </th>
            <th className={thClass} onClick={() => handleSort("exDate")}>
              {t("exDate")} <SortIcon k="exDate" />
            </th>
            <th className={thClass}>{t("payDate")}</th>
            <th className={thClass} onClick={() => handleSort("amount")}>
              {t("amount")} <SortIcon k="amount" />
            </th>
            <th className={thClass} onClick={() => handleSort("consecutiveYears")}>
              {t("streak")} <SortIcon k="consecutiveYears" />
            </th>
            {showSector && <th className={thClass}>{t("sector")}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sorted.map((stock) => (
            <tr key={stock.ticker} className="hover:bg-green-50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/${locale}/stocks/${stock.ticker}`}
                  className="font-mono font-bold text-green-700 hover:text-green-900"
                >
                  {stock.ticker}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{stock.name}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getYieldColor(stock.yield)}`}>
                  {formatYield(stock.yield)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(stock.exDate)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(stock.payDate)}</td>
              <td className="px-4 py-3 text-sm font-medium">{formatCurrency(stock.amount)}</td>
              <td className="px-4 py-3 text-sm">
                {stock.consecutiveYears >= 25 ? (
                  <span className="text-amber-700 font-semibold">{stock.consecutiveYears}y 🏆</span>
                ) : (
                  <span className="text-gray-500">{stock.consecutiveYears}y</span>
                )}
              </td>
              {showSector && (
                <td className="px-4 py-3 text-xs text-gray-500">{getSectorLabel(stock.sector)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
