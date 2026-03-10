import Link from "next/link";
import { Sidebar } from "@/components/common/Sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { normalizeRole } = await import("@/lib/auth");
  const role = normalizeRole(user.userroles[0]?.roles?.RoleName) || "Team Member";
  const userInitials = user.UserName.substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Sidebar role={role} userName={user.UserName} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/70 backdrop-blur-xl px-6 lg:px-8 dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center gap-2 md:hidden">
             <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                <span className="font-bold">T</span>
             </div>
             <span className="font-bold tracking-tight">TodoSystem</span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">{user.UserName}</p>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{role}</p>
             </div>
             <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1px]">
               <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                 <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-indigo-600">{userInitials}</span>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 bg-zinc-50/50 dark:bg-zinc-950/50 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
