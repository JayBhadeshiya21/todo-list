"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  ListTodo, 
  CheckSquare, 
  MessageSquare, 
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  role: string | null;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  
  const isAdmin = role === 'Admin';
  const isPM = role === 'Project Manager';
  const isTM = role === 'Team Member';

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: isAdmin ? '/admin/dashboard' : '/dashboard',
      show: true 
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: FolderKanban, 
      href: isAdmin ? '/admin/dashboard' : '/dashboard/projects',
      show: true 
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare, 
      href: isAdmin ? '/admin/dashboard' : '/dashboard/tasks',
      show: true 
    },
    { 
      id: 'users', 
      label: 'Team Members', 
      icon: Users, 
      href: '/admin/dashboard', 
      show: isAdmin 
    },
    { 
      id: 'tasklists', 
      label: 'Task Lists', 
      icon: ListTodo, 
      href: '/admin/dashboard', 
      show: isAdmin 
    },
    { 
      id: 'roles', 
      label: 'Roles', 
      icon: Shield, 
      href: '/admin/dashboard', 
      show: isAdmin 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings', 
      show: !isAdmin 
    },
  ];

  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-400 flex flex-col border-r border-zinc-800 shadow-2xl">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TodoSystem</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
        <div>
          <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Main Menu</p>
          <ul className="space-y-1.5">
            {menuItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <div className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-blue-600/10 text-blue-500' 
                        : 'hover:bg-zinc-900 hover:text-zinc-100'}
                    `}>
                      <Icon size={18} className={`${isActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-100'} transition-colors`} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 mt-auto border-t border-zinc-800/50 space-y-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{role}</p>
          </div>
        </div>

        <form action="/api/logout" method="POST">
          <button 
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
