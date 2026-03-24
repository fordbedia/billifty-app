import { Button, Link } from "@heroui/react";
import { ArrowRight, Bot, CreditCard, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { uri } from "@/app/constants/routePaths";

export default function CenterBanner() {
    return (
        <div className="max-w-7xl w-full">
            <div className="hero-shell">
                <div className="hero-background-layer" aria-hidden="true">
                    <span className="hero-orb hero-orb-one"></span>
                    <span className="hero-orb hero-orb-two"></span>
                    <span className="hero-orb hero-orb-three"></span>
                    <span className="hero-texture-grid"></span>
                </div>
                <div className="home-hero-grid">
                    <div className="hero-copy">
                        <p className="hero-kicker">Billifty Invoice Operating System</p>
                        <h1>
                            Design invoices that feel <span className="glow-color">clear to build</span> and
                            confident to send.
                        </h1>
                        <p className="hero-text">
                            Billifty brings branding, client memory, invoice drafting, and send-ready structure into
                            one calm workspace so your billing flow looks polished without becoming slower.
                        </p>
                        <div className="hero-proof-list">
                            <span>Brand-led templates</span>
                            <span>Reusable client context</span>
                            <span>AI-assisted first drafts</span>
                        </div>
                        <div className="hero-cta-row">
                            <Button
                                as={Link}
                                href={uri.intro}
                                className="main-button button-size"
                                disableRipple
                                size="lg"
                            >
                                Get Started Free
                                <ArrowRight size={16} strokeWidth={2.2} />
                            </Button>
                            <Button
                                as={Link}
                                href={uri.invoices}
                                variant="bordered"
                                className="secondary-button button-size"
                                disableRipple
                                size="lg"
                            >
                                Open Dashboard
                            </Button>
                        </div>

                        <div className="hero-micro-proof">
                            <article>
                                <strong>Fewer resets</strong>
                                <span>Save client details, services, and payment defaults once.</span>
                            </article>
                            <article>
                                <strong>Cleaner output</strong>
                                <span>Send invoices that look intentional on desktop and mobile.</span>
                            </article>
                        </div>
                    </div>
                    <div className="hero-stage">
                        <span className="hero-canvas-orb" aria-hidden="true"></span>
                        <div className="hero-stage-window">
                            <div className="hero-stage-topbar">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="hero-stage-grid">
                                <div className="hero-stage-sidebar">
                                    <div className="hero-stage-navcard">
                                        <p>Workspace status</p>
                                        <strong>2 drafts ready to review</strong>
                                    </div>
                                    <div className="hero-stage-list">
                                        <div>
                                            <Bot size={16} strokeWidth={2} />
                                            <span>AI draft assistant</span>
                                        </div>
                                        <div>
                                            <Sparkles size={16} strokeWidth={2} />
                                            <span>Brand styling presets</span>
                                        </div>
                                        <div>
                                            <ShieldCheck size={16} strokeWidth={2} />
                                            <span>Client-ready payment blocks</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="hero-stage-canvas">
                                    <div className="hero-stage-heading">
                                        <div>
                                            <p className="preview-label">Invoice preview</p>
                                            <h3>Northline Studio</h3>
                                        </div>
                                        <span className="hero-stage-total">$3,480</span>
                                    </div>

                                    <div className="hero-stage-lines">
                                        <div>
                                            <span>Design system sprint</span>
                                            <strong>$1,950</strong>
                                        </div>
                                        <div>
                                            <span>Content updates</span>
                                            <strong>$860</strong>
                                        </div>
                                        <div>
                                            <span>Launch QA and review</span>
                                            <strong>$670</strong>
                                        </div>
                                    </div>

                                    <div className="hero-stage-insights">
                                        <article>
                                            <FileText size={18} strokeWidth={1.8} />
                                            <div>
                                                <strong>Template selected</strong>
                                                <span>Modern layout with logo and accent color</span>
                                            </div>
                                        </article>
                                        <article>
                                            <CreditCard size={18} strokeWidth={1.8} />
                                            <div>
                                                <strong>Payment terms ready</strong>
                                                <span>Net 14, transfer instructions included</span>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hero-floating-note hero-floating-note-one">
                            <span>AI draft prepared</span>
                            <strong>Reviewed in 2 minutes</strong>
                        </div>

                        <div className="hero-floating-note hero-floating-note-two">
                            <span>Client memory synced</span>
                            <strong>Tax and contact details reused</strong>
                        </div>
                    </div>
                </div>

                <div className="hero-meta-row">
                    <div>
                        <p>Draft faster</p>
                        <strong>Reusable client and business profiles</strong>
                    </div>
                    <div>
                        <p>Look sharper</p>
                        <strong>Template-driven layouts with brand control</strong>
                    </div>
                    <div>
                        <p>Stay focused</p>
                        <strong>One workspace from setup to send</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}
