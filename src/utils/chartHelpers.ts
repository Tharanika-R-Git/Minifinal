import { ChartData } from '../types/dashboard';
import { getThemeColors } from './colorThemes';

export const createDefaultChartData = (type: ChartData['type'], id: string): ChartData => {
  const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const defaultData = [12, 19, 3, 5, 2];

  return {
    id,
    type,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
    labels: defaultLabels,
    datasets: [{
      label: 'Dataset 1',
      data: defaultData,
      backgroundColor: getThemeColors('Ocean', type === 'pie' || type === 'doughnut' ? defaultLabels.length : 1),
      borderColor: getThemeColors('Ocean', 1)[0],
      borderWidth: 2
    }],
    colorTheme: 'Ocean'
  };
};

export const parseCSVData = (csvText: string): { labels: string[], data: number[] } | null => {
  try {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null;

    const labels: string[] = [];
    const data: number[] = [];

    lines.forEach(line => {
      const [label, value] = line.split(',').map(item => item.trim());
      if (label && value && !isNaN(Number(value))) {
        labels.push(label);
        data.push(Number(value));
      }
    });

    return labels.length > 0 ? { labels, data } : null;
  } catch (error) {
    return null;
  }
};

export const generateSampleData = (type: ChartData['type']): Partial<ChartData> => {
  const samples = {
    bar: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{ label: 'Revenue', data: [45000, 52000, 48000, 61000] }]
    },
    line: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [{ label: 'Users', data: [120, 150, 180, 220, 280] }]
    },
    pie: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{ label: 'Traffic', data: [55, 35, 10] }]
    },
    doughnut: {
      labels: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      datasets: [{ label: 'Browsers', data: [45, 25, 20, 10] }]
    },
    radar: {
      labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
      datasets: [{ label: 'Performance', data: [8, 7, 9, 6, 8] }]
    },
    scatter: {
      labels: ['Data Points'],
      datasets: [{ label: 'Correlation', data: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }] as any }]
    }
  };

  return samples[type] || samples.bar;
};