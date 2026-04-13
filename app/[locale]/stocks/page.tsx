"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DividendTable from "@/components/DividendTable";
import { getAllStocks, getAllSectors } from "@/lib/fallback";

export default function StocksPage() {
  const t = useTranslations("filter");
  const params = useParams();
  const locale = params.locale || "en";

  const allStocks = getAllStocks();
  const sectors = getAllSectors();

  const [sectorFilter, setSectorFilter] = useState("all");
  const [minYield, setMinYield] = useState("");
  const [maxYield, setMaxYield] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return allStocks.filter((stock) => {
      if (sectorFilter !== "all" && stock.sector !== sectorFilter) return false;
      if (minYield && stock.yield < parseFloat(minYield)) return false;
      if (maxYield && stock.yield > parseFloat(maxYield)) return false;
      if (search && !stock.ticker.toLowerCase().includes(search.toLowerCase()) && !stock.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allStocks, sectorFilter, minYield, maxYield, search]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">All Dividend Stocks</h1>
        <p className="text-gray-500 mb-6">Sortable table of {allStocks.length} dividend-paying stocks and ETFs</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Search ticker or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">{t("all")}</option>
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder={t("yieldMin")}
            value={minYield}
            onChange={(e) => setMinYield(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder={t("yieldMax")}
            value={maxYield}
            onChange={(e) => setMaxYield(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => { setSectorFilter("all"); setMinYield(""); setMaxYield(""); setSearch(""); }}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg"
          >
            {t("reset")}
          </button>
          <span className="text-sm text-gray-400 self-center">{filtered.length} stocks</span>
        </div>

        <DividendTable stocks={filtered} showSector={true} />
      </main>
      <Footer />
    </>
  );
}
