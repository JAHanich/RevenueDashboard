import { RevenueRow } from "./loadRevenueData";

export default function aggregateRevenue(data: RevenueRow[]) {
    const revenueByMonthMap = data.reduce((acc, { month, revenue }) => {
    acc[month] = (acc[month] ?? 0) + revenue;
    return acc;
    }, {} as Record<string, number>);

    const revenueByMonth = Object.entries(revenueByMonthMap).map(
  ([month, revenue]) => ({ customer: "Aggregate", month, revenue })
);
    return revenueByMonth;
}