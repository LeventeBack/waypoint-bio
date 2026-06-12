export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboardLinks: "/dashboard/links",
  dashboardAppearance: "/dashboard/appearance",
  dashboardAnalytics: "/dashboard/analytics",
  publicProfile: (username: string) => `/${username}`,
} as const;
