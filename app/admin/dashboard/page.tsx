"use client"

import { Users, FolderKanban, ListTodo, CheckSquare, MessageSquare, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, href: '/admin/projects' },
    { id: 'tasklists', label: 'Task Lists', icon: ListTodo, href: '/admin/tasklists' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/admin/tasks' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, href: '/admin/comments' },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'bg-blue-500' },
    { label: 'Active Projects', value: '56', change: '+8%', color: 'bg-green-500' },
    { label: 'Total Tasks', value: '892', change: '+23%', color: 'bg-purple-500' },
    { label: 'Pending Tasks', value: '234', change: '-5%', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {isSidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="font-bold">A</span>
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-400">admin@example.com</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <input 
                type="search" 
                placeholder="Search..." 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Item
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <span className={`w-3 h-3 rounded-full ${stat.color}`}></span>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">New user registered</p>
                        <p className="text-sm text-gray-500">user{item}@example.com joined the platform</p>
                      </div>
                      <span className="text-sm text-gray-400">{item}h ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600">
                {menuItems.find(item => item.id === activeTab)?.label} management interface will be displayed here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}