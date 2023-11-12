import { beforeEach, describe, it, expect, vi } from "vitest";
import { createLoanUseCase } from "./use-case.js";
import { IDRepository, LoanRepository, SchedulerRepository } from "./ports.js";
import { CreateLoanParams, FrecuencyType, Loan } from "./types.js";
import { Response } from "../lib/try-fn.js";

const mockGenerateID = vi.fn<[], string>();
const mockSaveLoan = vi.fn<[Loan], Promise<Response<Loan>>>();
const mockCreateSchedule = vi.fn<
  [string, number, number, FrecuencyType, unknown],
  Promise<Response<boolean>>
>();

const idRepository: IDRepository = {
  generateID: mockGenerateID,
};
const loanRepository: LoanRepository = {
  listLoans: vi.fn(),
  saveLoan: mockSaveLoan,
};
const schedulerRepository: SchedulerRepository = {
  createSchedule: mockCreateSchedule,
};

const generateParams = ({
  amount = 100,
  frecuencyType = "monthly",
  paymentTimes = 1,
  timezoneOffsetMinutes = 0,
  startAt = 0,
}: Partial<CreateLoanParams>): CreateLoanParams => ({
  name: "John Doe",
  amount,
  currency: "USD",
  frecuencyType,
  paymentTimes,
  phone: "123456789",
  startAt,
  timezoneOffsetMinutes,
});

const generateLoan = (params: CreateLoanParams, id: string): Loan => ({
  ...params,
  id,
  monthlyPayment: params.amount / params.paymentTimes,
});

describe("loan", () => {
  beforeEach(() => {
    mockGenerateID.mockReset();
    mockSaveLoan.mockReset();
    mockCreateSchedule.mockReset();
  });

  describe("createLoanUseCase", () => {
    it("should resolve monthly payment correctly", async () => {
      const params = generateParams({ startAt: Date.now() });

      mockGenerateID.mockReturnValue("id");
      mockSaveLoan.mockResolvedValue([false, undefined, new Error()]);

      await createLoanUseCase(
        idRepository,
        loanRepository,
        schedulerRepository,
      ).createLoan(params);

      expect(mockSaveLoan.mock.calls[0][0].monthlyPayment).toBe(
        params.amount / params.paymentTimes,
      );
    });

    describe("when schedule is created", () => {
      it("should resolve startAt and endAt correctly when timezoneOffsetMinutes is 0", async () => {
        const params = generateParams({
          startAt: 1699815807,
          frecuencyType: "monthly",
          paymentTimes: 1,
          timezoneOffsetMinutes: 0,
        });

        const loan = generateLoan(params, "id");

        mockGenerateID.mockReturnValue("id");
        mockSaveLoan.mockResolvedValue([true, loan, undefined]);
        mockCreateSchedule.mockResolvedValue([false, undefined, new Error()]);

        await createLoanUseCase(
          idRepository,
          loanRepository,
          schedulerRepository,
        ).createLoan(params);

        const startAt = mockCreateSchedule.mock.calls[0][1];
        const endAt = mockCreateSchedule.mock.calls[0][2];

        expect(startAt).toBe(1702382400);
        expect(endAt).toBe(1702468800);
      });

      it("should resolve startAt and endAt correctly when timezoneOffsetMinutes is 300", async () => {
        const params = generateParams({
          startAt: 1699818975,
          frecuencyType: "monthly",
          paymentTimes: 1,
          timezoneOffsetMinutes: 300,
        });

        const loan = generateLoan(params, "id");

        mockGenerateID.mockReturnValue("id");
        mockSaveLoan.mockResolvedValue([true, loan, undefined]);
        mockCreateSchedule.mockResolvedValue([false, undefined, new Error()]);

        await createLoanUseCase(
          idRepository,
          loanRepository,
          schedulerRepository,
        ).createLoan(params);

        const startAt = mockCreateSchedule.mock.calls[0][1];
        const endAt = mockCreateSchedule.mock.calls[0][2];

        expect(startAt).toBe(1702400400);
        expect(endAt).toBe(1702486800);
      });
    });
  });
});
