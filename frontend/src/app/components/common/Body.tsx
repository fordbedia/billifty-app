import CenterBanner from "@/app/components/common/body/CenterBanner";
import InfoBanner from "@/app/components/common/body/InfoBanner";
import StreamlineBanner from "@/app/components/common/body/StreamlineBanner";

export default function Body() {
    return (
        <div className="home">
            <div className="w-full flex justify-center px-5">
                <CenterBanner />
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