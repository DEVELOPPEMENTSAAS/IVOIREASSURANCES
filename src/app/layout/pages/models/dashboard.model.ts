export interface KPICard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface ProductData {
  name: string;
  premiums: number;
  contracts: number;
  claims: number;
  claimsRatio: number;
  color: string;
}

export interface FilterState {
  period: '7d' | '30d' | '3m' | '1y';
  agency: string;
  user: string;
  product: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  tension?: number;
  borderWidth?: number;
  borderRadius?: number;
  borderSkipped?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}