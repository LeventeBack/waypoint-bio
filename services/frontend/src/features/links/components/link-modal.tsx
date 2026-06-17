"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { imageFileError } from "@/lib/upload";
import { linkSchema, type LinkFormValues } from "../schemas";
import type { Link } from "../types";

interface LinkModalProps {
  link?: Link;
  onClose: () => void;
}

export function LinkModal({ link, onClose }: LinkModalProps) {
  const { createLink, updateLink, uploadLinkIcon } = useDashboard();
  const isNew = !link;

  const fileInput = useRef<HTMLInputElement>(null);
  const [iconUrl, setIconUrl] = useState(link?.iconUrl ?? null);
  const [iconUploading, setIconUploading] = useState(false);
  const [iconError, setIconError] = useState<string | null>(null);

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

  const onPickIcon = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !link) return;
    const invalid = imageFileError(file);
    if (invalid) {
      setIconError(invalid);
      return;
    }
    setIconUploading(true);
    setIconError(null);
    const result = await uploadLinkIcon(link.id, file);
    setIconUploading(false);
    if (result.error === null) setIconUrl(result.data.iconUrl);
    else setIconError(result.error);
  };

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

        {!isNew && (
          <Field label="Icon" error={iconError}>
            <div className="flex items-center gap-3">
              {iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl}
                  alt=""
                  className="w-9 h-9 rounded-md object-cover border border-stroke shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-md border border-dashed border-stroke-strong shrink-0" />
              )}
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={onPickIcon} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={iconUploading}
                onClick={() => fileInput.current?.click()}
              >
                {iconUploading ? "Uploading…" : "Upload icon"}
              </Button>
            </div>
          </Field>
        )}

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
