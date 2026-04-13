# DividendPulse — PRD
## Upcoming Dividend Dates & Yields

---

## 1. Overview

**Service Name:** DividendPulse
**Tagline:** "Never miss a dividend — ex-dates, pay-dates, and streak tracking in one place"
**URL Pattern:** `dividend-pulse.vercel.app`
**GitHub Repo:** `taeshin11/dividend-pulse`

DividendPulse is a dividend calendar and data dashboard that surfaces ex-dividend dates, pay dates, yield figures, and consecutive dividend streak tracking. Data is pulled from Yahoo Finance's unofficial API and Alpha Vantage's free tier, with a static JSON fallback for reliability. ISR (Incremental Static Regeneration) ensures daily freshness without server costs.

**Target Users:**
- Dividend investors and income-focused retail traders
- FIRE/early retirement community
- Financial bloggers covering income investing
- ETF/fund investors tracking distributions

---

## 2. Core Features

| ID  | Feature                                       | Priority |
|-----|-----------------------------------------------|----------|
| F01 | Dividend calendar — this week & this month    | P0       |
| F02 | Ticker detail page `/tickers/[symbol]`        | P0       |
| F03 | Sector pages `/sectors/[sector]`              | P0       |
| F04 | `/this-week` and `/this-month` calendar views | P0       |
| F05 | Yield chart (12-month history) via Chart.js   | P0       |
| F06 | Dividend streak badge (consecutive years)     | P1       |
| F07 | Filter: by sector, yield range, ex-date range | P1       |
| F08 | i18n support (8 languages)                    | P1       |
| F09 | Visitor counter (footer)                      | P1       |
| F10 | Google Sheets webhook on interaction          | P1       |
| F11 | Adsterra ad placements                        | P1       |
| F12 | Sitemap + hreflang + schema.org               | P0       |
| F13 | ISR revalidation every 24 hours               | P0       |
| F14 | research_history/ milestone logs              | P2       |

---

## 3. Tech Stack

| Layer       | Technology                                        |
|-------------|--------------------------------------------------|
| Framework   | Next.js 14 (App Router, ISR — revalidate: 86400) |
| Styling     | Tailwind CSS v3 (mobile-first, pastel palette)   |
| Charts      | Chart.js 4 + react-chartjs-2                     |
| Data        | Yahoo Finance unofficial API + Alpha Vantage free|
| Fallback    | `data/dividends-fallback.json`                   |
| Deployment  | Vercel (`npx vercel --prod`)                     |
| Repo        | GitHub via `gh` CLI (`taeshin11/dividend-pulse`) |
| i18n        | `next-intl`                                      |
| SEO         | `next-sitemap`, JSON-LD schema                   |
| Analytics   | Vercel Analytics (free tier)                     |
| Ads         | Adsterra (Social Bar + Native Banner + Display)  |

---

## 4. Data Sources

### Primary: Yahoo Finance Unofficial API
```
GET https://query1.finance.yahoo.com/v8/finance/chart/[SYMBOL]
GET https://query1.finance.yahoo.com/v10/finance/quoteSummary/[SYMBOL]?modules=assetProfile,dividendHistory
```
- Rate limit: ~2000 req/hour (no key required)
- Fetched server-side at ISR revalidation time
- Parsed for: `dividendDate`, `exDividendDate`, `trailingAnnualDividendYield`, `dividendRate`

### Secondary: Alpha Vantage (Free Tier)
```
GET https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=[SYM]&apikey=[KEY]
```
- Free tier: 25 requests/day, 500 requests/month
- Used for dividend history (12 months)
- Key stored in `ALPHA_VANTAGE_KEY` env variable

### Fallback: Static JSON
- `data/dividends-fallback.json` — 100 high-yield tickers with hardcoded data
- `data/sectors.json` — sector taxonomy
- `data/tickers-watchlist.json` — curated watchlist of 200 dividend tickers

### Data Refresh Strategy
- ISR: revalidate every 86400 seconds (24h)
- Build-time: pre-generate top 100 tickers from watchlist
- On-demand: remaining tickers generated on first visit
- Fallback: if API call fails, serve stale fallback JSON

---

## 5. Page Structure & SEO

### `/` — Homepage (Dividend Calendar Dashboard)
- **Title:** "Dividend Calendar April 2026 — Ex-Dates, Pay-Dates & Yields | DividendPulse"
- **H1:** "Upcoming Dividend Dates This Week"
- Weekly calendar grid (Mon–Fri ex-dates)
- Top 10 highest yield tickers (badge cards)
- Upcoming pay dates table (next 14 days)
- Filter bar: sector, yield min/max
- Native Banner ad below hero
- Schema: `WebSite`, `Table`, `ItemList`

