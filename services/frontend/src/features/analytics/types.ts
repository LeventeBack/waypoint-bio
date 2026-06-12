export interface LinkRef {
  id: string;
  title: string;
}

export interface ProfileStats {
  rangeDays: number;
  views: number;
  totalClicks: number;
  viewsDelta: string;
  clicksDelta: string;
  perLink: { linkId: string; title: string; clicks: number }[];
  timeseries: { date: string; clicks: number }[];
  geo: { country: string; clicks: number }[];
}

export interface AnalyticsApi {
  getProfileStats(profileId: string, links: LinkRef[]): Promise<ProfileStats>;
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
  viewsDelta: string;
  totalClicks: string;
  clicksDelta: string;
  clickRate: string;
  topLinks: BarRowUI[];
  countries: BarRowUI[];
  chart: ClicksChartUI;
}
