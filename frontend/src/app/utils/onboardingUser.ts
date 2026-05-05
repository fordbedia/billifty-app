import {PlanCapabilities} from "@/app/providers/AppContext";

export const isOnboardingCompleted = <P extends PlanCapabilities>(planCap: P): boolean => {
    const businessProfile = planCap?.limits['current:businessProfiles']
    const clients = planCap?.limits['current:clients']
    const invoice = planCap?.limits['current:invoices']

    if (businessProfile && clients && invoice) {
        return true
    }

    return false;
}