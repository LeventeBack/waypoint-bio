"use client";

import { useEffect, type PropsWithChildren } from "react";
import { Icon } from "./icons";

interface ModalProps {
  title: string;
  onClose: () => void;
}

export function Modal({ title, onClose, children }: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-110 bg-surface border border-stroke rounded-2xl shadow-pop p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-extrabold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
