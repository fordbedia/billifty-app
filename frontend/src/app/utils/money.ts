export const formatMoney = (
    amount?: number | null,
    currency: string = "USD",
    maxDecimals: number = 2
): string => {
    const value = (amount ?? 0) / 100;

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),

            minimumFractionDigits: 2,
            maximumFractionDigits: maxDecimals,
        }).format(value);
    } catch (e) {
        return `${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: maxDecimals,
        })} ${currency.toUpperCase()}`;
    }
};