### `/tickers/[symbol]` — Ticker Detail
- **Title:** `[COMPANY] (SYMBOL) Dividend: Ex-Date, Yield & History | DividendPulse`
- **H1:** `[COMPANY] Dividend Details`
- Key stats: yield, annual dividend, ex-date, pay-date, streak
- 12-month yield chart (Chart.js line)
- Dividend history table (last 10 payments)
- "Similar Dividend Stocks" grid (same sector)
- Display banner mid-page
- Schema: `FinancialProduct`, `BreadcrumbList`

### `/sectors/[sector]` — Sector Pages
- Sectors: `technology`, `financials`, `utilities`, `healthcare`, `energy`, `consumer-staples`, `real-estate`, `industrials`
- **Title:** `[Sector] Dividend Stocks — Yields & Ex-Dates | DividendPulse`
- Ranked ticker list with yield badges
- Sector average yield stat
- Schema: `ItemList`, `BreadcrumbList`

### `/this-week` — Weekly Calendar
- **Title:** "This Week's Ex-Dividend Dates (April 14–18, 2026) | DividendPulse"
- Day-by-day calendar view
- Each day lists ex-date stocks with yield
- Schema: `Event` (for each ex-date)

### `/this-month` — Monthly Calendar
- **Title:** "April 2026 Dividend Calendar — All Ex-Dates | DividendPulse"
- Full month grid view
- Filterable by sector and yield floor
- Downloadable CSV (client-side generation)

### SEO Infrastructure
```
/sitemap.xml         — next-sitemap (all tickers + sectors)
/robots.txt          — allow all
/[lang]/...          — hreflang for 8 locales
```

---

## 6. UI/UX Design

### Color Palette (Soft Pastel)
```css
--bg-primary:    #F0FDF4   /* soft mint */
--bg-card:       #FFFFFF
--bg-accent:     #DCFCE7   /* light green */
--text-primary:  #14532D
--text-secondary:#6B7280
--yield-high:    #BBF7D0   /* high yield badge */
--yield-mid:     #FEF9C3   /* mid yield badge */
--yield-low:     #FEE2E2   /* low yield badge */
--cta-button:    #16A34A   /* green */
--border:        #E5E7EB
--chart-line:    #4ADE80
```

### Layout Principles
- Mobile-first: calendar collapses to list on mobile
- Card component: ticker symbol prominent (monospace font), yield large
- Calendar grid: CSS Grid, responsive (7-col desktop → single col mobile)
- Chart: full-width on mobile, 60% on desktop
- Color-coded yield badges: green (>4%), yellow (2–4%), red (<2%)

### Key Components
- `CalendarGrid` — weekly/monthly ex-date grid
- `TickerCard` — symbol, name, yield badge, ex-date
- `YieldChart` — Chart.js line chart (12mo history)
- `StreakBadge` — consecutive years badge (🏆 icon optional)
- `SectorFilter` — pill-style multi-select
- `DividendTable` — sortable payment history

---

## 7. i18n Configuration

**Supported Locales:** `en`, `ko`, `ja`, `zh`, `es`, `fr`, `de`, `pt`
**Default Locale:** `en`
**Library:** `next-intl`

**Key Translation Strings:**
```json
{
  "hero.title": "Upcoming Dividend Dates",
  "hero.subtitle": "Track ex-dates, pay-dates, and yields for {count} stocks",
  "calendar.thisWeek": "This Week",
  "calendar.thisMonth": "This Month",
  "ticker.yield": "Dividend Yield",
  "ticker.exDate": "Ex-Dividend Date",
  "ticker.payDate": "Pay Date",
  "ticker.streak": "Consecutive Years",
  "ticker.annualDividend": "Annual Dividend",
  "sector.avgYield": "Sector Average Yield",
  "filter.sector": "Sector",
  "filter.yieldMin": "Min Yield %",
  "footer.visitorsToday": "Visitors today",
  "footer.visitorsTotal": "Total visitors"
}
```

---

## 8. Ad Integration (Adsterra)

### Social Bar — `<head>`
```html
<!-- TODO: Replace with Adsterra Social Bar script -->
<!-- ADSTERRA_SOCIAL_BAR_PLACEHOLDER -->
```

