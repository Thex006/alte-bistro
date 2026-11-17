import { describe, expect, it } from "vitest";
import { budapestClock, openStatus } from "../lib/open-status";
import { formatHuf } from "../lib/site";

const WED = 3, MON = 1, TUE = 2, SUN = 0;

describe("openStatus", () => {
  it("is open on a service night after 18:00", () => {
    expect(openStatus(WED, 20 * 60).kind).toBe("open");
  });
  it("counts the hour after midnight as the previous night's service", () => {
    expect(openStatus(MON, 30)).toMatchObject({ kind: "open" }); // Sunday night runs into Monday
    expect(openStatus(MON, 61).kind).toBe("closed");
  });
  it("says it opens tonight before 18:00 on a service day", () => {
    expect(openStatus(SUN, 12 * 60)).toMatchObject({ kind: "later", label: "Opens tonight at 18:00" });
  });
  it("points to the next service day when closed", () => {
    expect(openStatus(TUE, 22 * 60).label).toBe("Closed today, back tomorrow at 18:00");
    expect(openStatus(MON, 22 * 60).label).toBe("Closed today, back Wednesday at 18:00");
  });
  it("reads Budapest wall clock regardless of host zone", () => {
    // 2026-11-17T21:30Z is Tuesday 22:30 in Budapest (CET, UTC+1)
    expect(budapestClock(new Date("2026-11-17T21:30:00Z"))).toEqual({ day: TUE, minutes: 22 * 60 + 30 });
  });
});

describe("formatHuf", () => {
  it("formats forint prices", () => {
    expect(formatHuf(3500)).toMatch(/^3\s?500 HUF$/);
  });
});
