"use client";

import {useEffect, useRef} from "react";
import {Info} from "lucide-react";
import {Button} from "@heroui/react";
import {useUser} from "@/app/providers/UserContext";

const bannerHeightVar = "--email-verification-banner-height";

export default function EmailVerificationBanner() {
    const bannerRef = useRef<HTMLDivElement | null>(null);
    const {
        me,
        isEmailVerified,
        reSendVerification,
        reSendVerificationSuccess,
        reSendVerificationisPending,
    } = useUser();

    const shouldShow = Boolean(me && !isEmailVerified);

    useEffect(() => {
        if (!shouldShow) {
            document.documentElement.style.setProperty(bannerHeightVar, "0px");
            return;
        }

        const updateBannerHeight = () => {
            const height = bannerRef.current?.offsetHeight ?? 0;
            document.documentElement.style.setProperty(bannerHeightVar, `${height}px`);
        };

        updateBannerHeight();

        const observer = new ResizeObserver(updateBannerHeight);
        if (bannerRef.current) observer.observe(bannerRef.current);
        window.addEventListener("resize", updateBannerHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateBannerHeight);
            document.documentElement.style.setProperty(bannerHeightVar, "0px");
        };
    }, [shouldShow]);

    if (!shouldShow) return null;

    return (
        <div ref={bannerRef} className="fixed left-0 right-0 top-0 z-[10000] w-full border-b border-blue-100 bg-blue-50/95 text-blue-800 backdrop-blur">
            <div className="mx-auto flex min-h-10 w-full max-w-[1440px] flex-col items-center justify-center gap-1 px-4 py-2 text-center text-sm sm:flex-row sm:gap-2 sm:px-6 sm:py-0">
                <Info className="size-4 shrink-0 text-blue-600" aria-hidden="true"/>
                <span className="font-medium">
                    Please verify your email address to unlock all features.
                </span>
                <Button
                    type="button"
                    variant="light"
                    size="sm"
                    radius="sm"
                    isDisabled={reSendVerificationisPending}
                    isLoading={reSendVerificationisPending}
                    onPress={() => reSendVerification()}
                    className="h-7 min-h-7 px-1.5 text-sm font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
                >
                    {reSendVerificationSuccess ? "Verification email sent." : "Resend Email"}
                </Button>
            </div>
        </div>
    );
}
