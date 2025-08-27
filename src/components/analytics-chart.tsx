"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface AnalyticsData {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: AnalyticsData[];
  type?: 'list' | 'progress' | 'grid';
}

export function AnalyticsChart({ 
  title, 
  description, 
  data, 
  type = 'list' 
}: AnalyticsChartProps) {
  const [animatedData, setAnimatedData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    // Animate the data loading
    const timer = setTimeout(() => {
      setAnimatedData(data);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const maxValue = Math.max(...data.map(item => item.value));

  const renderList = () => (
    <div className="space-y-3">
      {animatedData.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{item.label}</span>
            {item.trend && getTrendIcon(item.trend)}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{item.value}</Badge>
            {item.change !== undefined && (
              <span className={`text-xs ${getTrendColor(item.trend)}`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-4">
      {animatedData.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.label}</span>
            <span className="text-sm text-muted-foreground">{item.value}</span>
          </div>
          <Progress 
            value={(item.value / maxValue) * 100} 
            className="h-2"
          />
        </div>
      ))}
    </div>
  );

  const renderGrid = () => (
    <div className="grid grid-cols-2 gap-4">
      {animatedData.map((item, index) => (
        <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-xs text-muted-foreground">{item.label}</div>
          {item.change !== undefined && (
            <div className={`text-xs flex items-center justify-center mt-1 ${getTrendColor(item.trend)}`}>
              {getTrendIcon(item.trend)}
              <span className="ml-1">{item.change > 0 ? '+' : ''}{item.change}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'progress':
        return renderProgress();
      case 'grid':
        return renderGrid();
      default:
        return renderList();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {animatedData.length > 0 ? (
          renderContent()
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Real-time analytics hook
export function useRealTimeAnalytics(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/analytics/stats?days=1');
        if (response.ok) {
          const newData = await response.json();
          setData(newData);
        }
      } catch (error) {
        console.error('Failed to fetch real-time analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, isLoading };
}
