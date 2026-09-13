import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function SkillRadarChart({ labels = [], data = [] }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Skill Level',
        data,
        backgroundColor: 'rgba(56, 189, 248, 0.18)',
        borderColor: '#38bdf8',
        pointBackgroundColor: '#7dd3fc',
        pointBorderColor: '#e0f2fe',
        borderWidth: 1.5,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.2)' },
        grid: { color: 'rgba(148, 163, 184, 0.2)' },
        pointLabels: { color: '#cbd5e1', font: { size: 11 } },
        suggestedMin: 0,
        suggestedMax: Math.max(10, ...(data || [0])),
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  if (!labels.length) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-500">
        Add skills to populate your radar chart.
      </div>
    );
  }

  return (
    <div className="h-72">
      <Radar data={chartData} options={options} />
    </div>
  );
}
