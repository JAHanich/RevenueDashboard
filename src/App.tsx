import { Stack, ComboBox, IComboBoxOption, Autofill, format } from "@fluentui/react";
import { Card, CardHeader, Text } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto"


import { loadRevenueData, RevenueRow } from "./data/loadRevenueData";
import { getCustomers, getMonths, filterRevenue } from "./data/revenueSelectors";
import formatCustomerRevenue from "./data/prepareCustomerRevenue";
import formatCustomerYOY from "./data/prepareCustomerYOY";
import formatCustomerMOM from "./data/prepareCustomerMOM";
import AggregateRevenue from "./data/prepareAggregateRevenue"; 
import prepareCustomerShareOf from "./data/prepareCustomerShareOf";
import prepareHH from "./data/prepareHH";

export default function App() {
  const [data, setData] = useState<RevenueRow[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("All");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  useEffect(() => {
    loadRevenueData()
      .then(setData)
      .catch(console.error);
  }, []);

  const customers = ["All", ...getCustomers(data)];
  const months = getMonths(data);

  const customerOptions: IComboBoxOption[] = customers.map(c => ({ key: c, text: c }));
  const monthOptions: IComboBoxOption[] = months.map(m => ({ key: m, text: m }));

  useEffect(() => {
    if (months.length > 0 && !startMonth && !endMonth) {
      setStartMonth(months[0]);
      setEndMonth(months[months.length - 1]);
    }
  }, [months]);

  const filteredCustomerData: RevenueRow[] = filterRevenue(data, selectedCustomer, startMonth, endMonth);
  const filteredData: RevenueRow[] = filterRevenue(data, "All", startMonth, endMonth);


  return (
    <Stack
      styles={{ root: { width: "100%", padding: 20 } }} tokens={{ childrenGap: 20 }}>
      <h1>Revenue Dashboard</h1>

      <Stack horizontal tokens={{ childrenGap: 16 }} styles={{ root: { alignItems: "end" } }}>
        <ComboBox
          label="Customer"
          selectedKey={selectedCustomer}
          options={customerOptions}
          onChange={(_, option) => option && setSelectedCustomer(option.key as string)}
          useComboBoxAsMenuWidth
          allowFreeform
          autoComplete="on"
          styles={{ root: { width: 250 } }}
        />

        <ComboBox
          label="From"
          selectedKey={startMonth}
          options={monthOptions}
          onChange={(_, option) => option && setStartMonth(option.key as string)}
          useComboBoxAsMenuWidth
          allowFreeform
          autoComplete="on"
          styles={{ root: { width: 150 } }}
        />

        <ComboBox
          label="To"
          selectedKey={endMonth}
          options={monthOptions}
          onChange={(_, option) => option && setEndMonth(option.key as string)}
          useComboBoxAsMenuWidth
          allowFreeform
          autoComplete="on"
          styles={{ root: { width: 150 } }}
        />
      </Stack>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Revenue for { selectedCustomer }</Text>}
        />
        <Line data={formatCustomerRevenue(filteredCustomerData)} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Revenue for { selectedCustomer } in { endMonth.slice(-2) }</Text>}
        />
        <Bar data={formatCustomerYOY(filteredCustomerData)} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Monthly revenue growth for { selectedCustomer }</Text>}
        />
        <Bar data={formatCustomerMOM(filteredCustomerData)} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Share of Total Revenue for { selectedCustomer }</Text>}
        />
        <Line data={prepareCustomerShareOf(filteredCustomerData, filteredData)} />
      </Card>

      <Card>
        <CardHeader
          header={<Text weight="semibold">Total Monthly Revenue</Text>}
        />
        <Line data={formatCustomerRevenue(AggregateRevenue(filteredData))} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Total Revenue in { endMonth.slice(-2) }</Text>}
        />
        <Bar data={formatCustomerYOY(AggregateRevenue(filteredData))} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Total Monthly Revenue Growth</Text>}
        />
        <Bar data={formatCustomerMOM(AggregateRevenue(filteredData))} />
      </Card>
      <Card>
        <CardHeader
          header={<Text weight="semibold">Herfindahl-Hirschman Index (HHI) Over Time</Text>}
        />
        <Line data={prepareHH(filteredData)} />
      </Card>

    </Stack>
  );
}