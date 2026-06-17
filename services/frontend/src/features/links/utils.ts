import { formatNumber } from "@/lib/format";
import { UNTITLED_LINK_LABEL } from "./constants";
import type { Link, LinkUI } from "./types";

export function formatLinkUI(link: Link, clicks: number): LinkUI {
  return {
    id: link.id,
    title: link.title.trim() || UNTITLED_LINK_LABEL,
    url: link.url,
    iconUrl: link.iconUrl,
    clicksLabel: `${formatNumber(clicks)} clicks`,
  };
}
