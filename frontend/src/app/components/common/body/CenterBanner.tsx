import {Button, Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

export default function CenterBanner() {
    return (
        <div className="max-w-7xl">
            <div className="max-w-screen-lg text-center my-28">
                <h1 className="leading-22">Create<br /> Professional <span className="glow-color">Invoices</span> in Minutes</h1>
                <div className="max-w-screen-md m-auto mt-5">
                    <p>
                        Streamline your billing process with our intuitive invoice generator.
                        Choose from beautiful templates, customize colors, and send professional invoices instantly.
                    </p>
                </div>
                <div className="max-w-screen-md m-auto my-10">
                    <Button as={Link} href={uri.intro} className="main-button button-size" disableRipple color="default" size="lg">Get Started Free <i className="arrow-right-icon"></i></Button>
                </div>
            </div>
        </div>
    )
}