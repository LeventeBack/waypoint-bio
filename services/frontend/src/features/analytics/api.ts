import { MockAnalyticsApi } from "./mock";
import type { AnalyticsApi } from "./types";

/** No analytics backend exists yet; swap in a real client here when it lands. */
export const analyticsApi: AnalyticsApi = new MockAnalyticsApi();
