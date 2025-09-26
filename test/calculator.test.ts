import { describe, it, expect } from "vitest";
import { calculateDueDate } from "../src/calculator";


function makeDate(y: number, m: number, d: number, h: number, min: number): Date {
  return new Date(y, m, d, h, min);
}

describe("calculateDueDate", () => {
  it("returns the same day if turnaround fits within working hours", () => {
    const submit = makeDate(2023, 7, 22, 10, 0); // August 22 10:00
    const result = calculateDueDate(submit, 4); // 4 working hours
    expect(result).toEqual(makeDate(2023, 7, 22, 14, 0)); // August 22 14:00
  });

  it("rolls over to next day if turnaround exceeds working hours", () => {
      const submit = makeDate(2023, 7, 22, 15, 0); // August 22 15:00
      const result = calculateDueDate(submit, 4); // 4 working hours
      // 2h left 22 (15:00 → 17:00), 2h next day (Tue 9:00 → 11:00)
    expect(result).toEqual(makeDate(2023, 7, 23, 11, 0)); // August 23 11:00
  });

  it("handles multiple full days correctly", () => {
    const submit = makeDate(2023, 7, 22, 9, 0); // August 22 09:00
    const result = calculateDueDate(submit, 16); // 16 working hours = 2 days
    expect(result).toEqual(makeDate(2023, 7, 23, 17, 0)); // August 24 09:00
  });

  it("skips weekends", () => {
    const submit = makeDate(2023, 7, 25, 14, 0); // August 25 14:00
    const result = calculateDueDate(submit, 4);
    // 3h left on 25 ( which is a friday ) (14 → 17), 1h on 28 (9 → 10)
    expect(result).toEqual(makeDate(2023, 7, 28, 10, 0)); // August 28 10:00
  });

  it("returns exact same time after full working days turnaround", () => {
    const submit = makeDate(2023, 7, 22, 13, 30); // August 22 13:30
    const result = calculateDueDate(submit, 16); // 2 days
    expect(result).toEqual(makeDate(2023, 7, 24, 13, 30)); // August 24 13:30
  });

  it("handles minute precision correctly", () => {
    const submit = makeDate(2023, 7, 22, 16, 45); // August 22 16:45
    const result = calculateDueDate(submit, 1); // 1h turnaround
    // 15m left 22 (16:45 → 17:00), 45m 23 (09:00 → 09:45)
    expect(result).toEqual(makeDate(2023, 7, 23, 9, 45)); // August 23 09:45
  });

  it("handles long multi-day turnaround crossing a weekend", () => {
    const submit = makeDate(2023, 7, 22, 11, 0); // August 22 11:00
    const result = calculateDueDate(submit, 20); // 20h = 2.5 working days
    // 22nd 6h left (11–17), 14h remaining
    // 23rd 8h (9–17) → 6h remaining
    // 24th 6h (9–15)
    expect(result).toEqual(makeDate(2023, 7, 24, 15, 0)); // August 24 15:00
  });
});