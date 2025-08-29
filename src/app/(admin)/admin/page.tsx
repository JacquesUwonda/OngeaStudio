"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  MousePointer, 
  Eye,
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface AnalyticsStats {
  userStats: {
    totalUsers: number;
    totalEvents: number;
    activeUsers: number;
    totalSignups: number;
    conversionRate: number;
  };
  eventCounts: Array<{
    eventName: string;
    _count: { id: number };
  }>;
  popularFeatures: Array<{
    eventName: string;
    _count: { id: number };
  }>;
  recentSignups: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
    spokenLanguage: string;
    learningLanguage: string;
  }>;
  metrics: {
    pageViews: number;
    signupClicks: number;
    conversionRate: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30");

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/analytics/stats?days=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      setStats(data);
      setError("");
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchStats}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor user engagement and app performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchStats} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.userStats.totalSignups || 0} new signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Users with activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              User interactions tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.userStats.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Visitors to signups
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="features">Popular Features</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Activity</CardTitle>
              <CardDescription>Most frequent user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.eventCounts.slice(0, 10).map((event, index) => (
                  <div key={event.eventName} className="flex items-center justify-between">
                    <span className="text-sm">{event.eventName.replace(/_/g, ' ')}</span>
                    <Badge variant="secondary">{event._count.id}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Features</CardTitle>
              <CardDescription>Most used app features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.popularFeatures.map((feature, index) => (
                  <div key={feature.eventName} className="flex items-center justify-between">
                    <span className="text-sm">{feature.eventName.replace(/feature_/g, '').replace(/_/g, ' ')}</span>
                    <Badge variant="secondary">{feature._count.id}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Signups</CardTitle>
              <CardDescription>Latest users who joined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentSignups.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.spokenLanguage} → {user.learningLanguage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{format(new Date(user.createdAt), 'MMM dd')}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(user.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
