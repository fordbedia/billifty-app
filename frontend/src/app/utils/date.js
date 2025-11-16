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

export const formattedDate = (dateString) => {
	const date = new Date(dateString);

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}