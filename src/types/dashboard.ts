export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'scatter';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
  colorTheme: string;
}

export interface DashboardItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  chartData: ChartData;
}

export interface Dashboard {
  id: string;
  name: string;
  items: DashboardItem[];
  layout: any[];
}

export interface ColorTheme {
  name: string;
  colors: string[];
  gradient?: boolean;
}