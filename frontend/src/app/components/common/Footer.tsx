import Image from "next/image";
import Link from "next/link";
import {uri} from "@/app/constants/routePaths";

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-shell">
                <div className="footer-brand">
                    <Link href="/" className="footer-logo-wrap">
                        <Image
                            alt="Billifty Logo"
                            width={100}
                            height={40}
                            quality={100}
                            src="/images/Billifty-logo-light.png"
                        />
                    </Link>
                    <p>Professional invoicing made simple for entrepreneurs and small businesses.</p>
                </div>

                <div className="footer-grid">
                    <div className="footer-group">
                        <h4>Product</h4>
                        <Link href="/#features">Features</Link>
                        <Link href={uri.create_invoice}>Invoice Generator</Link>
                        <Link href={uri.pricing}>Pricing</Link>
                    </div>
                    <div className="footer-group">
                        <h4>Support</h4>
                        <Link href={uri.intro}>Get Started</Link>
                        <Link href={uri.auth}>Sign In</Link>
                        <Link href="mailto:support@billifty.com">Contact Us</Link>
                    </div>
                    <div className="footer-group">
                        <h4>Company</h4>
                        <Link href="/#how-it-works">How It Works</Link>
                        <Link href={uri.pricing}>Terms</Link>
                        <Link href={uri.pricing}>Privacy</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Billifty. All rights reserved.</p>
                    <div className="footer-legal">
                        <Link href={uri.pricing} aria-label="Billifty on X">X</Link>
                        <Link href={uri.pricing} aria-label="Billifty on LinkedIn">in</Link>
                        <Link href={uri.pricing} aria-label="Billifty contact">c</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
