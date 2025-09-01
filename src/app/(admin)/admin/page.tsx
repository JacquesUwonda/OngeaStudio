
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Layers, LineChart, Activity, Star, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart } from "recharts";
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartData = [
  { month: "January", users: 186 },
  { month: "February", users: 305 },
  { month: "March", users: 237 },
  { month: "April", users: 483 },
  { month: "May", users: 309 },
  { month: "June", users: 529 },
];

const recentSignIns = [
    { email: "user1@example.com", date: "2024-07-29 10:45 AM", status: "Success" },
    { email: "user2@example.com", date: "2024-07-29 10:42 AM", status: "Success" },
    { email: "user3@example.com", date: "2024-07-29 10:30 AM", status: "Success" },
    { email: "user4@example.com", date: "2024-07-29 10:15 AM", status: "Success" },
    { email: "user5@example.com", date: "2024-07-29 09:55 AM", status: "Success" },
];

const popularFeatures = [
    { name: "AI Stories", usage: 1240, icon: BookOpen },
    { name: "Flashcards", usage: 980, icon: Layers },
    { name: "AI Chat", usage: 750, icon: Activity },
    { name: "Scenarios", usage: 450, icon: Star },
];

const liveEvents = [
    { event: "Story Generated", details: "Topic: Technology", user: "user8@example.com", time: "2m ago" },
    { event: "Flashcard Set Complete", details: "Topic: Travel, 85% known", user: "user2@example.com", time: "3m ago" },
    { event: "Chat Message Sent", details: "Length: 12 words", user: "user12@example.com", time: "5m ago" },
    { event: "Scenario Started", details: "Scenario: At the Restaurant", user: "user3@example.com", time: "7m ago" },
    { event: "Language Changed", details: "Switched to learning Spanish", user: "user2@example.com", time: "10m ago" },
];

export default function AdminDashboardPage() {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287</div>
            <p className="text-xs text-muted-foreground">+12 since last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stories Generated</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,582</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcard Sets Created</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,129</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              New User Signups
            </CardTitle>
            <CardDescription>Monthly new user registrations for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={{
                users: {
                    label: "New Users",
                    color: "hsl(var(--primary))",
                },
             }} className="h-[300px] w-full">
                <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                    <Legend />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="users" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Most Popular Features
                </CardTitle>
                <CardDescription>Feature usage based on user interaction events.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {popularFeatures.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-4">
                        <div className="bg-muted p-2 rounded-md">
                            <feature.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{feature.name}</p>
                            {isClient && <p className="text-xs text-muted-foreground">{feature.usage.toLocaleString('en-US')} interactions</p>}
                        </div>
                        <div className="font-semibold text-lg">{popularFeatures.indexOf(feature) + 1}</div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
      </div>

       <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Event Stream
              </CardTitle>
              <CardDescription>
                A real-time feed of user interactions within the app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {liveEvents.map((event, index) => (
                          <TableRow key={index}>
                              <TableCell>
                                  <div className="font-medium">{event.event}</div>
                                  <div className="text-xs text-muted-foreground">{event.details}</div>
                              </TableCell>
                              <TableCell>{event.user}</TableCell>
                              <TableCell className="text-right">{event.time}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </CardContent>
          </Card>
      
          <Card>
            <CardHeader>
              <CardTitle>Recent User Sign-ins</CardTitle>
              <CardDescription>
                A log of the latest successful user authentication events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Sign-in Date</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {recentSignIns.map((signIn, index) => (
                          <TableRow key={index}>
                              <TableCell>
                                  <div className="font-medium">{signIn.email}</div>
                              </TableCell>
                              <TableCell>{signIn.date}</TableCell>
                              <TableCell className="text-right">
                                  <Badge variant="default" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20">{signIn.status}</Badge>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

    </main>
  );
}
