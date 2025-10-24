import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ChartComponent = ({ chartData, onSelect, isSelected = false }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: chartData.title,
        color: '#F9FAFB',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales:
      chartData.type !== 'pie' &&
      chartData.type !== 'doughnut' &&
      chartData.type !== 'radar'
        ? {
            x: {
              ticks: {
                color: '#9CA3AF'
              },
              grid: {
                color: '#374151'
              }
            },
            y: {
              ticks: {
                color: '#9CA3AF'
              },
              grid: {
                color: '#374151'
              }
            }
          }
        : undefined,
    onClick: onSelect
  };

  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets
  };

  const renderChart = () => {
    switch (chartData.type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'radar':
        return <Radar data={data} options={options} />;
      case 'scatter':
        return <Scatter data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <div
      className={`w-full h-full bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      {renderChart()}
    </div>
  );
};

ChartComponent.propTypes = {
  chartData: PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.array.isRequired
  }).isRequired,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool
};
