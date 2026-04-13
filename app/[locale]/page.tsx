import { useTranslations } from "next-intl";
import Link from "next/link";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockCard from "@/components/StockCard";
import DividendTable from "@/components/DividendTable";
import {
  getAllStocks,
  getUpcomingExDates,
  getTopYieldStocks,
  getDividendAristocrats,
} from "@/lib/fallback";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Dividend Calendar April 2026 — Ex-Dates, Pay-Dates & Yields | DividendPulse",
    description: "Track upcoming dividend ex-dates, pay-dates and yields. Find the highest dividend stocks, ETFs and REITs with streak data.",
    alternates: {
      canonical: `https://dividend-pulse.vercel.app/${locale}`,
      languages: {
        "en": "https://dividend-pulse.vercel.app/en",
        "ko": "https://dividend-pulse.vercel.app/ko",
        "ja": "https://dividend-pulse.vercel.app/ja",
        "zh": "https://dividend-pulse.vercel.app/zh",
        "es": "https://dividend-pulse.vercel.app/es",
        "fr": "https://dividend-pulse.vercel.app/fr",
        "de": "https://dividend-pulse.vercel.app/de",
        "pt": "https://dividend-pulse.vercel.app/pt",
      },
    },
  };
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const allStocks = getAllStocks();
  const upcoming = getUpcomingExDates(30);
  const topYield = getTopYieldStocks(10);
  const aristocrats = getDividendAristocrats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DividendPulse",
    "url": "https://dividend-pulse.vercel.app",
    "description": "Track upcoming dividend ex-dates, pay-dates and yields",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://dividend-pulse.vercel.app/${locale}/stocks?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-900 mb-3">{t("title")}</h1>
          <p className="text-lg text-gray-600">
            {t("subtitle", { count: allStocks.length })}
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href={`/${locale}/calendar`}
              className="px-6 py-2.5 rounded-full text-white font-medium text-sm"
              style={{ backgroundColor: "#16a34a" }}
            >
              {t("thisWeek")}
            </Link>
            <Link
              href={`/${locale}/stocks`}
              className="px-6 py-2.5 rounded-full font-medium text-sm border border-green-600 text-green-700 hover:bg-green-50"
            >
              All Stocks
            </Link>
          </div>
        </div>

        {/* Ad placeholder */}
        <div id="adsterra-native-banner" className="my-6 w-full bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 text-xs">
          Advertisement
        </div>

        {/* Top Yield Stocks */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-900 mb-5">Top Dividend Yields</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topYield.map((stock) => (
              <StockCard key={stock.ticker} stock={stock} locale={locale} />
            ))}
          </div>
        </section>

        {/* Upcoming Ex-Dates Table */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-green-900">Upcoming Ex-Dates (Next 30 Days)</h2>
            <Link href={`/${locale}/calendar`} className="text-sm text-green-600 hover:underline">
              {tCommon("viewAll")} →
            </Link>
          </div>
          <DividendTable stocks={upcoming} />
        </section>

        {/* Dividend Aristocrats */}
        {aristocrats.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-green-900 mb-2">Dividend Aristocrats</h2>
            <p className="text-gray-500 text-sm mb-5">Companies with 25+ consecutive years of dividend payments</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {aristocrats.map((stock) => (
                <StockCard key={stock.ticker} stock={stock} locale={locale} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is an ex-dividend date?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The ex-dividend date is the cutoff date to qualify for a dividend payment. You must own the stock before this date to receive the dividend.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "What is dividend yield?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dividend yield is the annual dividend payment divided by the stock price, expressed as a percentage. It shows how much income you receive relative to your investment.",
                  },
                },
              ],
            }),
          }}
        />
      </main>

      <Footer />
    </>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeContent locale={locale} />;
}
