import {Button, Link} from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import * as sea from "node:sea";

export default function OptionLinks() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleGoogleLogin = () => {
        const next = searchParams.get('next');

        const url = next ? `/api/auth/google/redirect?next=${encodeURIComponent(next)}` : '/api/auth/google/redirect';
        router.push(url);
    }

    return (
        <div className="my-5">
            <Button onPress={handleGoogleLogin} disableRipple className="w-full h-12 google-button-color"><i className="google-g-icon google-g-icon-color"></i>Continue with Google</Button>
        </div>
    )
}