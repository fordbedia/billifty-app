import { Button, Link } from "@heroui/react";
import { ArrowRight, Bot, CircleHelp, FileCheck2, Palette } from "lucide-react";
import { uri } from "@/app/constants/routePaths";

const faqs = [
    {
        title: "Can I keep invoices aligned with my brand?",
        text: "Yes. You can apply logo, colors, business details, and a layout style that feels consistent with the rest of your client touchpoints.",
        icon: Palette,
    },
    {
        title: "Does Billifty help speed up repeated work?",
        text: "Client records, business profiles, saved items, and guided drafting reduce how much you need to rebuild from scratch every time.",
        icon: FileCheck2,
    },
    {
        title: "Where does AI fit into the workflow?",
        text: "AI helps you turn rough notes into a cleaner first draft, then you can review, refine, and send from the same workspace.",
        icon: Bot,
    },
];

export default function QuestionsBanner() {
    return (
        <div className="max-w-7xl w-full questions-banner">
            <div className="questions-panel">
                <div className="section-heading section-heading-center">
                    <p className="eyebrow">Questions, Answered</p>
                    <h2>Everything important is easy to understand before you commit your workflow</h2>
                    <p>
                        The homepage keeps the language simple because the product should feel simple too: fewer
                        layout decisions, fewer repeated entries, and cleaner invoice output.
                    </p>
                </div>

                <div className="questions-grid">
                    <div className="faq-list">
                        {faqs.map(({ title, text, icon: Icon }) => (
                            <article className="faq-card" key={title}>
                                <div className="faq-icon">
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="questions-aside">
                        <div className="questions-aside-badge">
                            <CircleHelp size={16} strokeWidth={2} />
                            <span>Need a faster start?</span>
                        </div>
                        <h3>Open the workspace and let the layout guide you.</h3>
                        <p>
                            From template selection to invoice drafting, the product is organized so new users can get
                            to a polished send without a long setup phase.
                        </p>
                        <Button
                            as={Link}
                            href={uri.intro}
                            className="secondary-button button-size questions-button"
                            disableRipple
                            variant="bordered"
                            size="lg"
                        >
                            See How It Starts
                            <ArrowRight size={16} strokeWidth={2} />
                        </Button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
