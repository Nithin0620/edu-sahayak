import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// ✅ Register required components for line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function QuizLineChart({ scores = [] }) {
  const data = {
    labels: scores.map((_, i) => `Quiz ${i + 1}`),
    datasets: [
      {
        label: "Quiz Scores",
        data: scores,
        borderColor: "rgba(37, 99, 235, 1)", // Tailwind blue-600
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderWidth: 2,  // ✅ thinner line
        tension: 0,      // ✅ straight lines (no curve)
        fill: false,     // ✅ remove area under the line
        pointRadius: 5,  // make data points visible
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "User Quiz Performance Over Time" },
    },
    scales: {
      y: { min: 0, max: 11, ticks: { stepSize: 1 } },
    },
  };

  return <Line data={data} options={options} />;
}
