import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DividendTable from "@/components/DividendTable";
import { getAllSectors, getSectorBySlug, getStocksBySector } from "@/lib/fallback";

export const revalidate = 86400;

export async function generateStaticParams() {
  const sectors = getAllSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};
  return {
    title: `${sector.name} Dividend Stocks — Yields & Ex-Dates | DividendPulse`,
    description: `Best ${sector.name} dividend stocks with average yield of ${sector.avgYield.toFixed(2)}%. Compare ex-dates, pay-dates and dividend streaks.`,
    alternates: { canonical: `https://dividend-pulse.vercel.app/${locale}/sectors/${slug}` },
  };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  const stocks = getStocksBySector(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${sector.name} Dividend Stocks`,
    "description": sector.description,
    "numberOfItems": stocks.length,
    "itemListElement": stocks.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": s.name,
      "url": `https://dividend-pulse.vercel.app/${locale}/stocks/${s.ticker}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href={`/${locale}`} className="hover:text-green-700">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/sectors`} className="hover:text-green-700">Sectors</Link>
          <span>/</span>
          <span className="text-green-800 font-medium">{sector.name}</span>
        </nav>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900">{sector.name} Dividend Stocks</h1>
            <p className="text-gray-500 mt-1">{sector.description}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-800">{sector.avgYield.toFixed(2)}%</div>
            <div className="text-xs text-gray-500">Sector Avg Yield</div>
          </div>
        </div>

        {stocks.length > 0 ? (
          <DividendTable stocks={stocks} showSector={false} />
        ) : (
          <div className="text-center py-12 text-gray-400">No dividend stocks found in this sector.</div>
        )}
      </main>
      <Footer />
    </>
  );
}
