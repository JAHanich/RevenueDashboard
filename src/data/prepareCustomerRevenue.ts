import { RevenueRow } from "./loadRevenueData";

export default function formatCustomerRevenue(data: RevenueRow[]) {
  const labels = data.map((d) => d.month);

  const dataset = {
    label: "Revenue",
    data: data.map((d) => d.revenue),
  };

  const chartData = {
    labels,
    datasets: [dataset],
  };

  return chartData;
}
