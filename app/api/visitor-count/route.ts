import { NextResponse } from "next/server";

// Simple in-memory counter for demo purposes
// In production, use Upstash Redis
let todayCount = Math.floor(Math.random() * 500) + 100;
let totalCount = Math.floor(Math.random() * 50000) + 10000;
let lastResetDate = new Date().toDateString();

export async function GET() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    todayCount = 0;
    lastResetDate = today;
  }
  return NextResponse.json({ today: todayCount, total: totalCount });
}

export async function POST() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    todayCount = 0;
    lastResetDate = today;
  }
  todayCount++;
  totalCount++;
  return NextResponse.json({ today: todayCount, total: totalCount });
}
