"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FolderKanban, CheckSquare, Users, AlertCircle, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!stats) return null;

  const statusColors: any = {
    "Pending": "#f59e0b",
    "In Progress": "#3b82f6",
    "Completed": "#10b981",
    "On Hold": "#ef4444",
    "Cancelled": "#71717A"
  };

  const priorityColors: any = {
    "Low": "#10b981",
    "Medium": "#f59e0b",
    "High": "#ef4444",
    "Urgent": "#7f1d1d"
  };

  const statusData = stats.charts.status.map((s: any) => ({
    ...s,
    color: statusColors[s.name] || "#3b82f6"
  }));

  const priorityData = stats.charts.priority.map((p: any) => ({
    ...p,
    color: priorityColors[p.name] || "#3b82f6"
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
             {stats.role ? `${stats.role} Dashboard` : 'Dashboard'}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real-time overview of your projects and tasks.</p>
        </div>
      </div>

      <div className="relative overflow-hidden p-8 bg-zinc-900 rounded-2xl border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-bold text-white leading-tight">
                Welcome back, {stats.role || 'User'}
            </h2>
            <p className="text-zinc-400 max-w-lg">
                Your workspace is updated with the latest activity. You have {stats.tasks} tasks active across {stats.projects} projects.
            </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-zinc-500 mt-1">Managed or assigned projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks}</div>
            <p className="text-xs text-zinc-500 mt-1">Assigned to you or your projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Team Active</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.team}</div>
            <p className="text-xs text-zinc-500 mt-1">Collaborators</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Visual breakdown of tasks by their current status</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E4E4E7" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#71717A'}} width={100} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                        {statusData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Workload by Priority</CardTitle>
             <CardDescription>Breakdown of task priorities</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={priorityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {priorityData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                         <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {stats.activity.length > 0 ? stats.activity.map((item: any) => (
                      <div key={item.id} className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                              <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Clock size={16} />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.user}</span> {item.type.toLowerCase()} <span className="text-zinc-700 dark:text-zinc-300">"{item.taskTitle}"</span>
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                      {new Date(item.time).toLocaleString()}
                                  </p>
                              </div>
                          </div>
                      </div>
                  )) : (
                    <p className="text-sm text-zinc-500 py-4 text-center">No recent activity found.</p>
                  )}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}