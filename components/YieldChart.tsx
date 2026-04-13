"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DividendHistoryPoint } from "@/types/dividend";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface Props {
  history: DividendHistoryPoint[];
}

export default function YieldChart({ history }: Props) {
  const data = {
    labels: history.map((h) => h.month),
    datasets: [
      {
        label: "Yield %",
        data: history.map((h) => h.yield),
        borderColor: "#16a34a",
        backgroundColor: "rgba(74, 222, 128, 0.15)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#16a34a",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: import("chart.js").TooltipItem<"line">) => `Yield: ${(ctx.parsed.y ?? 0).toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        ticks: { callback: (v: string | number) => `${Number(v).toFixed(1)}%` },
        grid: { color: "#f0fdf4" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
