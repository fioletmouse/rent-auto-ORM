import { CalcService } from "./calc.service";

describe("Calc Service", () => {
  let calcService: CalcService;

  const rates = [
    { from: 1, to: 5, rate: 100, percentage: null },
    { from: 6, to: 10, rate: 100, percentage: 5 },
    { from: 11, to: 15, rate: 100, percentage: 10 }
  ];

  beforeAll(() => {
    calcService = new CalcService();
  });

  it("should calculate days without discount", async () => {
    const result = calcService.prelimitCalculation(rates, 5);
    expect(result).toBe(500);
  });

  it("should calculate for all rates", async () => {
    const result = calcService.prelimitCalculation(rates, 15);
    expect(result).toBe(1425);
  });

  it("should calculate first rate and the second one partically", async () => {
    const result = calcService.prelimitCalculation(rates, 7);
    expect(result).toBe(690);
  });
});
