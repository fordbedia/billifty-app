import Image from "next/image";
import { Button, Link } from "@heroui/react";
import { ArrowRight, Check } from "lucide-react";
import ModernInvoiceDesign from "@/images/modern-invoice-design.png";
import ClassicInvoiceDesign from "@/images/classic-invoice-design.png";
import MinimalInvoiceDesign from "@/images/minimal-invoice-design.png";
import { uri } from "@/app/constants/routePaths";

export default function BeautifulInvoiceDesign() {
    const templates = [
        {
            title: "Modern",
            description: "Sharper hierarchy and cleaner spacing for teams that want invoices to feel current and confident.",
            src: ModernInvoiceDesign,
            alt: "Modern invoice template",
            badge: "Fast visual confidence",
            points: ["Bold hierarchy", "Branded highlights", "Clean mobile scan"],
        },
        {
            title: "Classic",
            description: "A stronger trust signal for businesses that want dependable structure with a more established tone.",
            src: ClassicInvoiceDesign,
            alt: "Classic invoice template",
            badge: "Balanced and familiar",
            points: ["Formal structure", "Comfortable spacing", "Repeat-client friendly"],
        },
        {
            title: "Minimal",
            description: "Quiet, restrained, and useful when you want the details to speak without extra visual noise.",
            src: MinimalInvoiceDesign,
            alt: "Minimal invoice template",
            badge: "Subtle by design",
            points: ["Low-noise layout", "Elegant typography", "Simple approval path"],
        },
    ];

    return (
         <div className="max-w-7xl w-full template-showcase">
            <div className="template-showcase-inner">
                <div className="section-heading section-heading-center">
                    <p className="eyebrow">Flexible Visual Modes</p>
                    <h2>Template choices presented with stronger hierarchy, like a product tier layout</h2>
                    <p>
                        The section borrows the confidence of a pricing grid, but it is still about layout direction:
                        showing users there is a deliberate visual system behind every invoice style.
                    </p>
                </div>

                <div className="template-pricing-grid banner-group">
                    {templates.map((template, index) => (
                        <article
                            className={`template-pricing-card ${index === 1 ? "is-featured" : ""}`}
                            key={template.title}
                        >
                            <div className="template-pricing-head">
                                <span className="template-pricing-label">{template.badge}</span>
                                <h3>{template.title}</h3>
                                <p>{template.description}</p>
                            </div>

                            <div className="template-pricing-preview">
                                <Image
                                    priority
                                    quality={100}
                                    alt={template.alt}
                                    src={template.src}
                                    width={373}
                                    height={384}
                                />
                            </div>

                            <div className="template-pricing-points">
                                {template.points.map((point) => (
                                    <div key={point}>
                                        <Check size={16} strokeWidth={2.4} />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="template-cta-wrap">
                    <Button as={Link} href={uri.auth} className="main-button button-size" disableRipple size="lg">
                        Explore Template Styles
                        <ArrowRight size={16} strokeWidth={2.2} />
                    </Button>
                </div>
            </div>
         </div>
    )
}
