"use client";

import React, { createContext, useContext, Suspense, useEffect, useState } from "react";
import {useMutation, UseMutationResult, useQuery, useQueryClient} from "@tanstack/react-query";
import User from "@/app/models/User";
import { useRouter, useSearchParams } from "next/navigation";
import { uri } from "@/app/constants/routePaths";
import { storeAuth } from "@/app/helpers/auth";
import {usePathname} from "next/navigation";
import {addToast} from "@heroui/react";

type UserProfile = {
  id: number | null;
  fname: string;
  lname: string;
  avatar?: string;
};

type Plan = {
  code: string;
  name: string;
}

type UserInitialState = {
  fname: string;
  lname: string;
  name: string;
  email: string;
  email_verified_at: string;
  password: string;
  provider: string;
  provider_id: string;
  avatar: string;
  image_url?: string | null;
  plan: Plan
};

type UpdateProfileInput = {
  userProfile: Partial<UserProfile>;
  avatarFile?: File | null;
};

type UserContextValue = {
  user: UserInitialState;
  handleChange: (attr: keyof UserInitialState, value: string) => void;
  saveUser: () => void;
  errors: string[] | null;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: UseMutationResult<UserProfile, Error, UpdateProfileInput>; // updateUserProfile returns an object
  me: UserInitialState | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  avatarFile: File | null;
};

type ToastColor =
  | "success"
  | "default"
  | "foreground"
  | "primary"
  | "secondary"
  | "warning"
  | "danger";

type ToastProps = {
  title: string;
  message?: string;
  color: ToastColor;
  description: string | null;
  hideIcon?: boolean;
  timeout?: number;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProviderInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient()

  const userInitialState: UserInitialState = {
    fname: "",
    lname: "",
    name: "",
    email: "",
    email_verified_at: "",
    password: "",
    provider: "",
    provider_id: "",
    avatar: "",
    plan: {code: '', name: ''}
  };

  const [hasToast, setHasToast] = useState<ToastProps>({
    title: '',
    message: '',
    color: 'success',
    description: '',
    hideIcon: false,
    timeout: 4000
  });
  const [user, setUser] = useState<UserInitialState>(userInitialState);
  const [errors, setErrors] = useState<string[] | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: null,
    fname: "",
    lname: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {data: me} = useQuery({
	  queryKey: ['profile'],
	  queryFn: async () => {
		  const res = await User.me()
		  if (!res?.data) return;
		  return res.data
	  },
	  enabled: !!(pathname === uri.profile),
  })

  const isBlobLike = (v: unknown): v is Blob =>
    typeof v === "object" && v !== null && v instanceof Blob;

  const updateUserProfile = useMutation<UserProfile, Error, UpdateProfileInput>({
    mutationFn: async ({ userProfile, avatarFile }) => {
      const fd = new FormData();
      if (avatarFile) {
        fd.append("avatar", avatarFile); // <-- File only
      }

      // Typed entries avoids TS7053
      (Object.entries(userProfile) as Array<[keyof UserProfile, UserProfile[keyof UserProfile]]>)
        .forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          // FormData only accepts string | Blob, so convert primitives to string
          fd.append(String(key), isBlobLike(value) ? value : String(value));
        });

      return (await User.edit(fd))?.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<UserProfile | undefined>(['profile'], (old) => ({
        ...old,
        ...data
      }))

      setHasToast({
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        color: 'success',
        description: null,
      })
    }
  })

  useEffect(() => {
	  if (me) {
		  setUserProfile({
			  id: me.id,
			  fname: me.fname,
			  lname: me.lname,
              avatar: me.image_url,
		  })
	  }
  }, [me]);

  const handleChange = (attr: keyof UserInitialState, value: string) =>
    setUser((prev) => ({ ...prev, [attr]: value }));

  const { mutate: saveUser, error: userSaveError } = useMutation({
    mutationFn: async () => {
      const next: string | null = searchParams.get("next") ?? null;
	  if (typeof next !== 'undefined' || !next) return;
      return (await User.register(user, next))?.data;
    },
    onSuccess: (d: any) => {
      const { nextUrl, ...rest } = d;
      storeAuth(rest);
      router.push(nextUrl ?? uri.invoices);
    },
  });

  useEffect(() => {
    if (!userSaveError) return;

    const rawErrors = (userSaveError as any)?.response?.data?.errors;

    if (rawErrors && typeof rawErrors === "object") {
      const e = Object.values(rawErrors)
        .map((messages: any) => messages?.[0])
        .filter(Boolean);
      setErrors(e as string[]);
      return;
    }

    const message =
      (userSaveError as any)?.response?.data?.message ||
      (userSaveError as any)?.message ||
      "Something went wrong.";

    setErrors([message]);
  }, [userSaveError]);

  useEffect(() => {
    if (hasToast && hasToast.title !== '') {
      addToast({
        title: hasToast.title,
        description: hasToast.message ?? null,
        hideIcon: true,
        color: hasToast.color,
        timeout: 4000
      });
    }
  }, [hasToast]);

  const value: UserContextValue = {
    user,
    handleChange,
    saveUser: () => saveUser(),
    errors,
    userProfile,
    setUserProfile,
    updateUserProfile,
    me,
    setAvatarFile,
    avatarFile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <UserProviderInner>{children}</UserProviderInner>
    </Suspense>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("Cannot load UserContext");
  return ctx;
}
