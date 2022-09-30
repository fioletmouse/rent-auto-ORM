import { UtilsService } from "./utils.service";

describe("Calc Service", () => {
  let utilsService: UtilsService;

  beforeAll(() => {
    utilsService = new UtilsService();
  });

  it("should return true if there is more than 30 days diff", async () => {
    const result = utilsService.moreThanDayLimit(new Date("2022-08-01"), new Date("2022-08-31"));
    expect(result).toBe(true);
  });

  it("should return false if there is exactly 30 days between dates", async () => {
    const result = utilsService.moreThanDayLimit(new Date("2022-08-01"), new Date("2022-08-30"));
    expect(result).toBe(false);
  });

  it("should return false if there less than 30 days between dates", async () => {
    const result = utilsService.moreThanDayLimit(new Date("2022-08-01"), new Date("2022-08-10"));
    expect(result).toBe(false);
  });

  it("should return true if at least 1 day is a weekend day", async () => {
    const result = utilsService.isWeekendDates(new Date("2022-08-12"), new Date("2022-08-13"));
    expect(result).toBe(true);
  });

  it("should return false if all dates are working days", async () => {
    const result = utilsService.isWeekendDates(new Date("2022-08-12"), new Date("2022-08-11"));
    expect(result).toBe(false);
  });

  it("should calculate days count between dates (including both)", async () => {
    const result = utilsService.daysCount(new Date("2022-08-10"), new Date("2022-08-15"));
    expect(result).toBe(6);
  });

  it("should calculate days count between dates (including both) for 1 day", async () => {
    const result = utilsService.daysCount(new Date("2022-08-10"), new Date("2022-08-10"));
    expect(result).toBe(1);
  });

  it("should check that first date is before the second one", async () => {
    const result = utilsService.datesRightOrder(new Date("2022-08-10"), new Date("2022-08-15"));
    expect(result).toBe(true);
  });

  it("should return false if first date is after the second one", async () => {
    const result = utilsService.datesRightOrder(new Date("2022-08-10"), new Date("2022-08-07"));
    expect(result).toBe(false);
  });

  it("should check that first date is the same as the second one", async () => {
    const result = utilsService.datesRightOrder(new Date("2022-08-10"), new Date("2022-08-10"));
    expect(result).toBe(true);
  });
});
