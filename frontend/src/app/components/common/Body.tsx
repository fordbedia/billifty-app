import CenterBanner from "@/app/components/common/body/CenterBanner";
import InfoBanner from "@/app/components/common/body/InfoBanner";
import StreamlineBanner from "@/app/components/common/body/StreamlineBanner";
import BeautifulInvoiceDesign from "@/app/components/common/body/BeatifulInvoiceDesign";

export default function Body() {
    return (
        <div className="home">
            <div className="w-full flex justify-center px-5 center-banner-bg">
                <CenterBanner />
            </div>
            <div className="w-full flex justify-center px-5">
                <BeautifulInvoiceDesign />
            </div>
            <div className="w-full banner-bg-version-one flex justify-center px-5">
                <InfoBanner />
            </div>
            <div className="w-full flex justify-center px-5">
                <StreamlineBanner />
            </div>
        </div>
    )
}