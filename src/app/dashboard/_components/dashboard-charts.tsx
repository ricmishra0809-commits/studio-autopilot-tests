'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';

type ChartData = {
    name: string;
    value: number;
    fill: string;
}

type DashboardChartsProps = {
    data: ChartData[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <ChartContainer config={{}} className="h-[200px] w-full">
      <RechartsBarChart
        accessibilityLayer
        data={data}
        layout="vertical"
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          className="capitalize"
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" radius={5} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
