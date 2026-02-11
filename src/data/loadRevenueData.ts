import Papa from "papaparse";

/**
 * One row of revenue data in LONG format
 */
export type RevenueRow = {
  customer: string;
  month: string; // e.g. "2023-01"
  revenue: number;
};

/**
 * Load and transform revenue CSV into long format
 */
export async function loadRevenueData(): Promise<RevenueRow[]> {
  const response = await fetch("/data/revenueFull.csv");
  const csvText = await response.text();

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length) {
    console.error(parsed.errors);
    throw new Error("Failed to parse CSV");
  }

  return toLongFormat(parsed.data);
}

/**
 * Convert wide CSV rows to long format
 */
function toLongFormat(rows: Record<string, string>[]): RevenueRow[] {
  const result: RevenueRow[] = [];

  rows.forEach(row => {
    const customer = row["customer"];

    Object.entries(row).forEach(([key, value]) => {
      if (key !== "customer") {
        result.push({
          customer,
          month: key,
          revenue: Number(value),
        });
      }
    });
  });

  return result;
}