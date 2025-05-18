
export interface ChartData {
  date: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  buyVolume: number;
  sellVolume: number;
}

export interface StatsData {
  lastPrice: string;
  change: string;
  changePercent: string;
  high: string;
  low: string;
  volume: string;
}
