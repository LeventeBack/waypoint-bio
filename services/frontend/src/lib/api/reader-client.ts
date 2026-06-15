import axios from "axios";
import { CONFIG } from "@/lib/config";

export const readerClient = axios.create({
  baseURL: CONFIG.PROFILE_READER_SERVICE_URL,
});

readerClient.interceptors.request.use((request) => {
  if (!request.baseURL) throw new Error("PROFILE_READER_SERVICE_URL is not configured");
  return request;
});
