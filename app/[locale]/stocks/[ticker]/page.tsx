import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YieldChart from "@/components/YieldChart";
import StockCard from "@/components/StockCard";
import { getStockByTicker, getStocksBySector, getAllStocks, generateDividendHistory } from "@/lib/fallback";
import { formatDate, formatCurrency, formatYield, getYieldColor, getSectorLabel } from "@/lib/utils";
import { Calendar, TrendingUp, Award, DollarSign } from "lucide-react";

export const revalidate = 86400;

export async function generateStaticParams() {
  const stocks = getAllStocks();
  return stocks.map((s) => ({ ticker: s.ticker }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string; locale: string }> }) {
  const { ticker, locale } = await params;
  const stock = getStockByTicker(ticker);
  if (!stock) return {};
  return {
    title: `${stock.name} (${stock.ticker}) Dividend: Ex-Date, Yield & History | DividendPulse`,
    description: `${stock.ticker} dividend yield: ${stock.yield.toFixed(2)}%, ex-date: ${stock.exDate}, pay-date: ${stock.payDate}. ${stock.consecutiveYears} consecutive years.`,
    alternates: {
      canonical: `https://dividend-pulse.vercel.app/${locale}/stocks/${ticker}`,
    },
  };
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ ticker: string; locale: string }>;
}) {
  const { ticker, locale } = await params;
  const stock = getStockByTicker(ticker);
  if (!stock) notFound();

  const history = generateDividendHistory(stock);
  const sectorStocks = getStocksBySector(stock.sector)
    .filter((s) => s.ticker !== stock.ticker)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "name": stock.name,
    "description": `${stock.ticker} dividend stock with ${stock.yield.toFixed(2)}% yield`,
    "url": `https://dividend-pulse.vercel.app/${locale}/stocks/${stock.ticker}`,
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Dividend Yield", "value": `${stock.yield}%` },
      { "@type": "PropertyValue", "name": "Ex-Dividend Date", "value": stock.exDate },
      { "@type": "PropertyValue", "name": "Pay Date", "value": stock.payDate },
      { "@type": "PropertyValue", "name": "Consecutive Years", "value": stock.consecutiveYears },
    ],
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://dividend-pulse.vercel.app/${locale}` },
      { "@type": "ListItem", "position": 2, "name": "Stocks", "item": `https://dividend-pulse.vercel.app/${locale}/stocks` },
      { "@type": "ListItem", "position": 3, "name": stock.ticker, "item": `https://dividend-pulse.vercel.app/${locale}/stocks/${stock.ticker}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href={`/${locale}`} className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/stocks`} className="hover:text-green-700">Stocks</Link>
          <span>/</span>
          <span className="text-green-800 font-medium">{stock.ticker}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-900">{stock.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-2xl font-bold text-green-700">{stock.ticker}</span>
                <span className="text-sm text-gray-500">{getSectorLabel(stock.sector)}</span>
                {stock.consecutiveYears >= 25 && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded">
                    🏆 Dividend Aristocrat
                  </span>
                )}
              </div>
            </div>
            <span className={`text-3xl font-bold px-4 py-2 rounded-xl ${getYieldColor(stock.yield)}`}>
              {formatYield(stock.yield)}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Calendar className="h-3 w-3" /> Ex-Dividend Date
              </div>
              <div className="font-semibold text-green-900">{formatDate(stock.exDate)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <DollarSign className="h-3 w-3" /> Pay Date
              </div>
              <div className="font-semibold text-green-900">{formatDate(stock.payDate)}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <TrendingUp className="h-3 w-3" /> Dividend Amount
              </div>
              <div className="font-semibold text-green-900">{formatCurrency(stock.amount)} / {stock.frequency}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Award className="h-3 w-3" /> Consecutive Years
              </div>
              <div className="font-semibold text-green-900">{stock.consecutiveYears} years</div>
            </div>
          </div>
        </div>

        {/* Ad placeholder */}
        <div id="adsterra-display-banner" className="my-6 flex justify-center">
          <div className="bg-gray-100 rounded-lg h-20 w-full max-w-2xl flex items-center justify-center text-gray-400 text-xs">
            Advertisement
          </div>
        </div>

        {/* Yield Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-green-900 mb-4">12-Month Yield History</h2>
          <YieldChart history={history} />
        </div>

        {/* Dividend History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-green-900 mb-4">Dividend History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase">
                  <th className="text-left py-2 pr-4">Month</th>
                  <th className="text-left py-2 pr-4">Amount</th>
                  <th className="text-left py-2">Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((h) => (
                  <tr key={h.month} className="hover:bg-green-50">
                    <td className="py-2 pr-4 text-gray-600">{h.month} 2025</td>
                    <td className="py-2 pr-4 font-medium">{formatCurrency(h.amount)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${getYieldColor(h.yield)}`}>
                        {formatYield(h.yield)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similar stocks */}
        {sectorStocks.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-green-900 mb-4">Similar Dividend Stocks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {sectorStocks.map((s) => (
                <StockCard key={s.ticker} stock={s} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
