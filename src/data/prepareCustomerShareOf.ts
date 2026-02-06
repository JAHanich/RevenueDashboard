import { RevenueRow } from "./loadRevenueData";
import aggregateRevenue from "./prepareAggregateRevenue";

export default function prepareCustomerShareOf(customerData: RevenueRow[], totalData: RevenueRow[]) {
    const totalRevenueByMonth = aggregateRevenue(totalData);

    const labels = customerData.map((d) => d.month);

    const totalByMonth = Object.fromEntries(totalRevenueByMonth.map(d => [d.month, d.revenue]));

    const dataset = {
        label: "Share of Total Revenue",
        data: customerData.map(d => d.revenue / totalByMonth[d.month])
    };

    const chartData = {
        labels,
        datasets: [dataset],
    };
    
    return chartData;
}