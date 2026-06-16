"use client";

import type { CSSProperties, PropsWithChildren } from "react";
import { trackLinkClick } from "../track";

interface TrackedLinkProps {
  href: string;
  username: string;
  linkId: string;
  track?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function TrackedLink({
  href,
  username,
  linkId,
  track = false,
  className,
  style,
  title,
  children,
}: PropsWithChildren<TrackedLinkProps>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      title={title}
      onClick={track ? () => trackLinkClick(username, linkId) : undefined}
    >
      {children}
    </a>
  );
}
