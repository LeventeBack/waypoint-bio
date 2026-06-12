import type { PropsWithChildren } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description, children }: PropsWithChildren<PageHeaderProps>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
        <p className="text-[13.5px] text-muted mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}
