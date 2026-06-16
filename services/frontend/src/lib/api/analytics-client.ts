import axios from "axios";
import { CONFIG } from "@/lib/config";

export const analyticsClient = axios.create({
  baseURL: CONFIG.ANALYTICS_SERVICE_URL,
});

analyticsClient.interceptors.request.use((request) => {
  if (!request.baseURL) throw new Error("ANALYTICS_SERVICE_URL is not configured");
  return request;
});
