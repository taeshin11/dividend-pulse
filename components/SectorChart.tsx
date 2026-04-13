"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Sector } from "@/types/dividend";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  sectors: Sector[];
}

export default function SectorChart({ sectors: sectorList }: Props) {
  const sorted = [...sectorList].sort((a, b) => b.avgYield - a.avgYield);

  const data = {
    labels: sorted.map((s) => s.name),
    datasets: [
      {
        label: "Average Dividend Yield %",
        data: sorted.map((s) => s.avgYield),
        backgroundColor: sorted.map((s) =>
          s.avgYield >= 4 ? "#bbf7d0" : s.avgYield >= 2 ? "#fef9c3" : "#fee2e2"
        ),
        borderColor: sorted.map((s) =>
          s.avgYield >= 4 ? "#16a34a" : s.avgYield >= 2 ? "#ca8a04" : "#dc2626"
        ),
        borderWidth: 1,
        borderRadius: 6,
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
          label: (ctx: import("chart.js").TooltipItem<"bar">) => `Avg Yield: ${(ctx.parsed.y ?? 0).toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v: string | number) => `${Number(v).toFixed(1)}%` },
        grid: { color: "#f0fdf4" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
