"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const t = useTranslations("nav");
  const params = useParams();
  const locale = params.locale || "en";
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/stocks`, label: t("stocks") },
    { href: `/${locale}/sectors`, label: t("sectors") },
    { href: `/${locale}/calendar`, label: t("calendar") },
    { href: `/${locale}/calculator`, label: t("calculator") },
  ];

  const locales = ["en", "ko", "ja", "zh", "es", "fr", "de", "pt"];

  return (
    <nav style={{ backgroundColor: "#052e16" }} className="sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <span className="text-white font-bold text-xl">DividendPulse</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-green-100 hover:text-white text-sm font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Locale switcher */}
          <div className="hidden md:flex items-center gap-2">
            <select
              onChange={(e) => {
                const path = window.location.pathname.replace(`/${locale}`, `/${e.target.value}`);
                window.location.href = path;
              }}
              value={locale as string}
              className="bg-green-900 text-green-100 text-xs rounded px-2 py-1 border border-green-700"
            >
              {locales.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-green-100 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ backgroundColor: "#052e16" }} className="md:hidden border-t border-green-800">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-green-100 hover:text-white py-1 text-sm"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-green-800">
              <select
                onChange={(e) => {
                  const path = window.location.pathname.replace(`/${locale}`, `/${e.target.value}`);
                  window.location.href = path;
                }}
                value={locale as string}
                className="bg-green-900 text-green-100 text-xs rounded px-2 py-1"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
