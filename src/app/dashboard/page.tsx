'use server';

import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  FileCode2,
  Bot,
  BarChart,
  History,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTestRuns } from '@/services/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DashboardCharts } from './_components/dashboard-charts';

export default async function DashboardPage() {
  const testRuns = await getTestRuns();

  const totalRuns = testRuns.length;
  const passedRuns = testRuns.filter((run) => run.status === 'Pass').length;
  const failedRuns = totalRuns - passedRuns;
  const passRate = totalRuns > 0 ? (passedRuns / totalRuns) * 100 : 0;

  const chartData = [
    { name: 'Passed', value: passedRuns, fill: 'hsl(var(--chart-2))' },
    { name: 'Failed', value: failedRuns, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's a summary of your recent automated test runs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRuns}</div>
            <p className="text-xs text-muted-foreground">
              Total tests executed by the AI agent.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {passedRuns} of {totalRuns} tests passed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedRuns}</div>
            <p className="text-xs text-muted-foreground">
              Tests that failed or found issues.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Test Run Analytics
            </CardTitle>
            <CardDescription>
              A visual summary of passed vs. failed test runs.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {totalRuns > 0 ? (
                <DashboardCharts data={chartData} />
            ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <p className="text-muted-foreground">No test data available yet.</p>
                    <p className="text-sm text-muted-foreground">Run an AI Agent to see analytics.</p>
                     <Button variant="outline" size="sm" asChild className="mt-4">
                        <Link href="/ai-agent">
                            <Bot className="mr-2 h-4 w-4" /> Run Agent
                        </Link>
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Button variant="outline" asChild className="justify-start">
                        <Link href="/test-strategy"><FileText className="mr-2" /> Generate Strategy</Link>
                    </Button>
                     <Button variant="outline" asChild className="justify-start">
                        <Link href="/test-scripts"><FileCode2 className="mr-2" /> Generate Scripts</Link>
                    </Button>
                     <Button variant="default" asChild className="justify-start col-span-2">
                        <Link href="/ai-agent"><Bot className="mr-2" /> Run New AI Test</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Runs</CardTitle>
          <CardDescription>
            Here are the latest test runs executed by the AI agent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Task</TableHead>
                <TableHead className="hidden md:table-cell">URL</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Ran At
                  </div>
                </TableHead>
                <TableHead className="text-right">Video</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testRuns.length > 0 ? (
                testRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>
                      <Badge
                        variant={
                          run.status === 'Pass' ? 'secondary' : 'destructive'
                        }
                        className="capitalize"
                      >
                        {run.status === 'Pass' ? (
                          <CheckCircle2 className="mr-1 h-3 w-3 text-green-400" />
                        ) : (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{run.task}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[150px] truncate">{run.url}</TableCell>
                    <TableCell className="hidden lg:table-cell">{run.createdAt}</TableCell>
                    <TableCell className="text-right">
                      {run.videoUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={run.videoUrl} target="_blank" rel="noopener noreferrer">
                            View <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No test runs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
