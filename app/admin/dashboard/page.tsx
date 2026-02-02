"use client"

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UsersView } from '@/components/admin/views/UsersView';
import { ProjectsView } from '@/components/admin/views/ProjectsView';
import { TasksView } from '@/components/admin/views/TasksView';
import { TaskListsView } from '@/components/admin/views/TaskListsView';
import { RolesView } from '@/components/admin/views/RolesView';
// Comments view skipped for brevity but pattern is identical

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto w-full">
         <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                 <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 capitalize">{activeTab}</h1>
            </div>

            {activeTab === 'dashboard' && (
                <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Welcome to Admin Panel</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Select a module from the sidebar to manage records.</p>
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