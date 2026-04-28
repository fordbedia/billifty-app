"use client";

import React, { createContext, useContext, Suspense, useEffect, useState } from "react";
import {useMutation, type UseMutateFunction, UseMutationResult, useQuery, useQueryClient} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import User from "@/app/models/User";
import { useRouter, useSearchParams } from "next/navigation";
import { uri } from "@/app/constants/routePaths";
import { storeAuth } from "@/app/helpers/auth";
import {usePathname} from "next/navigation";
import {addToast} from "@heroui/react";

type UserProfile = {
  id?: number | null;
  fname?: string | null;
  lname?: string | null;
  avatar?: string | null;
};

type Plan = {
  code: string;
  name: string;
}

type UserInitialState = {
  id: number | null;
  subscription: Record<string, any | null>;
  fname: string;
  lname: string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  email_verified_date?: string | null;
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

type ValidationErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type UserContextValue = {
  user: UserInitialState;
  handleChange: (attr: keyof UserInitialState, value: string) => void;
  saveUser: () => void;
  errors: string[] | null;
  userProfile?: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  updateUserProfile: UseMutationResult<UserProfile, Error, UpdateProfileInput>; // updateUserProfile returns an object
  me: UserInitialState | null;
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>;
  avatarFile: File | null;
  reSendVerification: UseMutateFunction<unknown, Error, void, unknown>;
  reSendVerificationSuccess: boolean;
  reSendVerificationisPending: boolean;
  updatePasswordForm: {
      new_password: string;
      current_password: string;
      password: string;
  };
  setUpdatePasswordForm: React.Dispatch<React.SetStateAction<updatePasswordProp>>;
  updatePassword: UseMutateFunction<unknown, AxiosError<ValidationErrorResponse>, number>;
  handlePasswordChangeInput: (attr: any, value: string) => void;
  updatePasswordIsPending: boolean;
  updatePasswordError: AxiosError<ValidationErrorResponse> | null;
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

type updatePasswordProp = {
    current_password: string;
    new_password: string;
    password: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProviderInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient()
  const checkoutSessionId = searchParams.get("session_id");


    const userInitialState: UserInitialState = {
    id: null,
    fname: "",
    lname: "",
    name: "",
    email: "",
    email_verified_at: "",
    email_verified_date: "",
    password: "",
    provider: "",
    provider_id: "",
    avatar: "",
    plan: {code: '', name: ''},
    subscription: {},
  };

  const updatePasswordInitialState = {
      new_password: '',
      current_password: '',
      password: '',
  }

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

  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    id: null,
    fname: "",
    lname: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [updatePasswordForm, setUpdatePasswordForm] = useState<updatePasswordProp>({...updatePasswordInitialState})

  const shouldFetchProfile =
      pathname === uri.profile ||
      pathname === uri.accountSettings ||
      pathname === uri.checkout_success

    const {
      data: me = null,
      refetch,
    } = useQuery<UserInitialState | null>({
      queryKey: ['profile'],
      queryFn: async () => {
        const res = await User.me()
        return res?.data ?? null
      },
      enabled: shouldFetchProfile,
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    })

    useEffect(() => {
      if (shouldFetchProfile) {
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        refetch()
      }
    }, [pathname, checkoutSessionId, shouldFetchProfile, queryClient, refetch])

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
			  id: me?.id,
			  fname: me?.fname,
			  lname: me?.lname,
              avatar: me?.image_url,
		  })
	  }
  }, [me]);

  const handleChange = (attr: keyof UserInitialState, value: string) =>
    setUser((prev) => ({ ...prev, [attr]: value }));

  const { mutate: saveUser, error: userSaveError } = useMutation({
    mutationFn: async () => {
      const next: string | null = searchParams.get("next") ?? null;
      return (await User.register(user, next))?.data;
    },
    onSuccess: (d: any) => {
      if (!d) return;
      const { nextUrl, ...rest } = d;
      storeAuth(rest);
      router.push(nextUrl ?? uri.invoices);
    },
  });

  const {
      mutate: reSendVerification,
      isSuccess: reSendVerificationSuccess,
      isPending: reSendVerificationisPending,
  } = useMutation<unknown, Error, void>({
      mutationFn: async () => (await User.resendVerificationEmail())?.data
  })

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

  const {
      mutateAsync: updatePassword,
      isPending: updatePasswordIsPending,
      error: updatePasswordError,
  } = useMutation<unknown, AxiosError<ValidationErrorResponse>, number>({
      mutationFn: async (userId) => (await User.updatePassword(userId, updatePasswordForm))?.data,
      onSuccess: () => {
          addToast({
              title: 'Password Updated',
              description:'Your password has been updated successfully.',
              color: 'success'
          });
          setUpdatePasswordForm({...updatePasswordInitialState})
      },
  })

  const handlePasswordChangeInput = (attr: any, value: string) => setUpdatePasswordForm((prev) => ({
        ...prev,
        [attr]: value
    }))

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
      reSendVerification, reSendVerificationSuccess, reSendVerificationisPending,
      updatePasswordForm, setUpdatePasswordForm, updatePassword, handlePasswordChangeInput, updatePasswordIsPending, updatePasswordError
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
