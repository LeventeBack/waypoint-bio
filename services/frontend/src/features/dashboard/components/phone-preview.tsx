"use client";

import { useEffect, useState } from "react";
import { PublicProfile } from "@/features/profile/components/public-profile";
import { formatPublicProfileUI } from "@/features/profile/utils";
import { getBackground } from "@/lib/theme/utils";
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  PREVIEW_CHROME_HEIGHT,
  PREVIEW_DEFAULT_SCALE,
  PREVIEW_MAX_SCALE,
  PREVIEW_MIN_SCALE,
} from "../constants";
import { useDashboard } from "../dashboard-provider";
import { IOSDevice } from "./ios-device";

export function PhonePreview() {
  const { profile, links, theme } = useDashboard();
  const [scale, setScale] = useState(PREVIEW_DEFAULT_SCALE);

  useEffect(() => {
    const fit = () =>
      setScale(
        Math.min(
          PREVIEW_MAX_SCALE,
          Math.max(PREVIEW_MIN_SCALE, (window.innerHeight - PREVIEW_CHROME_HEIGHT) / DEVICE_HEIGHT),
        ),
      );
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const bg = getBackground(theme.bgId);

  return (
    <div
      style={{ width: Math.round(DEVICE_WIDTH * scale), height: Math.round(DEVICE_HEIGHT * scale) }}
      className="relative shrink-0"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: DEVICE_WIDTH,
          height: DEVICE_HEIGHT,
        }}
      >
        <IOSDevice dark={bg.dark}>
          <PublicProfile profile={formatPublicProfileUI({ ...profile, links })} dense />
        </IOSDevice>
      </div>
    </div>
  );
}
