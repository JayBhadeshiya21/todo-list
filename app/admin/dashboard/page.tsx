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
    <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800/50 backdrop-blur-md flex items-center justify-between group hover:border-blue-500/30 transition-all duration-300">
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">{title}</p>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">{loading ? '...' : count}</h3>
        </div>
        <div className={`p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300`}>
            <Icon size={20} />
        </div>
    </div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto w-full">
         <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/70 backdrop-blur-xl px-8 lg:px-12 dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-center gap-2 md:hidden">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <span className="font-bold tracking-tight">A</span>
                </div>
                <span className="font-bold tracking-tight">AdminPanel</span>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">Administrator</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Super Admin</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                        <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-indigo-600">AD</span>
                    </div>
                </div>
            </div>
         </header>

         <div className="p-8 lg:p-12">
            <div className="flex items-center justify-between mb-8">
                 <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize">{activeTab}</h1>
            </div>

            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    <div className="relative overflow-hidden p-10 bg-zinc-900 rounded-3xl border border-white/5 shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
                        
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-4xl font-bold text-white leading-tight">
                                Welcome Back, Admin
                            </h2>
                            <p className="text-zinc-400 max-w-xl text-lg">
                                Here's a complete overview of your workspace today. You're managing {stats.users} users across {stats.projects} active projects.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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