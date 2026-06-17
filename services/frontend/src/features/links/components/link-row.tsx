"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon, Icon } from "@/components/ui/icons";
import type { LinkUI } from "../types";

interface LinkRowProps {
  link: LinkUI;
  onEdit: () => void;
  onDelete: () => void;
}

export function LinkRow({ link, onEdit, onDelete }: LinkRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-2 bg-surface border rounded-xl pl-1.5 pr-3 py-2.5 transition-colors ${
        isDragging
          ? "border-accent opacity-60 z-10 relative"
          : "border-stroke hover:border-stroke-strong"
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-faint hover:text-muted px-1.5 py-2 touch-none shrink-0"
        title="Drag to reorder"
        aria-label="Drag to reorder"
      >
        <GripIcon />
      </button>
      <button
        onClick={onEdit}
        className="flex-1 min-w-0 flex items-center gap-3 text-left"
        title="Edit link"
      >
        {link.iconUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={link.iconUrl} alt="" className="w-7 h-7 rounded-md object-cover shrink-0" />
        )}
        <span className="flex-1 min-w-0 flex flex-col gap-0.5">
          <span className="text-[14.5px] font-semibold text-ink truncate">{link.title}</span>
          <span className="font-mono text-[12px] text-muted truncate">{link.url}</span>
        </span>
      </button>
      <span className="hidden md:block font-mono text-[11.5px] text-faint whitespace-nowrap pr-1">
        {link.clicksLabel}
      </span>
      <button
        onClick={onEdit}
        className="text-faint hover:text-ink p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
        title="Edit link"
        aria-label="Edit link"
      >
        <Icon name="edit" size={15} />
      </button>
      <button
        onClick={onDelete}
        className="text-faint hover:text-red-400 p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
        title="Delete link"
        aria-label="Delete link"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  );
}
