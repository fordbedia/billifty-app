import { Quote, Sparkles, Star, Users } from "lucide-react";

const proofCards = [
    {
        title: "Studios and agencies",
        text: "Keep invoices visually aligned with the same brand standard clients already saw in your proposal and delivery work.",
        label: "Presentation-first workflows",
        icon: Sparkles,
    },
    {
        title: "Consultants and operators",
        text: "Reuse clients, services, and payment terms so repeat billing feels more like review than re-entry.",
        label: "Built for repeat invoicing",
        icon: Users,
    },
    {
        title: "Service teams in motion",
        text: "Draft quickly, check totals fast, and still send something that looks deliberate rather than rushed.",
        label: "Speed without visual debt",
        icon: Star,
    },
];

export default function TestimonialsBanner() {
    return (
        <div className="max-w-7xl w-full trust-banner">
            <div className="section-heading section-heading-center">
                <p className="eyebrow">Trusted Design Direction</p>
                <h2>Made for teams that treat invoicing like part of the client experience</h2>
                <p>
                    Billifty is structured for real operational work, but the page presentation stays polished enough
                    to feel intentional from first draft to final send.
                </p>
            </div>

            <div className="trust-grid banner-group">
                {proofCards.map(({ title, text, label, icon: Icon }) => (
                    <article className="trust-card" key={title}>
                        <div className="trust-card-head">
                            <span className="trust-icon">
                                <Icon size={18} strokeWidth={2} />
                            </span>
                            <span className="trust-label">{label}</span>
                        </div>
                        <Quote size={22} strokeWidth={1.7} className="trust-quote" />
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
