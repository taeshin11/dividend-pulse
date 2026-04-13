"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Calculator } from "lucide-react";
import { DividendStock } from "@/types/dividend";
import { formatCurrency } from "@/lib/utils";

interface Props {
  stocks: DividendStock[];
}

interface PortfolioEntry {
  ticker: string;
  shares: number;
  stock: DividendStock | null;
}

export default function IncomeCalculator({ stocks }: Props) {
  const t = useTranslations("calculator");
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([
    { ticker: "", shares: 100, stock: null },
  ]);

  const addRow = () => setPortfolio([...portfolio, { ticker: "", shares: 100, stock: null }]);

  const removeRow = (i: number) => setPortfolio(portfolio.filter((_, idx) => idx !== i));

  const updateRow = (i: number, field: "ticker" | "shares", value: string | number) => {
    const updated = [...portfolio];
    if (field === "ticker") {
      const found = stocks.find((s) => s.ticker === value);
      updated[i] = { ...updated[i], ticker: value as string, stock: found || null };
    } else {
      updated[i] = { ...updated[i], shares: Number(value) };
    }
    setPortfolio(updated);
  };

  const results = portfolio.map((row) => {
    if (!row.stock || !row.shares) return 0;
    const annualPerShare = row.stock.amount * (
      row.stock.frequency === "monthly" ? 12 :
      row.stock.frequency === "quarterly" ? 4 :
      row.stock.frequency === "semi-annual" ? 2 : 1
    );
    return row.shares * annualPerShare;
  });

  const totalAnnual = results.reduce((a, b) => a + b, 0);
  const totalMonthly = totalAnnual / 12;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-bold text-green-900">{t("title")}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">{t("subtitle")}</p>

      <div className="space-y-3 mb-6">
        {portfolio.map((row, i) => (
          <div key={i} className="flex gap-3 items-center">
            <select
              value={row.ticker}
              onChange={(e) => updateRow(i, "ticker", e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select stock...</option>
              {stocks.map((s) => (
                <option key={s.ticker} value={s.ticker}>
                  {s.ticker} — {s.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={row.shares}
              onChange={(e) => updateRow(i, "shares", e.target.value)}
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder={t("shares")}
            />
            <div className="w-24 text-sm font-medium text-green-700 text-right">
              {results[i] > 0 ? formatCurrency(results[i]) : "—"}
            </div>
            <button
              onClick={() => removeRow(i)}
              className="text-red-400 hover:text-red-600 p-1"
              disabled={portfolio.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 mb-8"
      >
        <Plus className="h-4 w-4" />
        {t("addStock")}
      </button>

      {/* Results */}
      {totalAnnual > 0 && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800">{formatCurrency(totalAnnual)}</div>
            <div className="text-xs text-gray-500 mt-1">{t("totalIncome")}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalMonthly)}</div>
            <div className="text-xs text-gray-500 mt-1">{t("monthlyIncome")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
