import { RevenueRow } from "./loadRevenueData";

export default function formatCustomerYOY(data: RevenueRow[]) {
    if (data && data.length > 0){
        const month: string = data[data.length - 1].month.slice(-2);

        const monthData = data.filter(item => item.month.slice(-2) === month);
        
        const labels = monthData.map((d) => d.month);

        const dataset = {
            label: "Revenue",
            data: monthData.map((d) => d.revenue),
        };
        
        const chartData = {
            labels,
            datasets: [dataset],
        };

        return chartData;

    } else {
        return { labels: [], datasets: [] };
    }
}
