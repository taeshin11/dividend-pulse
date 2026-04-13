import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IncomeCalculator from "@/components/IncomeCalculator";
import { getAllStocks } from "@/lib/fallback";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: "Dividend Income Calculator — Build Your Portfolio | DividendPulse",
    description: "Calculate your annual and monthly dividend income. Add stocks to your portfolio and see your total dividend income instantly.",
    alternates: { canonical: `https://dividend-pulse.vercel.app/${locale}/calculator` },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const allStocks = getAllStocks();

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-green-900 mb-2">Dividend Income Calculator</h1>
        <p className="text-gray-500 mb-8">Build your dividend portfolio and see your projected annual income</p>

        <IncomeCalculator stocks={allStocks} />

        <div className="mt-10 bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-green-900 mb-3">How to use this calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Select a dividend stock or ETF from the dropdown</li>
            <li>Enter the number of shares you own (or plan to buy)</li>
            <li>The calculator automatically computes annual dividend income</li>
            <li>Add multiple positions to see your total portfolio income</li>
          </ol>
          <p className="text-xs text-gray-400 mt-4">
            Note: Calculations are based on current dividend amounts and may not reflect future changes.
            Past dividend payments do not guarantee future dividends.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
