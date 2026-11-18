import { site } from "./site";

export type OpenStatus =
  | { kind: "open"; label: string; short: string }
  | { kind: "later"; label: string; short: string }
  | { kind: "closed"; label: string; short: string };

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Wall clock in Budapest, independent of the visitor's own time zone. */
export function budapestClock(date: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Budapest",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: SHORT.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/**
 * Service runs 18:00 to 01:00, so the hour after midnight belongs to the
 * previous day's service. Pure: takes the Budapest day and minutes.
 */
export function openStatus(day: number, minutes: number): OpenStatus {
  const openDays: readonly number[] = site.openDays;
  const isOpenDay = (d: number) => openDays.includes(((d % 7) + 7) % 7);
  const OPEN = 18 * 60;
  const CLOSE_AFTER_MIDNIGHT = 60;

  if (minutes < CLOSE_AFTER_MIDNIGHT && isOpenDay(day - 1)) {
    return { kind: "open", label: `Open now until ${site.closes}`, short: `Open until ${site.closes}` };
  }
  if (isOpenDay(day) && minutes >= OPEN) {
    return { kind: "open", label: `Open now until ${site.closes}`, short: `Open until ${site.closes}` };
  }
  if (isOpenDay(day)) {
    return { kind: "later", label: `Opens tonight at ${site.opens}`, short: `Opens ${site.opens}` };
  }
  for (let i = 1; i <= 7; i++) {
    if (isOpenDay(day + i)) {
      const name = i === 1 ? "tomorrow" : DAY_NAMES[(day + i) % 7];
      return {
        kind: "closed",
        label: `Closed today, back ${name} at ${site.opens}`,
        short: i === 1 ? `Opens tomorrow ${site.opens}` : `Opens ${DAY_NAMES[(day + i) % 7].slice(0, 3)} ${site.opens}`,
      };
    }
  }
  return { kind: "closed", label: "Closed", short: "Closed" };
}
