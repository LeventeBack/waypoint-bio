"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { BIO_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from "@/features/profile/constants";
import { imageFileError, MAX_IMAGE_LABEL } from "@/lib/upload";
import { EditorSection } from "./editor-section";

const BIO_ROWS = 3;

export function ProfileSection() {
  const { profile, setProfileLocal, saveProfile, uploadAvatar } = useDashboard();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const onPickAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const invalid = imageFileError(file);
    if (invalid) {
      setAvatarError(invalid);
      return;
    }
    setUploading(true);
    setAvatarError(null);
    const result = await uploadAvatar(file);
    setUploading(false);
    setAvatarError(result.error);
  };

  const removeAvatar = async () => {
    const result = await saveProfile({ avatarUrl: null });
    setAvatarError(result.error);
  };

  const name = profile.displayName ?? "";
  const bio = profile.bio ?? "";

  return (
    <EditorSection label="Profile">
      <div className="flex flex-col gap-5 bg-surface border border-stroke rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar src={profile.avatarUrl} name={name || profile.username} size={56} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={onPickAvatar} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              >
                {uploading ? "Uploading…" : "Upload image"}
              </Button>
              {profile.avatarUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={removeAvatar}>
                  Remove
                </Button>
              )}
            </div>
            {avatarError ? (
              <p className="text-[12px] text-red-400">{avatarError}</p>
            ) : (
              <p className="text-[12px] text-faint">Square image, up to {MAX_IMAGE_LABEL}.</p>
            )}
          </div>
        </div>
        <Field label="Display name" hint={`${name.length}/${DISPLAY_NAME_MAX_LENGTH}`}>
          <input
            value={name}
            maxLength={DISPLAY_NAME_MAX_LENGTH}
            placeholder={profile.username}
            onChange={(e) => setProfileLocal({ displayName: e.target.value })}
            onBlur={() => saveProfile({ displayName: name.trim() || null })}
            className={inputClass(false)}
          />
        </Field>
        <Field label="Bio" hint={`${bio.length}/${BIO_MAX_LENGTH}`}>
          <textarea
            value={bio}
            maxLength={BIO_MAX_LENGTH}
            rows={BIO_ROWS}
            onChange={(e) => setProfileLocal({ bio: e.target.value })}
            onBlur={() => saveProfile({ bio })}
            className={`${inputClass(false)} h-auto py-2.5 resize-none leading-relaxed`}
          />
        </Field>
      </div>
    </EditorSection>
  );
}
