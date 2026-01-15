"use client";

import React, { useMemo, useRef, useState } from "react";
import { Card, CardBody, Avatar, Button, Chip } from "@heroui/react";
import { Camera } from "lucide-react";

export type PlanStatus = "Free" | "Pro" | "Premium";

type UserProfileCardProps = {
  name?: string;
  email?: string;
  plan?: PlanStatus;
  avatar?: string | null;

  /** Initial avatar URL from API */
  avatarUrl?: string;

  /**
   * Called after user selects a file.
   * Use this to store the File in state and/or upload with FormData.
   */
  onPhotoSelected?: (file: File) => void;

  /**
   * Optional: called if user cancels selection or file is invalid.
   */
  onPhotoSelectError?: (message: string) => void;

  /**
   * Optional: restrict accepted file types (defaults to common images)
   */
  accept?: string;

  /**
   * Optional: max file size in MB (default 5MB)
   */
  maxSizeMb?: number;

  /**
   * Optional: name of the FormData field you want to use.
   * (example: "avatar" or "photo")
   */
  formDataFieldName?: string;
};

const PLAN_STYLES: Record<
  PlanStatus,
  { label: string; chipClass: string; dotClass: string }
> = {
  Free: {
    label: "Free Plan",
    chipClass: "bg-slate-100 text-slate-700 border border-slate-200",
    dotClass: "bg-slate-400",
  },
  Pro: {
    label: "Pro Plan",
    chipClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  Premium: {
    label: "Premium Plan",
    chipClass: "bg-violet-50 text-violet-700 border border-violet-200",
    dotClass: "bg-violet-500",
  },
};

export default function UserProfileCard({
  name = "Ed Bedia",
  email = "ed.bedia@billifty.com",
  plan = "Pro",
  avatar = null,
  avatarUrl = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
  onPhotoSelected,
  onPhotoSelectError,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  maxSizeMb = 5,
  formDataFieldName = "avatar",
}: UserProfileCardProps) {
  const planMeta = PLAN_STYLES[plan];

  const inputRef = useRef<HTMLInputElement | null>(null);

  // local preview URL (so UI updates instantly)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // prefer preview if exists, else fallback to avatarUrl
  const effectiveAvatarUrl = previewUrl ?? (avatar ?? avatarUrl);

  // clean up object URLs to avoid memory leaks
  const lastObjectUrlRef = useRef<string | null>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return `Selected file is not an image (${file.type || "unknown type"}).`;
    }
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return `Image is too large. Max size is ${maxSizeMb}MB.`;
    }
    return null;
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;

    // allow re-selecting the same file later
    e.target.value = "";

    if (!file) return;

    const error = validateFile(file);
    if (error) {
      onPhotoSelectError?.(error);
      return;
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);

    // cleanup previous object url
    if (lastObjectUrlRef.current) URL.revokeObjectURL(lastObjectUrlRef.current);
    lastObjectUrlRef.current = objectUrl;

    setPreviewUrl(objectUrl);

    // Give parent the File for FormData upload
    onPhotoSelected?.(file);
  };

  // Cleanup on unmount
  useMemo(() => {
    return () => {
      if (lastObjectUrlRef.current) URL.revokeObjectURL(lastObjectUrlRef.current);
    };
  }, []);

  return (
    <Card className="w-full rounded-2xl border-0 shadow-none">
      <CardBody className="p-5">
        <div className="flex items-center justify-center gap-4">
          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Avatar + camera overlay */}
          <div className="relative">
            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Open photo upload"
            >
              <Avatar
                src={effectiveAvatarUrl}
                name={name}
                className="w-30 h-30 rounded-full"
                isBordered={false}
              />
            </button>

            <Button
              isIconOnly
              radius="full"
              size="sm"
              aria-label="Change profile photo"
              onPress={openFilePicker}
              className="absolute -right-1 -bottom-1 w-7 h-7 min-w-0 bg-white border border-slate-200 shadow-sm"
            >
              <Camera className="w-4 h-4 text-slate-700" />
            </Button>
          </div>

          {/* Text content */}
          <div className="min-w-0 flex-1">
            <div className="text-xl font-semibold text-slate-900 leading-tight truncate">
              {name}
            </div>
            <div className="text-sm text-slate-500 truncate">{email}</div>

            <div className="pt-2">
              <Chip
                size="sm"
                className={`h-7 px-3 rounded-full ${planMeta.chipClass}`}
                startContent={
                  <span className={`inline-block w-2 h-2 rounded-full ${planMeta.dotClass}`} />
                }
              >
                {planMeta.label}
              </Chip>
            </div>

            {/* Optional helper text */}
            <div className="pt-2 text-xs text-slate-400">
              Click the photo to upload (max {maxSizeMb}MB).
            </div>

            {/* This exposes the field name for convenience */}
            <div className="sr-only" aria-hidden="true">
              FormData field name: {formDataFieldName}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
