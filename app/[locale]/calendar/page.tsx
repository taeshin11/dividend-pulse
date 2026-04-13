import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DividendCalendar from "@/components/DividendCalendar";
import DividendTable from "@/components/DividendTable";
import { getAllStocks, getUpcomingExDates } from "@/lib/fallback";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();
  return {
    title: `${month} ${year} Dividend Calendar — All Ex-Dates | DividendPulse`,
    description: `Complete dividend calendar for ${month} ${year}. See all ex-dividend dates and pay dates for top stocks and ETFs.`,
    alternates: { canonical: `https://dividend-pulse.vercel.app/${locale}/calendar` },
  };
}

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const allStocks = getAllStocks();
  const upcoming = getUpcomingExDates(60);
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthName = now.toLocaleString("en-US", { month: "long" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${monthName} ${year} Dividend Calendar`,
    "description": `Dividend ex-dates and pay dates for ${monthName} ${year}`,
    "url": `https://dividend-pulse.vercel.app/en/calendar`,
  };

  // This week
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const thisWeekStocks = allStocks.filter((s) => {
    const d = new Date(s.exDate);
    return d >= startOfWeek && d <= endOfWeek;
  }).sort((a, b) => new Date(a.exDate).getTime() - new Date(b.exDate).getTime());

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">
          {monthName} {year} Dividend Calendar
        </h1>
        <p className="text-gray-500 mb-8">Monthly ex-dividend date calendar for top dividend stocks</p>

        <DividendCalendar stocks={allStocks} month={month} year={year} />

        {thisWeekStocks.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-green-900 mb-4">This Week&apos;s Ex-Dates</h2>
            <DividendTable stocks={thisWeekStocks} />
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold text-green-900 mb-4">Next 60 Days — Upcoming Ex-Dates</h2>
          <DividendTable stocks={upcoming} />
        </div>
      </main>
      <Footer />
    </>
  );
}
