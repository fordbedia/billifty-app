import Image from "next/image";
import Link from "next/link";
import ModernInvoiceDesign from "@/images/modern-invoice-design.png";
import ClassicInvoiceDesign from "@/images/classic-invoice-design.png";
import MinimalInvoiceDesign from "@/images/minimal-invoice-design.png";
import { uri } from "@/app/constants/routePaths";

export default function BeautifulInvoiceDesign() {
    const templates = [
        {
            title: "Modern",
            description: "A polished layout for service businesses and small teams.",
            src: ModernInvoiceDesign,
            alt: "Modern invoice template",
            tag: "Clean",
        },
        {
            title: "Classic",
            description: "A familiar invoice style with clear structure and spacing.",
            src: ClassicInvoiceDesign,
            alt: "Classic invoice template",
            tag: "Simple",
        },
        {
            title: "Minimal",
            description: "A quiet template that keeps the focus on invoice details.",
            src: MinimalInvoiceDesign,
            alt: "Minimal invoice template",
            tag: "Focused",
        },
    ];

    return (
        <div className="simple-shell simple-template-showcase">
            <div className="simple-section-heading">
                <h2>Invoice designs that stay clean</h2>
                <p>Start from a professional template and make it fit your business.</p>
            </div>

            <div className="simple-template-grid">
                {templates.map((template) => (
                    <article className="simple-template-card" key={template.title}>
                        <div className="simple-template-image">
                            <Image
                                quality={100}
                                alt={template.alt}
                                src={template.src}
                                width={373}
                                height={384}
                            />
                        </div>

                        <div className="simple-template-copy">
                            <span>{template.tag}</span>
                            <h3>{template.title}</h3>
                            <p>{template.description}</p>
                        </div>
                    </article>
                ))}
            </div>

            <div className="simple-template-action">
                <Link href={uri.intro} className="simple-button simple-button-primary">
                    Choose a Template
                </Link>
            </div>
        </div>
    )
}
