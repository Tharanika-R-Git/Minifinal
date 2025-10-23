import React from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { ChartComponent } from './ChartComponent';
import { DashboardItem } from '../types/dashboard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  items: DashboardItem[];
  onLayoutChange: (layout: Layout[]) => void;
  onItemSelect: (itemId: string) => void;
  selectedItemId: string | null;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  onLayoutChange,
  onItemSelect,
  selectedItemId
}) => {
  const layouts = {
    lg: items.map(item => ({
      i: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h
    }))
  };

  return (
    <div className="dashboard-grid">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={150}
        onLayoutChange={onLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
        containerPadding={[16, 16]}
      >
        {items.map((item) => (
          <div key={item.i} className="grid-item">
            <ChartComponent
              chartData={item.chartData}
              onSelect={() => onItemSelect(item.i)}
              isSelected={selectedItemId === item.i}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};