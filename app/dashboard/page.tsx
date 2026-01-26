"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { FolderKanban, CheckSquare, Users, AlertCircle, Clock, ArrowUpRight } from "lucide-react";

// --- Mock Data (Based on Schema) ---

const users = [
  { userID: 1, userName: "Alice", role: "Admin" },
  { userID: 2, userName: "Bob", role: "User" },
  { userID: 3, userName: "Charlie", role: "User" },
  { userID: 4, userName: "Diana", role: "Manager" },
  { userID: 5, userName: "Evan", role: "User" },
];

const projects = [
  { projectID: 1, projectName: "Website Redesign", status: "Active" },
  { projectID: 2, projectName: "Mobile App", status: "Active" },
  { projectID: 3, projectName: "Internal Tools", status: "On Hold" },
  { projectID: 4, projectName: "Marketing Campaign", status: "Completed" },
];

const tasks = [
  { taskID: 1, title: "Design Home Page", status: "Completed", priority: "High" },
  { taskID: 2, title: "Implement Login", status: "In Progress", priority: "High" },
  { taskID: 3, title: "Setup Database", status: "Completed", priority: "Medium" },
  { taskID: 4, title: "Create API Endpoints", status: "In Progress", priority: "High" },
  { taskID: 5, title: "Write Documentation", status: "Pending", priority: "Low" },
  { taskID: 6, title: "Fix Navigation Bug", status: "Pending", priority: "Medium" },
  { taskID: 7, title: "Deploy to Staging", status: "Pending", priority: "High" },
];

const taskHistory = [
  { historyID: 1, taskTitle: "Design Home Page", changeType: "Status Changed", changedBy: "Alice", time: "2 hours ago" },
  { historyID: 2, taskTitle: "Implement Login", changeType: "Assigned", changedBy: "Diana", time: "4 hours ago" },
  { historyID: 3, taskTitle: "Write Documentation", changeType: "Created", changedBy: "Bob", time: "1 day ago" },
  { historyID: 4, taskTitle: "Setup Database", changeType: "Completed", changedBy: "Evan", time: "1 day ago" },
];

// --- Data Processing for Charts ---

const statusData = [
  { name: "Pending", value: tasks.filter(t => t.status === "Pending").length, color: "#f59e0b" },
  { name: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, color: "#3b82f6" },
  { name: "Completed", value: tasks.filter(t => t.status === "Completed").length, color: "#10b981" },
];

const priorityData = [
  { name: "Low", value: tasks.filter(t => t.priority === "Low").length, color: "#10b981" },
  { name: "Medium", value: tasks.filter(t => t.priority === "Medium").length, color: "#f59e0b" },
  { name: "High", value: tasks.filter(t => t.priority === "High").length, color: "#ef4444" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
           <p className="text-zinc-500 dark:text-zinc-400 mt-1">Overview of project progress and team activity.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Export Report
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                + New Project
            </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
               <span className="text-green-600 flex items-center font-medium"><ArrowUpRight size={12}/> +2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status !== "Completed").length}</div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <span className="text-blue-600 font-medium">{tasks.filter(t => t.status === "In Progress").length}</span> in progress
            </p>
          </CardContent>
        </Card>

        

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Team Members</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-zinc-500 mt-1">Active contributors</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium text-zinc-500">Pending High Priority</CardTitle>
             <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => t.priority === "High" && t.status !== "Completed").length}
             </div>
             <p className="text-xs text-zinc-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Charts & Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Task Status Chart */}
        <Card className="col-span-4 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Overview of task completion status across all projects</CardDescription>
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
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Pie Chart */}
        <Card className="col-span-3 hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Workload by Priority</CardTitle>
             <CardDescription>Current active tasks breakdown</CardDescription>
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
                            {priorityData.map((entry, index) => (
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

      {/* Recent Activity Table */}
      <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {taskHistory.map((item) => (
                      <div key={item.historyID} className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-4">
                              <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Clock size={16} />
                              </div>
                              <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.changedBy}</span> {item.changeType.toLowerCase()} <span className="text-zinc-700 dark:text-zinc-300">"{item.taskTitle}"</span>
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                      {item.time}
                                  </p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}