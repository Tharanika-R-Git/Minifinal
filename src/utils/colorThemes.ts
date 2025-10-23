import { ColorTheme } from '../types/dashboard';

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Ocean',
    colors: ['#3B82F6', '#1E40AF', '#06B6D4', '#0891B2', '#0E7490', '#164E63']
  },
  {
    name: 'Sunset',
    colors: ['#F97316', '#EA580C', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D']
  },
  {
    name: 'Forest',
    colors: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22']
  },
  {
    name: 'Purple',
    colors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3C1A78']
  },
  {
    name: 'Monochrome',
    colors: ['#6B7280', '#4B5563', '#374151', '#1F2937', '#111827', '#030712']
  },
  {
    name: 'Rainbow',
    colors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6']
  }
];

export const getThemeColors = (themeName: string, count: number): string[] => {
  const theme = COLOR_THEMES.find(t => t.name === themeName) || COLOR_THEMES[0];
  const colors = [...theme.colors];
  
  while (colors.length < count) {
    colors.push(...theme.colors);
  }
  
  return colors.slice(0, count);
};