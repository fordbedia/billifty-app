import {BilliftyLogo} from "@/app/components/common/NavBar";

export default function Footer() {
    return (
        <footer>
            <div className="flex flex-col justify-self-center mt-5">
                <div className="w-28 m-auto mb-3">
                    <BilliftyLogo />
                </div>
                <p>Professional invoicing made simple</p>
            </div>
        </footer>
    )
}