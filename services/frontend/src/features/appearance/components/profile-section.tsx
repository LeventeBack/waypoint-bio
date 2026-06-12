"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Field, inputClass } from "@/components/ui/field";
import { useDashboard } from "@/features/dashboard/dashboard-provider";
import { BIO_MAX_LENGTH } from "@/features/profile/constants";
import { imageUrlSchema } from "@/features/profile/schemas";
import { firstIssueMessage } from "@/lib/validation";
import { EditorSection } from "./editor-section";

const BIO_ROWS = 3;

export function ProfileSection() {
  const { profile, setProfileLocal, saveProfile } = useDashboard();
  const [avatarDraft, setAvatarDraft] = useState(profile.avatarUrl ?? "");
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const commitAvatar = async () => {
    const url = avatarDraft.trim();
    if (url === (profile.avatarUrl ?? "")) return;

    if (url !== "") {
      const parsed = imageUrlSchema.safeParse(url);
      if (!parsed.success) {
        setAvatarError(firstIssueMessage(parsed.error));
        return;
      }
    }

    const result = await saveProfile({ avatarUrl: url === "" ? null : url });
    setAvatarError(result.error);
  };

  const bio = profile.bio ?? "";

  return (
    <EditorSection label="Profile">
      <div className="flex flex-col gap-5 bg-surface border border-stroke rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Avatar src={profile.avatarUrl} name={profile.username} size={56} />
          <div className="flex-1 min-w-0">
            <Field
              label="Avatar image URL"
              error={avatarError}
              hint="Square image works best. Clear the field to remove."
            >
              <input
                value={avatarDraft}
                placeholder="https://…/avatar.png"
                spellCheck={false}
                inputMode="url"
                onChange={(e) => setAvatarDraft(e.target.value)}
                onBlur={() => commitAvatar()}
                className={`${inputClass(!!avatarError)} font-mono text-[13px]`}
              />
            </Field>
          </div>
        </div>
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
