interface WebhookPayload {
  event: "ticker_view" | "sector_browse" | "calendar_view" | "filter_apply" | "csv_download";
  symbol?: string;
  sector?: string;
  locale: string;
  timestamp: string;
  page: string;
}

export async function trackEvent(payload: Omit<WebhookPayload, "timestamp">): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Silently fail — webhook is non-critical
  }
}
