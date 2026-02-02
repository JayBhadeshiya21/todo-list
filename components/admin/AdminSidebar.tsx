import React from 'react';
import { LayoutDashboard, Users, FolderKanban, ListTodo, CheckSquare, MessageSquare, LogOut } from 'lucide-react';
import Link from 'next/link';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
}

export function AdminSidebar({ activeTab, setActiveTab, isSidebarOpen }: AdminSidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'projects', label: 'Projects', icon: FolderKanban },
        { id: 'tasklists', label: 'Task Lists', icon: ListTodo },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'roles', label: 'Roles', icon: Users }, // Added Roles
        { id: 'comments', label: 'Comments', icon: MessageSquare },
      ];

  return (
    <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-zinc-900 text-white transition-all duration-300 flex flex-col border-r border-zinc-800`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-zinc-800">
            {isSidebarOpen ? (
                 <div className="text-xl font-bold tracking-tight text-white">Admin Panel</div>
            ) : (
                <div className="font-bold text-xl">A</div>
            )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
            <p className={`px-2 pb-2 text-[10px] font-semibold uppercase text-zinc-500 ${!isSidebarOpen && 'text-center'}`}>Menu</p>
            <ul className="space-y-1">
            {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                <li key={item.id}>
                    <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                    } ${!isSidebarOpen && 'justify-center'}`}
                    >
                    <Icon size={20} />
                    {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                    </button>
                </li>
                );
            })}
            </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
             <Link href="/dashboard">
                <button className={`w-full flex items-center gap-3 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                    <LogOut size={20} />
                    {isSidebarOpen && <span className="text-sm">Exit Admin</span>}
                </button>
             </Link>
        </div>
    </aside>
  );
}
