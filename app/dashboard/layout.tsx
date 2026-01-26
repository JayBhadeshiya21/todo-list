import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 hidden md:flex flex-col shadow-sm">
        <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight flex items-center gap-2 text-blue-600 dark:text-blue-500">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-lg">T</span>
            </div>
            TodoSystem
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 p-4">
          <p className="px-2 pb-2 text-xs font-semibold uppercase text-zinc-400 tracking-wider">Overview</p>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <LayoutDashboard size={18} />
              Dashboard
            </Button>
          </Link>
          <Link href="#">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <FolderKanban size={18} />
              Projects
            </Button>
          </Link>
          <Link href="#">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <CheckSquare size={18} />
              Tasks
            </Button>
          </Link>
          
          <p className="px-2 pt-6 pb-2 text-xs font-semibold uppercase text-zinc-400 tracking-wider">Management</p>
          <Link href="#">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <Users size={18} />
              Team Members
            </Button>
          </Link>
          <Link href="#">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
              <Settings size={18} />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="outline" className="w-full gap-2 text-zinc-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-900/10">
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2 md:hidden">
             <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                <span className="font-bold">T</span>
             </div>
             <span className="font-bold">TodoSystem</span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="flex items-center gap-2 mr-4 border-r border-zinc-200 dark:border-zinc-700 pr-4">
               <Link href="/login">
                 <Button variant="ghost" size="sm">Login</Button>
               </Link>
               <Link href="/register">
                 <Button size="sm">Register</Button>
               </Link>
             </div>
             <div className="text-right hidden sm:block">
               <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">John Doe</p>
               <p className="text-xs text-zinc-500">Administrator</p>
             </div>
             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-zinc-800">
                 <span className="text-sm font-bold">JD</span>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950/50 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
