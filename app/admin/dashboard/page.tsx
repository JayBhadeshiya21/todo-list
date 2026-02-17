"use client"

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UsersView } from '@/components/admin/views/UsersView';
import { ProjectsView } from '@/components/admin/views/ProjectsView';
import { TasksView } from '@/components/admin/views/TasksView';
import { TaskListsView } from '@/components/admin/views/TaskListsView';
import { RolesView } from '@/components/admin/views/RolesView';
import { LayoutDashboard, Users, FolderKanban, ListTodo, CheckSquare, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<any>({ 
      users: 0, projects: 0, taskLists: 0, tasks: 0, roles: 0,
      charts: { tasksByStatus: [], tasksByPriority: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (activeTab === 'dashboard') {
        fetchStats();
    }
  }, [activeTab]);

  const StatCard = ({ title, count, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">{loading ? '...' : count}</h3>
        </div>
        <div className={`p-4 rounded-full ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto w-full">
         <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 capitalize">{activeTab}</h1>
            </div>

            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white mb-8">
                        <h2 className="text-2xl font-bold mb-2">Welcome Back, Admin</h2>
                        <p className="opacity-90">Here's what's happening in your workspace today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Users" count={stats.users} icon={Users} color="bg-blue-500" />
                        <StatCard title="Active Projects" count={stats.projects} icon={FolderKanban} color="bg-purple-500" />
                        <StatCard title="Task Lists" count={stats.taskLists} icon={ListTodo} color="bg-orange-500" />
                        <StatCard title="Total Tasks" count={stats.tasks} icon={CheckSquare} color="bg-green-500" />
                        <StatCard title="User Roles" count={stats.roles} icon={Shield} color="bg-red-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        {/* Tasks by Status */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Tasks by Status</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.charts?.tasksByStatus}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.charts?.tasksByStatus?.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                         {/* Tasks by Priority */}
                         <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Tasks by Priority</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.charts?.tasksByPriority}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8">
                                            {stats.charts?.tasksByPriority?.map((entry: any, index: number) => (
                                                 <Cell key={`cell-${index}`} fill={
                                                     entry.name === 'High' ? '#ef4444' : 
                                                     entry.name === 'Medium' ? '#f59e0b' : '#3b82f6'
                                                 } />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'projects' && <ProjectsView />}
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'tasklists' && <TaskListsView />}
            {activeTab === 'roles' && <RolesView />}
            {activeTab === 'comments' && <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">Comments Management (Coming Soon)</div>}
         </div>
      </main>
    </div>
  );
}