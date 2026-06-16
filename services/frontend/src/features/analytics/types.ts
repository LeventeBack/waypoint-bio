export interface LinkRef {
  id: string;
  title: string;
}

export interface ClickEventInput {
  username: string;
  linkId: string;
  ip?: string;
}

export interface PerLinkStat {
  linkId: string;
  clicks: number;
}

export interface MeStats {
  username: string;
  totalClicks: number;
  perLink: PerLinkStat[];
}

export interface TimeseriesPoint {
  date: string;
  clicks: number;
}

export interface IpStat {
  ip: string;
  clicks: number;
}

export interface ProfileStats {
  rangeDays: number;
  views: number;
  totalClicks: number;
  perLink: { linkId: string; title: string; clicks: number }[];
  timeseries: TimeseriesPoint[];
  ips: IpStat[];
}

export interface BarRowUI {
  id: string;
  rank?: number;
  title: string;
  clicksLabel: string;
  percent: number;
}

export interface ChartPointUI {
  date: string;
  label: string;
  clicks: number;
  clicksLabel: string;
}

export interface ClicksChartUI {
  points: ChartPointUI[];
  axisLabels: string[];
}

export interface ProfileStatsUI {
  rangeLabel: string;
  views: string;
  totalClicks: string;
  clickRate: string;
  topLinks: BarRowUI[];
  ips: BarRowUI[];
  chart: ClicksChartUI;
}
