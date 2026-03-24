import {BilliftyLogo} from "@/app/components/common/NavBar";
import {Link} from "@heroui/react";
import {uri} from "@/app/constants/routePaths";

export default function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-shell">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo-wrap">
                            <BilliftyLogo />
                        </div>
                        <p>Professional invoicing made simple for startups and growing teams.</p>
                    </div>
                    <div className="footer-cta">
                        <p>Ship better invoices with a clean, consistent workflow.</p>
                        <Link href={uri.invoices} className="footer-cta-link">Open Dashboard</Link>
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-group">
                        <h4>Product</h4>
                        <Link href={uri.invoices}>Dashboard</Link>
                        <Link href={uri.create_invoice}>New Invoice</Link>
                        <Link href={uri.pricing}>Pricing</Link>
                    </div>
                    <div className="footer-group">
                        <h4>Workspace</h4>
                        <Link href={uri.business_profile.lists}>Business Profile</Link>
                        <Link href={uri.client.clients}>Clients</Link>
                        <Link href={uri.manage_subscriptions}>Subscription</Link>
                    </div>
                    <div className="footer-group">
                        <h4>Account</h4>
                        <Link href={uri.auth}>Sign In</Link>
                        <Link href={uri.profile}>Profile</Link>
                        <Link href={uri.intro}>Get Started</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>Billifty</p>
                    <div className="footer-legal">
                        <Link href={uri.pricing}>Terms</Link>
                        <Link href={uri.pricing}>Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
