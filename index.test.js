const fs = require("fs");
const {
  formatCurrency,
  calculateRevenue,
  calculateExpenses,
  calculateGrossProfitMargin,
  calculateNetProfitMargin,
  calculateWorkingCapitalRatio,
} = require("./index"); //import fuctions

// Mocking fs
jest.mock("fs", () => ({
  readFile: jest.fn(),
}));

describe("Testing code-challenge functions", () => {
  test("formatCurrency should format a number prefixed with $ and , after every 3 digits", () => {
    expect(formatCurrency(1050)).toBe("$1,050");
    expect(formatCurrency(1000567)).toBe("$1,000,567");
    expect(formatCurrency(123550000)).toBe("$123,550,000");
  });

  test("calculateRevenue should add total revenue value", () => {
    const data = [
      {
        account_category: "revenue",
        account_code: "200",
        account_currency: "AUD",
        account_identifier: "e2bacdc6-2006-43c2-a5da-3c0e5f43b452",
        account_status: "ACTIVE",
        value_type: "credit",
        account_name: "Sales",
        account_type: "sales",
        account_type_bank: "",
        system_account: "",
        total_value: 100.0,
      },
      {
        account_category: "revenue",
        account_code: "400",
        account_currency: "AUD",
        account_identifier: "d392fe47-c99d-499e-a200-46709dd6b6e7",
        account_name: "Advertising",
        account_status: "ACTIVE",
        system_account: "",
        value_type: "debit",
        account_type_bank: "",
        total_value: 200.0,
        account_type: "overheads",
      },
      {
        account_category: "expense",
        account_currency: "AUD",
        account_identifier: "959af5f4-9925-44e8-b283-7ddf4b427238",
        account_status: "ACTIVE",
        value_type: "debit",
        system_account: "",
        total_value: 30.3,
        account_code: "404",
        account_name: "Bank Fees",
        account_type: "overheads",
        account_type_bank: "",
      },
    ];

    expect(calculateRevenue(data)).toBe(300);
  });

  test("calculateExpenses should add total expenses value", () => {
    const data = [
      {
        account_category: "revenue",
        account_code: "200",
        account_currency: "AUD",
        account_identifier: "e2bacdc6-2006-43c2-a5da-3c0e5f43b452",
        account_status: "ACTIVE",
        value_type: "credit",
        account_name: "Sales",
        account_type: "sales",
        account_type_bank: "",
        system_account: "",
        total_value: 100.0,
      },
      {
        account_category: "expense",
        account_code: "400",
        account_currency: "AUD",
        account_identifier: "d392fe47-c99d-499e-a200-46709dd6b6e7",
        account_name: "Advertising",
        account_status: "ACTIVE",
        system_account: "",
        value_type: "debit",
        account_type_bank: "",
        total_value: 200.0,
        account_type: "overheads",
      },
      {
        account_category: "expense",
        account_currency: "AUD",
        account_identifier: "959af5f4-9925-44e8-b283-7ddf4b427238",
        account_status: "ACTIVE",
        value_type: "debit",
        system_account: "",
        total_value: 50.0,
        account_code: "404",
        account_name: "Bank Fees",
        account_type: "overheads",
        account_type_bank: "",
      },
    ];

    expect(calculateExpenses(data)).toBe(250);
  });

  test("calculateGrossProfitMargin should calculate Gross Profit Margin", () => {
    const data = [
      {
        account_category: "revenue",
        account_code: "200",
        account_currency: "AUD",
        account_identifier: "e2bacdc6-2006-43c2-a5da-3c0e5f43b452",
        account_status: "ACTIVE",
        value_type: "debit",
        account_name: "Sales",
        account_type: "sales",
        account_type_bank: "",
        system_account: "",
        total_value: 1000.0,
      },
      {
        account_category: "revenue",
        account_code: "400",
        account_currency: "AUD",
        account_identifier: "d392fe47-c99d-499e-a200-46709dd6b6e7",
        account_name: "Advertising",
        account_status: "ACTIVE",
        system_account: "",
        value_type: "debit",
        account_type_bank: "",
        total_value: 2000.0,
        account_type: "sales",
      },
      {
        account_category: "expense",
        account_currency: "AUD",
        account_identifier: "959af5f4-9925-44e8-b283-7ddf4b427238",
        account_status: "ACTIVE",
        value_type: "debit",
        system_account: "",
        total_value: 50.0,
        account_code: "404",
        account_name: "Bank Fees",
        account_type: "overheads",
        account_type_bank: "",
      },
    ];

    const revenue = 3000;
    expect(calculateGrossProfitMargin(data, revenue)).toBe("100.00");
    expect(calculateGrossProfitMargin(data, 0)).toBe(0);
  });

  test("calculateNetProfitMargin should calculate Net Profit Margin", () => {
    const revenue = 3000;
    const expenses = 1000;

    expect(calculateNetProfitMargin(revenue, expenses)).toBe("66.67");
    expect(calculateNetProfitMargin(0, expenses)).toBe(0);
  });

  test("calculateWorkingCapitalRatio should calculate working capital ratio", () => {
    const data = [
      {
        account_category: "assets",
        value_type: "debit",
        account_type: "current",
        total_value: 500,
      },
      {
        account_category: "assets",
        value_type: "debit",
        account_type: "bank",
        total_value: 200,
      },
      {
        account_category: "assets",
        value_type: "credit",
        account_type: "current",
        total_value: 100,
      },
      {
        account_category: "liability",
        value_type: "debit",
        account_type: "current",
        total_value: 300,
      },
      {
        account_category: "liability",
        value_type: "credit",
        account_type: "current_accounts_payable",
        total_value: 50,
      },
      {
        account_category: "assets",
        account_code: "200",
        account_currency: "AUD",
        account_identifier: "e2bacdc6-2006-43c2-a5da-3c0e5f43b452",
        account_status: "ACTIVE",
        value_type: "debit",
        account_name: "Sales",
        account_type: "current",
        account_type_bank: "",
        system_account: "",
        total_value: 500.0,
      },
      {
        account_category: "assets",
        account_code: "400",
        account_currency: "AUD",
        account_identifier: "d392fe47-c99d-499e-a200-46709dd6b6e7",
        account_name: "Advertising",
        account_status: "ACTIVE",
        system_account: "",
        value_type: "debit",
        account_type_bank: "",
        total_value: 200.0,
        account_type: "bank",
      },
      {
        account_category: "assets",
        account_code: "200",
        account_currency: "AUD",
        account_identifier: "e2bacdc6-2006-43c2-a5da-3c0e5f43b452",
        account_status: "ACTIVE",
        value_type: "credit",
        account_name: "Sales",
        account_type: "current",
        account_type_bank: "",
        system_account: "",
        total_value: 100.0,
      },
      {
        account_category: "liability",
        account_code: "400",
        account_currency: "AUD",
        account_identifier: "d392fe47-c99d-499e-a200-46709dd6b6e7",
        account_name: "Advertising",
        account_status: "ACTIVE",
        system_account: "",
        value_type: "debit",
        account_type_bank: "",
        total_value: 300.0,
        account_type: "current",
      },
      {
        account_category: "liability",
        account_currency: "AUD",
        account_identifier: "959af5f4-9925-44e8-b283-7ddf4b427238",
        account_status: "ACTIVE",
        value_type: "credit",
        system_account: "",
        total_value: 50.0,
        account_code: "404",
        account_name: "Bank Fees",
        account_type: "current_accounts_payable",
        account_type_bank: "",
      },
    ];

    expect(calculateWorkingCapitalRatio(data)).toBe("-240.00");
  });
});
