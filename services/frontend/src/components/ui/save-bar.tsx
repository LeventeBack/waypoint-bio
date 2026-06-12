"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/action-result";
import { Button } from "./button";

interface SaveBarProps {
  visible: boolean;
  onSave: () => Promise<ActionResult<unknown>>;
  onReset: () => void;
}

export function SaveBar({ visible, onSave, onReset }: SaveBarProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await onSave();
    setSaving(false);
    if (result.error !== null) setError(result.error);
  };

  const handleReset = () => {
    setError(null);
    onReset();
  };

  return (
    <div className="sticky bottom-5 mt-9 flex items-center gap-3 bg-raised border border-stroke-strong rounded-2xl px-5 py-3 shadow-2xl">
      <span className={`flex-1 text-[13.5px] font-semibold ${error ? "text-red-400" : "text-ink"}`}>
        {error ?? "You have unsaved changes."}
      </span>
      <Button variant="ghost" size="sm" onClick={handleReset} disabled={saving}>
        Reset
      </Button>
      <Button size="sm" onClick={handleSave} loading={saving}>
        Save
      </Button>
    </div>
  );
}
