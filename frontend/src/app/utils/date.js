import {parseDate} from "@internationalized/date";

export const toDateValue = (s) => {
	if (!s) return null;
	if (typeof s === "string") return parseDate(s);        // "2025-11-06"
	if (typeof s === "object" && typeof s.toString === "function") {
		// Handles HeroUI DateValue or JS Date → "YYYY-MM-DD"
		const iso = s.toString().slice(0, 10);
		return parseDate(iso);
	}
	return null;
};

export const toISO = (v) => (v ? v.toString().slice(0, 10) : null); // DateValue → "YYYY-MM-DD"\

export const formattedDate = (value) => {
	if (!value) {
        return "-";
    }

    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}