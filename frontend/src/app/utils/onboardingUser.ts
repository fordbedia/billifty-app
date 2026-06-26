import {PlanCapabilities} from "@/app/providers/AppContext";
import {UserRecord} from "@/app/props/invoice";

export const isOnboardingCompleted = <P extends PlanCapabilities>(me: UserRecord, planCap: P): boolean => {
    const businessProfile = planCap?.limits['current:businessProfiles']
    const clients = planCap?.limits['current:clients']
    const invoice = planCap?.limits['current:invoices']

    if ((businessProfile && clients && invoice) || Boolean(me?.onboarding?.is_completed)) {
        return true
    }

    return false;
}