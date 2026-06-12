"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { linkSchema, type LinkFormValues } from "../schemas";
import type { Link } from "../types";

interface LinkModalProps {
  link?: Link;
  onClose: () => void;
}

export function LinkModal({ link, onClose }: LinkModalProps) {
  const { createLink, updateLink } = useDashboard();
  const isNew = !link;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: { title: link?.title ?? "", url: link?.url ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = isNew ? await createLink(values) : await updateLink(link.id, values);
    if (result.error) setError("root", { message: result.error });
    else onClose();
  });

  return (
    <Modal title={isNew ? "Add link" : "Edit link"} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 mt-5">
        <Field label="Title" error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="Link title"
            autoFocus
            className={inputClass(!!errors.title)}
          />
        </Field>

        <Field label="URL" error={errors.url?.message}>
          <input
            {...register("url")}
            placeholder="https://"
            spellCheck={false}
            inputMode="url"
            className={`${inputClass(!!errors.url)} font-mono text-[13px]`}
          />
        </Field>

        {errors.root && <p className="text-[12.5px] text-red-400">{errors.root.message}</p>}

        <div className="flex justify-end gap-2 mt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : isNew ? "Add link" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
