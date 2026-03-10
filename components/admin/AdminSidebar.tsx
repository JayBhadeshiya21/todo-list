"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  ListTodo, 
  CheckSquare, 
  MessageSquare, 
  LogOut,
  Shield
} from 'lucide-react';
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
        { id: 'roles', label: 'Roles', icon: Shield },
        { id: 'comments', label: 'Comments', icon: MessageSquare },
      ];

  return (
    <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-zinc-950 text-zinc-400 transition-all duration-300 flex flex-col border-r border-zinc-800 shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
            {isSidebarOpen ? (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="font-bold text-xl">A</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Admin Panel</span>
                </div>
            ) : (
                <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <span className="font-bold text-xl">A</span>
                </div>
            )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
            <div>
                <p className={`px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ${!isSidebarOpen && 'hidden'}`}>Admin Menu</p>
                <ul className="space-y-1.5">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                    <li key={item.id}>
                        <button
                        onClick={() => setActiveTab(item.id)}
                        className={`
                            w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                            ${isActive 
                            ? 'bg-blue-600/10 text-blue-500' 
                            : 'hover:bg-zinc-900 hover:text-zinc-100'}
                            ${!isSidebarOpen && 'justify-center px-0'}
                        `}
                        >
                        <Icon size={18} className={`${isActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-100'} transition-colors`} />
                        {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                        {isSidebarOpen && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                        </button>
                    </li>
                    );
                })}
                </ul>
            </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/50">
             <Link href="/dashboard">
                <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 transition-all duration-200 ${!isSidebarOpen && 'justify-center px-0'}`}>
                    <LogOut size={18} />
                    {isSidebarOpen && <span className="font-medium text-sm">Exit Admin</span>}
                </button>
             </Link>
        </div>
    </aside>
  );
}
