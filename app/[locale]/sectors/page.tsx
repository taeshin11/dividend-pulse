import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectorChart from "@/components/SectorChart";
import { getAllSectors } from "@/lib/fallback";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Dividend Sectors — Average Yields by Industry | DividendPulse",
    description: "Compare dividend yields across sectors: utilities, technology, financials, healthcare, energy and more.",
    alternates: { canonical: `https://dividend-pulse.vercel.app/${locale}/sectors` },
  };
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const sectors = getAllSectors().filter((s) => s.stockCount > 0);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">Dividend Sectors</h1>
        <p className="text-gray-500 mb-8">Average dividend yields by industry sector</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-green-900 mb-4">Sector Yield Comparison</h2>
          <SectorChart sectors={sectors} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.sort((a, b) => b.avgYield - a.avgYield).map((sector) => (
            <Link key={sector.id} href={`/${locale}/sectors/${sector.slug}`}>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-green-900">{sector.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{sector.stockCount} stocks</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    sector.avgYield >= 4 ? "bg-green-100 text-green-800" :
                    sector.avgYield >= 2 ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {sector.avgYield.toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400">{sector.description}</p>
                <div className="mt-3 text-xs text-green-600 font-medium">Avg yield →</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
