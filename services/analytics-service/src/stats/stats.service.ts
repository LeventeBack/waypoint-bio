import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClickEvent } from "../events/schemas/click-event.schema";

const TIMESERIES_DAYS = 30;

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

@Injectable()
export class StatsService {
  constructor(@InjectModel(ClickEvent.name) private readonly eventModel: Model<ClickEvent>) {}

  // Total events plus a per-link breakdown (events that carry a linkId).
  async getMeStats(username: string): Promise<MeStats> {
    const [totals] = await this.eventModel.aggregate<{ totalClicks: number }>([
      { $match: { username } },
      { $group: { _id: null, totalClicks: { $sum: 1 } } },
    ]);

    const perLink = await this.eventModel.aggregate<PerLinkStat>([
      { $match: { username, linkId: { $ne: null } } },
      { $group: { _id: "$linkId", clicks: { $sum: 1 } } },
      { $project: { _id: 0, linkId: "$_id", clicks: 1 } },
      { $sort: { clicks: -1 } },
    ]);

    return { username, totalClicks: totals?.totalClicks ?? 0, perLink };
  }

  // Link clicks per calendar day (UTC) over the last 30 days. Only events that
  // carry a linkId are counted, matching the "Total clicks" definition.
  async getTimeseries(username: string): Promise<TimeseriesPoint[]> {
    const since = new Date(Date.now() - TIMESERIES_DAYS * 24 * 60 * 60 * 1000);

    return this.eventModel.aggregate<TimeseriesPoint>([
      { $match: { username, linkId: { $ne: null }, timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", clicks: 1 } },
      { $sort: { date: 1 } },
    ]);
  }

  // Profile-view hits grouped by client IP
  async getVisitsByIp(username: string): Promise<IpStat[]> {
    return this.eventModel.aggregate<IpStat>([
      { $match: { username, linkId: null } },
      { $group: { _id: { $ifNull: ["$ip", "unknown"] }, clicks: { $sum: 1 } } },
      { $project: { _id: 0, ip: "$_id", clicks: 1 } },
      { $sort: { clicks: -1 } },
    ]);
  }
}
