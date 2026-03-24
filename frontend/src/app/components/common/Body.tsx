import CenterBanner from "@/app/components/common/body/CenterBanner";
import InfoBanner from "@/app/components/common/body/InfoBanner";
import StreamlineBanner from "@/app/components/common/body/StreamlineBanner";
import BeautifulInvoiceDesign from "@/app/components/common/body/BeatifulInvoiceDesign";
import AiInvoiceAssistantBanner from "@/app/components/common/body/AiInvoiceAssistantBanner";
import TestimonialsBanner from "@/app/components/common/body/TestimonialsBanner";
import QuestionsBanner from "@/app/components/common/body/QuestionsBanner";
import MotionSection from "@/app/components/common/MotionSection";

export default function Body() {
    return (
        <div className="home home-v2">
            <MotionSection className="home-section home-section-hero" direction="up">
                <div className="section-shell section-shell-hero">
                    <CenterBanner />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-features" delay={0.04} direction="left">
                <div className="section-shell">
                    <InfoBanner />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-templates" delay={0.06} direction="right">
                <div className="section-shell">
                    <BeautifulInvoiceDesign />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-ai" delay={0.08} direction="left">
                <div className="section-shell">
                    <AiInvoiceAssistantBanner />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-proof" delay={0.1} direction="right">
                <div className="section-shell">
                    <TestimonialsBanner />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-questions" delay={0.12} direction="left">
                <div className="section-shell">
                    <QuestionsBanner />
                </div>
            </MotionSection>

            <MotionSection className="home-section home-section-cta" delay={0.14} direction="up">
                <div className="section-shell">
                    <StreamlineBanner />
                </div>
            </MotionSection>
        </div>
    )
}
