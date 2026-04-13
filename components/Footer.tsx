"use client";

import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const t = useTranslations("footer");
  const [visitors, setVisitors] = useState<{ today: number; total: number } | null>(null);

  useEffect(() => {
    // Track visit
    const visited = sessionStorage.getItem("dp_visited");
    if (!visited) {
      sessionStorage.setItem("dp_visited", "1");
      fetch("/api/visitor-count", { method: "POST" }).catch(() => {});
    }
    // Get count
    fetch("/api/visitor-count")
      .then((r) => r.json())
      .then((d) => setVisitors(d))
      .catch(() => {});
  }, []);

  return (
    <footer style={{ backgroundColor: "#052e16" }} className="text-green-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="font-bold text-white">DividendPulse</span>
          </div>

          <div className="text-xs text-green-300 max-w-md">
            {t("disclaimer")}
          </div>

          {visitors && (
            <div className="text-xs text-green-400 text-right">
              <div>{t("visitorsToday")}: {visitors.today.toLocaleString()}</div>
              <div>{t("visitorsTotal")}: {visitors.total.toLocaleString()}</div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-green-800 text-xs text-green-400 text-center">
          © {new Date().getFullYear()} DividendPulse. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
