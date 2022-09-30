import { Test, TestingModule } from "@nestjs/testing";
import { CalcService } from "../bl/calc.service";
import { UtilsService } from "../bl/utils.service";
import { RentService } from "./rent.service";
import Const from "../constants";
import { RentInput } from "./rent.dto";
import { BadRequestException } from "@nestjs/common";

const mockHandler = jest.fn();

const calcStub = {
  prelimitCalculation: jest.fn()
};

const DBStub = {
  query: jest.fn(),
  getClient: jest.fn(),
  singleCommand: jest.fn()
};

describe("Rent Service", () => {
  let serviceProvider: RentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        UtilsService,
        {
          provide: CalcService,
          useValue: calcStub
        },
        {
          provide: Const.DATABASE_MODULE,
          useValue: DBStub
        }
      ]
    }).compile();
    serviceProvider = module.get(RentService);
  });

  afterEach(() => {
    DBStub.query.mockClear();
    DBStub.singleCommand.mockClear();
    calcStub.prelimitCalculation.mockClear();
    mockHandler.mockClear();
  });

  it("should be defined", () => {
    expect(serviceProvider).toBeDefined();
  });

  describe("IsAvailbale Tests", () => {
    it("should return true with a warning if dates are available but period too long", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-01"),
        end: new Date("2022-08-31")
      };
      DBStub.query.mockResolvedValue({ rowCount: 0 });
      const result = await serviceProvider.isAvailable(input);

      expect(DBStub.query).toHaveBeenCalledWith(expect.anything(), [1, "2022-07-29", "2022-09-03"]);
      expect(result).toEqual({ result: true, warnings: ["You check period that is more than 30 days. Booking will be unavailable."] });
    });

    it("should return false with a warning if dates are not available and one of a date is a weekend", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-06"),
        end: new Date("2022-08-31")
      };
      DBStub.query.mockResolvedValue({ rowCount: 1 });
      const result = await serviceProvider.isAvailable(input);

      expect(DBStub.query).toHaveBeenCalledWith(expect.anything(), [1, "2022-08-03", "2022-09-03"]);
      expect(result).toEqual({ result: false, warnings: ["Start or end date is a weekend day. Booking will be unavailable."] });
    });

    it("should return error if dates are wrong", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-09-06"),
        end: new Date("2022-08-31")
      };
      DBStub.query.mockResolvedValue({ rowCount: 1 });

      await expect(serviceProvider.isAvailable(input)).rejects.toEqual(new BadRequestException("End date has to be after start date"));
      expect(DBStub.query).toHaveBeenCalledTimes(0);
    });
  });

  describe("PrelimCalc Tests", () => {
    it("should return sum for booking days", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-01"),
        end: new Date("2022-08-10")
      };
      const rates = [
        { id: 1, from: 1, to: 5, rate: 100, percentage: null },
        { id: 2, from: 6, to: 10, rate: 100, percentage: 5 },
        { id: 3, from: 11, to: 15, rate: 100, percentage: 10 }
      ];
      DBStub.query.mockResolvedValue({ rows: rates });
      calcStub.prelimitCalculation.mockReturnValue(950);
      const result = await serviceProvider.prelimCalc(input);

      const mappedRates = rates.map((rate) => ({ from: rate.from, to: rate.to, rate: rate.rate, percentage: rate.percentage }));
      expect(DBStub.query).toHaveBeenCalledWith(expect.anything(), [new Date("2022-08-01")]);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledWith(mappedRates, 10);
      expect(result).toEqual({ result: 950, warnings: [] });
    });

    it("should return error if dates order is incorrect", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-09-01"),
        end: new Date("2022-08-10")
      };

      await expect(serviceProvider.prelimCalc(input)).rejects.toEqual(new BadRequestException("End date has to be after start date"));
      expect(DBStub.query).toHaveBeenCalledTimes(0);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(0);
    });
  });

  describe("Booking tests", () => {
    it("should return error if period longer than 30 days", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-01"),
        end: new Date("2022-08-31")
      };

      await expect(serviceProvider.book(input)).rejects.toEqual(
        new BadRequestException("You check period that is more than 30 days. Booking will be unavailable.")
      );
      expect(DBStub.query).toHaveBeenCalledTimes(1); // called in IsAvailable func
      expect(DBStub.singleCommand).toHaveBeenCalledTimes(0);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(0);
    });

    it("should return error if one date (or both) is a weekend", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-06"),
        end: new Date("2022-08-13")
      };

      await expect(serviceProvider.book(input)).rejects.toEqual(
        new BadRequestException("Start or end date is a weekend day. Booking will be unavailable.")
      );
      expect(DBStub.query).toHaveBeenCalledTimes(1); // called in IsAvailable func
      expect(DBStub.singleCommand).toHaveBeenCalledTimes(0);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(0);
    });

    it("should return error if car is unavailable", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-01"),
        end: new Date("2022-08-10")
      };

      DBStub.query.mockResolvedValue({ rowCount: 1 });

      await expect(serviceProvider.book(input)).rejects.toEqual(new BadRequestException("Car is unavailable. Please, try other dates."));
      expect(DBStub.query).toHaveBeenCalledTimes(1); // called in IsAvailable func
      expect(DBStub.singleCommand).toHaveBeenCalledTimes(0);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(0);
    });

    it("should return error if dates are wrong", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-09-06"),
        end: new Date("2022-08-31")
      };

      await expect(serviceProvider.book(input)).rejects.toEqual(new BadRequestException("End date has to be after start date"));
      expect(DBStub.query).toHaveBeenCalledTimes(0);
      expect(DBStub.singleCommand).toHaveBeenCalledTimes(0);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(0);
    });

    it("should return true if car is booked", async () => {
      const input: RentInput = {
        id: 1,
        start: new Date("2022-08-01"),
        end: new Date("2022-08-10")
      };
      const rates = [
        { id: 1, from: 1, to: 5, rate: 100, percentage: null },
        { id: 2, from: 6, to: 10, rate: 100, percentage: 5 },
        { id: 3, from: 11, to: 15, rate: 100, percentage: 10 }
      ];
      DBStub.query
        .mockResolvedValueOnce({ rowCount: 0 }) // isAvailable request
        .mockResolvedValueOnce({ rows: rates }); // prelim cal call
      calcStub.prelimitCalculation.mockReturnValue(1300);
      DBStub.singleCommand.mockResolvedValue({ rowCount: 1 });

      const result = await serviceProvider.book(input);

      expect(DBStub.query).toHaveBeenCalledTimes(2);
      expect(DBStub.singleCommand).toHaveBeenCalledWith(expect.anything(), [1, new Date("2022-08-01"), new Date("2022-08-10"), 1300]);
      expect(calcStub.prelimitCalculation).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ result: true, warnings: [] });
    });
  });

  describe("Monthly Report Tests", () => {
    it("should return sum for booking days", async () => {
      const reportDBOutput = [
        { auto_id: 1, book_days: 12, book_percentage: 30, key: "auto" },
        { auto_id: 1, book_days: 12, book_percentage: 30, key: "total" }
      ];
      DBStub.query.mockResolvedValue({ rows: reportDBOutput });

      const result = await serviceProvider.monthlyReport();

      expect(DBStub.query).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ result: reportDBOutput, warnings: [] });
    });
  });
});
