import { RevenueRow } from "./loadRevenueData";

export default function formatCustomerMOM(data: RevenueRow[]) {
    const MOMrate = data.map((value: RevenueRow, i: number, arr: (RevenueRow | null)[]) =>
        i === 0 ? null : (value.revenue - arr[i - 1]!.revenue) / arr[i - 1]!.revenue * 100
    );
    const labels = data.map((d) => d.month);

    const dataset = {
        label: "Month-over-Month Growth Rate (%)",
        data: MOMrate,
    };
        
    const chartData = {
        labels,
        datasets: [dataset],
    };

  return chartData;
}
