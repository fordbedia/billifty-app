import { Bot, LayoutTemplate, Repeat, Smartphone } from "lucide-react";

export default function InfoBanner() {
    const features = [
        {
            title: "Template-led presentation",
            description: "Choose a visual direction first, then keep logos, colors, and layout choices consistent across every invoice.",
            icon: LayoutTemplate,
        },
        {
            title: "Repeatable billing structure",
            description: "Reuse client details, saved services, and business profiles so recurring work takes less setup.",
            icon: Repeat,
        },
        {
            title: "AI where it matters",
            description: "Turn loose notes into a clean first draft, then refine the invoice before it goes out the door.",
            icon: Bot,
        },
        {
            title: "Responsive by default",
            description: "The workspace and the output stay legible across desktop, tablet, and mobile review moments.",
            icon: Smartphone,
        },
    ];

    return (
        <div className="max-w-7xl w-full info-banner">
            <div className="info-banner-inner">
                <div className="section-heading section-heading-center">
                    <p className="eyebrow">Built for Professional Billing</p>
                    <h2>A homepage system that highlights the product without feeling crowded</h2>
                    <p>
                        Each section is doing a separate job: showing clarity, proving flexibility, and explaining
                        how the workflow gets faster after the first invoice.
                    </p>
                </div>

                <div className="feature-columns banner-group">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                        <div className="feature-column-card" key={feature.title}>
                            <div className="feature-icon-wrap">
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                        );
                    })}
                </div>

                <div className="support-strip">
                    <div className="support-strip-card">
                        <p>For agencies</p>
                        <strong>Sharper delivery across proposals, invoices, and payment follow-up.</strong>
                    </div>
                    <div className="support-strip-card">
                        <p>For service teams</p>
                        <strong>Less repetitive admin work between finishing the job and sending the bill.</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}
