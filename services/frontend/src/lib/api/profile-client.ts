import axios from "axios";
import { CONFIG } from "@/lib/config";

export const profileClient = axios.create({
  baseURL: CONFIG.PROFILE_SERVICE_URL,
});

profileClient.interceptors.request.use((request) => {
  if (!request.baseURL) throw new Error("PROFILE_SERVICE_URL is not configured");
  return request;
});
