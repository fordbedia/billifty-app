"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/app/providers/AppContext";

type AvatarProps = {
  src?: string | null;
  name?: string | null;
  className?: string;
  classNames?: {
    img?: string;
  };
  isBordered?: boolean;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Avatar({
  src = null,
  name = null,
  className,
  classNames,
  isBordered = true,
}: AvatarProps) {
  const { userData } = useApp();
  const [initials, setInitials] = useState("");

  const avatarName = name ?? userData?.name ?? userData?.email ?? "Billifty";
  const avatarSrc = src ?? userData?.image_url ?? userData?.avatar ?? null;

  useEffect(() => {
    if (!avatarName) return;

    const nameArr = avatarName.split(" ");
    const lastIndex = nameArr.length - 1;
    const massageName = nameArr.map((n: string, i: number) => {
      if (i === 0) {
        return n[0].toUpperCase();
      } else if (i === lastIndex) {
        return n[0].toUpperCase();
      }
      return "";
    });

    setInitials(massageName.join(""));
  }, [avatarName]);

  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 min-w-11 items-center justify-center overflow-hidden rounded-full bg-[#f5f7f8] text-sm font-semibold tracking-[0.14em] text-[#24323f] shadow-[0_10px_24px_-18px_rgba(17,24,39,0.52)]",
        isBordered && "border border-[#aab6c3] ring-2 ring-white",
        className
      )}
      aria-label={avatarName}
      title={avatarName}
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={avatarName}
          className={cn("h-full w-full rounded-full object-cover", classNames?.img)}
        />
      ) : (
        <span className="translate-x-[0.04em]">{initials || "B"}</span>
      )}
    </span>
  );
}
