import MotionSection from "@/app/components/common/MotionSection";
import BeautifulInvoiceDesign from "@/app/components/common/body/BeatifulInvoiceDesign";
import Link from "next/link";
import {
    ArrowRight,
    Download,
    FileText,
    LockKeyhole,
    Palette,
    Play,
    Smartphone,
    Zap,
} from "lucide-react";
import { uri } from "@/app/constants/routePaths";

export default function Body() {
    const features = [
        {
            title: "Smart Templates",
            description: "Choose clean invoice layouts and adjust them for your brand.",
            icon: FileText,
        },
        {
            title: "Lightning Fast",
            description: "Create professional invoices without complicated setup.",
            icon: Zap,
        },
        {
            title: "Mobile Optimized",
            description: "Manage invoice details from desktop, tablet, or phone.",
            icon: Smartphone,
        },
        {
            title: "Export Options",
            description: "Download invoices as PDFs and keep clean records.",
            icon: Download,
        },
        {
            title: "Brand Customization",
            description: "Add your logo, colors, and business details.",
            icon: Palette,
        },
        {
            title: "Secure & Private",
            description: "Your invoice and client details stay in your workspace.",
            icon: LockKeyhole,
        },
    ];

    const steps = [
        {
            title: "Enter Details",
            description: "Fill in business info, client details, and line items.",
        },
        {
            title: "Customize Design",
            description: "Choose a template, add your logo, and adjust the look.",
        },
        {
            title: "Download & Send",
            description: "Export a PDF or send it to your client.",
        },
    ];

    return (
        <div className="home home-simple">
            <section className="simple-hero" id="top">
                <div className="simple-shell simple-hero-grid">
                    <div className="simple-hero-copy">
                        <h1>
                            Professional
                            <span>Invoicing</span>
                            Made Simple
                        </h1>
                        <p>
                            Create beautiful, professional invoices in seconds. No design skills required.
                            Focus on your business while Billifty handles the invoice.
                        </p>
                        <div className="simple-actions">
                            <Link href={uri.intro} className="simple-button simple-button-primary">
                                Start Creating Invoices
                            </Link>
                            <Link href={uri.create_invoice} className="simple-button simple-button-ghost">
                                <Play size={13} fill="currentColor" strokeWidth={0} />
                                Open Generator
                            </Link>
                        </div>
                    </div>

                    <div className="simple-invoice-preview" aria-label="Sample invoice preview">
                        <div className="simple-invoice-card">
                            <div className="simple-invoice-top">
                                <div className="simple-invoice-brand">
                                    <span></span>
                                    <strong>Billifty</strong>
                                </div>
                                <p>INVOICE #014</p>
                            </div>

                            <div className="simple-invoice-parties">
                                <div>
                                    <span>From</span>
                                    <strong>Bright Concepts</strong>
                                    <p>123 Business St<br />City, State 12345</p>
                                </div>
                                <div>
                                    <span>To</span>
                                    <strong>Client Name</strong>
                                    <p>456 Client Ave<br />City, State 67890</p>
                                </div>
                            </div>

                            <div className="simple-invoice-lines">
                                <div>
                                    <span>Web Design Service</span>
                                    <strong>$2,500.00</strong>
                                </div>
                                <div>
                                    <span>Development Work</span>
                                    <strong>$1,800.00</strong>
                                </div>
                            </div>

                            <div className="simple-invoice-total">
                                <span>Total</span>
                                <strong>$4,300.00</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MotionSection className="simple-section simple-section-features" delay={0.04} direction="up">
                <div className="simple-shell">
                    <div className="simple-section-heading">
                        <h2>Everything you need to invoice professionally</h2>
                        <p>Simple tools for creating, customizing, and sending invoices from one place.</p>
                    </div>

                    <div className="simple-feature-grid" id="features">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article className="simple-feature-card" key={feature.title}>
                                    <div className="simple-feature-icon">
                                        <Icon size={17} strokeWidth={2} />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </MotionSection>

            <MotionSection className="simple-section simple-section-templates" delay={0.06} direction="up">
                <BeautifulInvoiceDesign />
            </MotionSection>

            <MotionSection className="simple-section simple-section-steps" delay={0.08} direction="up">
                <div className="simple-shell" id="how-it-works">
                    <div className="simple-section-heading">
                        <h2>How it works</h2>
                        <p>The simple steps to create invoices that look ready to send.</p>
                    </div>

                    <div className="simple-step-grid">
                        {steps.map((step, index) => (
                            <article className="simple-step" key={step.title}>
                                <span>{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </MotionSection>

            <MotionSection className="simple-cta-band" delay={0.1} direction="up">
                <div className="simple-shell">
                    <h2>Ready to create your first professional invoice?</h2>
                    <p>Start with Billifty and build clean invoices for your business.</p>
                    <div className="simple-actions simple-actions-center">
                        <Link href={uri.intro} className="simple-button simple-button-light">
                            Start Creating Now
                        </Link>
                        <Link href={uri.pricing} className="simple-button simple-button-outline-light">
                            View Pricing
                            <ArrowRight size={14} strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </MotionSection>
        </div>
    )
}