### Native Banner — Below Hero Section
```html
<!-- TODO: Adsterra Native Banner — place below hero calendar -->
<div id="adsterra-native-banner" class="my-6 w-full">
  {/* ADSTERRA_NATIVE_BANNER_PLACEHOLDER */}
</div>
```

### Display Banner — Mid-Page (Ticker Detail)
```html
<!-- TODO: Adsterra Display Banner 728x90 / 320x50 -->
<div id="adsterra-display-banner" class="my-8 flex justify-center">
  {/* ADSTERRA_DISPLAY_BANNER_PLACEHOLDER */}
</div>
```

---

## 9. Google Sheets Webhook

**Trigger:** ticker_view, sector_browse, calendar_view, filter_apply, csv_download

### Payload Schema
```json
{
  "event": "ticker_view | sector_browse | calendar_view | filter_apply | csv_download",
  "symbol": "AAPL",
  "sector": "technology",
  "locale": "en",
  "timestamp": "2026-04-13T12:00:00Z",
  "page": "/tickers/AAPL"
}
```

### Apps Script (Google Sheets)
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("interactions");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.event, data.symbol,
    data.sector, data.locale, data.page
  ]);
  return ContentService.createTextOutput("OK");
}
```

---

## 10. Visitor Counter

**Placement:** Footer, subtle right-aligned text
**Storage:** Upstash Redis free tier (10,000 req/day)

```tsx
// components/VisitorCounter.tsx
// Text: "Today: 287 | All-time: 14,203"
// Incremented once per session (sessionStorage flag)
// API: GET /api/visitor-count → { today, total }
//      POST /api/visitor-count → increment
```

---

## 11. Milestones & Git Strategy

### Milestone 1 — Scaffold
- Next.js 14 + Tailwind + next-intl + Chart.js
- `gh repo create taeshin11/dividend-pulse --public`
- `feature_list.json`, `claude-progress.txt`, `init.sh`
- `research_history/` folder
- **Commit:** `feat: scaffold Next.js with Chart.js and i18n`
- `git push origin main`

### Milestone 2 — Data Layer
- Yahoo Finance API fetcher (`lib/yahoo.ts`)
- Alpha Vantage fetcher (`lib/alphavantage.ts`)
- Fallback JSON parser (`lib/fallback.ts`)
- Type definitions (`types/dividend.ts`)
- `data/dividends-fallback.json` (100 tickers)
- `data/tickers-watchlist.json`
- **Commit:** `feat: data layer — Yahoo Finance + Alpha Vantage + fallback`
- `git push origin main`

### Milestone 3 — Homepage + Calendar
- CalendarGrid component (weekly view)
- Top yields leaderboard
- Filter bar (sector, yield range)
- This-week and this-month pages
- **Commit:** `feat: homepage with dividend calendar and leaderboard`
- `git push origin main`

### Milestone 4 — Ticker + Sector Pages
- `/tickers/[symbol]` with YieldChart
- `/sectors/[sector]` ranked list
- StreakBadge component
- DividendTable (payment history)
- **Commit:** `feat: ticker detail and sector pages with charts`
- `git push origin main`

### Milestone 5 — SEO Layer
- next-sitemap (all tickers + sectors)
- JSON-LD schema (FinancialProduct, ItemList, Event)
- hreflang tags
- Meta templates
- **Commit:** `feat: SEO — sitemap, schema.org, hreflang`
- `git push origin main`

### Milestone 6 — i18n
- 8 locale translation files
- Locale switcher
- **Commit:** `feat: i18n — 8 locales`
- `git push origin main`

### Milestone 7 — Integrations
- Google Sheets webhook
- Visitor counter (Upstash Redis)
- Adsterra placeholders
- **Commit:** `feat: webhook, visitor counter, ad placeholders`
- `git push origin main`

### Milestone 8 — Deploy
- `npx vercel --prod`
- Set env vars
- ISR smoke test
- **Commit:** `chore: production deploy verified`
- `git push origin main`

---

## 12. File Structure

```
dividend-pulse/
├── PRD.md
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── research_history/
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── data/
│   ├── dividends-fallback.json
│   ├── tickers-watchlist.json
│   └── sectors.json
├── messages/
│   ├── en.json  ├── ko.json  ├── ja.json  ├── zh.json
│   ├── es.json  ├── fr.json  ├── de.json  └── pt.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── tickers/[symbol]/page.tsx
│   │   ├── sectors/[sector]/page.tsx
│   │   ├── this-week/page.tsx
│   │   └── this-month/page.tsx
│   └── api/
│       └── visitor-count/route.ts
├── components/
│   ├── layout/Header.tsx
│   ├── layout/Footer.tsx
│   ├── layout/LocaleSwitcher.tsx
│   ├── calendar/CalendarGrid.tsx
│   ├── calendar/DayCell.tsx
│   ├── tickers/TickerCard.tsx
│   ├── tickers/YieldChart.tsx
│   ├── tickers/StreakBadge.tsx
│   ├── tickers/DividendTable.tsx
│   ├── filters/FilterBar.tsx
│   ├── ads/SocialBar.tsx
│   ├── ads/NativeBanner.tsx
│   ├── ads/DisplayBanner.tsx
│   └── VisitorCounter.tsx
├── lib/
│   ├── yahoo.ts
│   ├── alphavantage.ts
│   ├── fallback.ts
│   ├── webhook.ts
│   └── utils.ts
├── types/
│   └── dividend.ts
├── next.config.js
├── next-sitemap.config.js
├── tailwind.config.js
└── package.json
```

---

## 13. Harness Spec

### `feature_list.json`
```json
{
  "project": "dividend-pulse",
  "version": "1.0.0",
  "features": [
    { "id": "F01", "name": "Dividend calendar this week/month", "status": "pending" },
    { "id": "F02", "name": "Ticker detail with chart", "status": "pending" },
    { "id": "F03", "name": "Sector pages", "status": "pending" },
    { "id": "F04", "name": "This-week and this-month pages", "status": "pending" },
    { "id": "F05", "name": "Yield chart Chart.js", "status": "pending" },
    { "id": "F06", "name": "Dividend streak badge", "status": "pending" },
    { "id": "F07", "name": "Filter by sector and yield", "status": "pending" },
    { "id": "F08", "name": "i18n 8 locales", "status": "pending" },
    { "id": "F09", "name": "Visitor counter", "status": "pending" },
    { "id": "F10", "name": "Google Sheets webhook", "status": "pending" },
    { "id": "F11", "name": "Adsterra ads", "status": "pending" },
    { "id": "F12", "name": "SEO sitemap hreflang schema", "status": "pending" },
    { "id": "F13", "name": "ISR 24h revalidation", "status": "pending" },
    { "id": "F14", "name": "Research history logs", "status": "pending" }
  ]
}
```

### `claude-progress.txt`
```
# DividendPulse — Claude Build Progress

