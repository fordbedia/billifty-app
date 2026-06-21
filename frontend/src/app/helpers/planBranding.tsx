"use client"

import {PlanRecord, BusinessProfileRecord} from "@/app/props/invoice";
import {UserPlan} from "@/app/enums/UserPlan";
import {BilliftyLogo} from "@/app/components/common/NavBar";

export const shouldShowPremiumBranding = (plan: PlanRecord | null) => {
    return plan?.code === UserPlan.Premium
}

function getLogoPath(businessProfile: BusinessProfileRecord): string | null {
    return businessProfile?.logo_path ? '/storage/'+businessProfile?.logo_path : null;
}


export const showPlanBranding = (
        plan: PlanRecord,
        businessLogoPath: string | null | undefined,
        name: string = '',
        position: 'text-start' | 'text-left' | 'text-center' | 'text-right' = 'text-start'
    ) => {
    return (
        shouldShowPremiumBranding(plan) ? (
            businessLogoPath
                ? <img width={142} height={52} src={businessLogoPath} alt={`${name} logo`} />
                : <div className={`min-w-[280px] text-2xl font-semibold ${position}`}>{name}</div>
        ) : (
            <BilliftyLogo width={142} height={52}/>
        )
    )

}