export const CONFIG = {
  PROFILE_SERVICE_URL: process.env.PROFILE_SERVICE_URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
} as const;

export const isProduction = CONFIG.NODE_ENV === "production";
