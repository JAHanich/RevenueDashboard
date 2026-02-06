import { RevenueRow } from "./loadRevenueData";

/**
 * Get unique customers from loaded data
 */
export function getCustomers(data: RevenueRow[]): string[] {
  const set = new Set(data.map(d => d.customer));
  return Array.from(set).sort();
}

/**
 * Get unique months from loaded data
 */
export function getMonths(data: RevenueRow[]): string[] {
  const set = new Set(data.map(d => d.month));
  return Array.from(set).sort();
}

/**
 * Filter data by customer and month range
 */
export function filterRevenue(
  data: RevenueRow[],
  selectedCustomer: string,
  startMonth: string,
  endMonth: string
): RevenueRow[] {
  return data.filter(row => {
    const inCustomer =
      selectedCustomer === "All" || row.customer === selectedCustomer;
    const inPeriod =
      row.month >= startMonth && row.month <= endMonth;
    return inCustomer && inPeriod;
  });
}