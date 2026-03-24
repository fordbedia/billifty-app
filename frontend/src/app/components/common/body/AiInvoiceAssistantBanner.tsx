import { Button, Link } from "@heroui/react";
import { ArrowRight, Bot, CheckCircle2, FolderSync, WandSparkles } from "lucide-react";
import { uri } from "@/app/constants/routePaths";

export default function AiInvoiceAssistantBanner() {
    const workflowItems = [
        {
            title: "Capture the rough brief",
            description: "Start with plain language notes instead of formatting the entire invoice manually.",
            icon: Bot,
        },
        {
            title: "Refine with saved context",
            description: "Business details, client records, and line item memory keep the draft grounded.",
            icon: FolderSync,
        },
        {
            title: "Review a send-ready structure",
            description: "Check totals, due dates, and layout polish before the invoice leaves your workspace.",
            icon: CheckCircle2,
        },
    ];

    return (
        <div className="max-w-7xl w-full ai-assistant-banner">
            <div className="workflow-panel">
                <div className="workflow-preview">
                    <div className="workflow-preview-window">
                        <div className="workflow-preview-topbar">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="workflow-preview-chat">
                            <div className="workflow-bubble workflow-bubble-user">
                                Draft an invoice for a monthly retainer, include strategy review, content edits, and a
                                due date in 14 days.
                            </div>
                            <div className="workflow-bubble workflow-bubble-ai">
                                I prepared a draft with the client profile, recurring services, payment terms, and a
                                cleaner line-item breakdown.
                            </div>
                        </div>

                        <div className="workflow-preview-summary">
                            <div>
                                <p>Suggested structure</p>
                                <strong>3 line items, due Apr 7</strong>
                            </div>
                            <span>
                                <WandSparkles size={16} strokeWidth={2} />
                                Draft ready
                            </span>
                        </div>
                    </div>
                </div>

                <div className="workflow-copy">
                    <p className="eyebrow">Guided Drafting Flow</p>
                    <h2>Use AI as a faster starting point, not a black box</h2>
                    <p>
                        The layout mirrors the reference&#39;s alternating feature band, but the content is grounded in
                        Billifty&#39;s product flow: start with rough input, tighten with saved data, then send something
                        that still looks properly branded.
                    </p>

                    <div className="workflow-list">
                        {workflowItems.map(({ title, description, icon: Icon }) => (
                            <article className="workflow-list-item" key={title}>
                                <div className="workflow-list-icon">
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="workflow-cta">
                        <Button
                            as={Link}
                            href={uri.create_invoice}
                            className="main-button button-size"
                            disableRipple
                            size="lg"
                        >
                            Try Guided Drafting
                            <ArrowRight size={16} strokeWidth={2.2} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
