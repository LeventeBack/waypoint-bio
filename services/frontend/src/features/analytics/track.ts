import { CLICK_TRACK_ENDPOINT } from "./constants";

export function trackLinkClick(username: string, linkId: string): void {
  const payload = JSON.stringify({ username, linkId });

  // sendBeacon survives the page handing off to the link target
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(CLICK_TRACK_ENDPOINT, new Blob([payload], { type: "application/json" }));
    return;
  }

  fetch(CLICK_TRACK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}