MILESTONE_1=pending
MILESTONE_2=pending
MILESTONE_3=pending
MILESTONE_4=pending
MILESTONE_5=pending
MILESTONE_6=pending
MILESTONE_7=pending
MILESTONE_8=pending
LAST_UPDATED=
DEPLOY_URL=
```

### `init.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== DividendPulse Init ==="

npx create-next-app@latest . \
  --typescript --tailwind --eslint \
  --app --src-dir=false --import-alias="@/*" --no-git

npm install next-intl next-sitemap chart.js react-chartjs-2 \
  @vercel/analytics @upstash/redis

gh repo create taeshin11/dividend-pulse \
  --public --source=. --remote=origin --push

mkdir -p research_history data messages \
  components/layout components/calendar \
  components/tickers components/filters components/ads \
  lib types app/api/visitor-count

git add .
git commit -m "chore: initial scaffold"
git push origin main

echo "=== Init complete ==="
```

---

## 14. Environment Variables

```env
ALPHA_VANTAGE_KEY=your_key_here
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/[ID]/exec
NEXT_PUBLIC_SITE_URL=https://dividend-pulse.vercel.app
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 15. ISR Configuration

```typescript
// All ticker pages
export const revalidate = 86400; // 24 hours

// This-week page
export const revalidate = 3600; // 1 hour (more time-sensitive)

// generateStaticParams — pre-build top 100 tickers
export async function generateStaticParams() {
  const watchlist = await import('@/data/tickers-watchlist.json');
  return watchlist.top100.map((symbol: string) => ({ symbol }));
}
```

---

## 16. Chart.js Configuration

```typescript
// components/tickers/YieldChart.tsx
// Line chart: x-axis = months (Jan–Dec), y-axis = yield %
// Pastel green fill, smooth curve (tension: 0.4)
// Responsive: true, maintainAspectRatio: false
// Height: 200px mobile, 300px desktop
// Tooltip: "Yield: X.XX%"
// No legend (single dataset)
```

**Programmatic SEO target:** 2,000+ indexable pages (tickers × sectors × calendar pages).
