import {Button, Link} from "@heroui/react";

export default function OptionLinks() {
    return (
        <div className="my-5">
            <Button as={Link} href="/api/auth/google/redirect" disableRipple className="w-full h-12 google-button-color"><i className="google-g-icon google-g-icon-color"></i>Continue with Google</Button>
        </div>
    )
}