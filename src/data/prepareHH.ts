import { RevenueRow } from "./loadRevenueData";

export default function prepareHH(data: RevenueRow[]) {
    const revenuesByMonth = data.reduce((acc, { month, revenue }) => {
        if (!acc[month]) acc[month] = [];
        acc[month].push(revenue);
        return acc;
    }, {} as Record<string, number[]>);

    const hhByMonth = Object.entries(revenuesByMonth).map(([month, revenues]) => {
    const total = revenues.reduce((sum, r) => sum + r, 0);
        const hh = revenues.reduce((sum, r) => sum + (r / total) ** 2, 0);
        return { month, hh };
    });
    
    const labels = hhByMonth.map((d) => d.month);

    const dataset = {
        label: "Herfindahl-Hirschman Index (HHI)",
        data: hhByMonth.map((d) => d.hh),
    };

    const chartData = {
        labels,
        datasets: [dataset],
    };

  return chartData;
}