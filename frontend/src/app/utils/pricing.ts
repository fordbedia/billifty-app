import { uri } from "@/app/constants/routePaths"

export const proceedToPlan = (
    plan: string,
    planCapabilities: any,
    session: any,
    router: any
): void => {
    if (Array.isArray(planCapabilities) && planCapabilities.length === 0) {
        // Redirect to checkout
        console.log('redirecting to checkout')
        router.replace(`${uri.checkout}/?plan=${plan}`)
        return;
    }
    if (! session) {
        // Redirect to the login page
        console.log('redirecting to auth')
        router.replace(`${uri.auth}/?plan=${plan}`)
        return;
    }
}