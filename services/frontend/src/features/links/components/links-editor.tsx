"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { SaveBar } from "@/components/ui/save-bar";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { LinkModal } from "./link-modal";
import { LinkRow } from "./link-row";
import type { Link } from "../types";
import { formatLinkUI } from "../utils";

const DRAG_ACTIVATION_DISTANCE = 4;

type Editing = { mode: "new" } | { mode: "edit"; link: Link } | null;

interface LinksEditorProps {
  clicksByLinkId: Record<string, number>;
}

export function LinksEditor({ clicksByLinkId }: LinksEditorProps) {
  const { links, deleteLink, reorderLinks, orderDirty, saveOrder, resetOrder } = useDashboard();
  const [editing, setEditing] = useState<Editing>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = links.findIndex((l) => l.id === active.id);
    const to = links.findIndex((l) => l.id === over.id);
    if (from < 0 || to < 0) return;
    reorderLinks(arrayMove(links, from, to));
  };

  return (
    <div className="max-w-160 mx-auto w-full px-6 lg:px-10 py-9">
      <PageHeader
        title="Links"
        description="Drag to reorder. The new order goes live once you save."
      >
        <Button onClick={() => setEditing({ mode: "new" })}>
          <Icon name="plus" size={15} /> Add link
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-2.5 mt-7">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            {links.map((link) => (
              <LinkRow
                key={link.id}
                link={formatLinkUI(link, clicksByLinkId[link.id] ?? 0)}
                onEdit={() => setEditing({ mode: "edit", link })}
                onDelete={() => deleteLink(link.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {links.length === 0 && (
          <div className="border border-dashed border-stroke-strong rounded-xl py-12 flex flex-col items-center gap-3">
            <p className="text-[14px] text-muted">No links yet.</p>
            <Button variant="outline" size="sm" onClick={() => setEditing({ mode: "new" })}>
              <Icon name="plus" size={14} /> Add your first link
            </Button>
          </div>
        )}
      </div>

      <SaveBar visible={orderDirty} onSave={saveOrder} onReset={resetOrder} />

      {editing && (
        <LinkModal
          link={editing.mode === "edit" ? editing.link : undefined}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
