import Link from "next/link";
import { CheckCircle, Zap, Shield, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform duration-300">
              <CheckCircle className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-zinc-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 mt-40 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 mb-40 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-8 transition-transform hover:scale-105 cursor-default">
              <Zap className="w-4 h-4 fill-current" />
              Next-Gen Task Management
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Manage tasks with <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">precision</span> and speed.
            </h1>
            <p className="text-xl text-zinc-500 mb-12 leading-relaxed max-w-2xl">
              From individual projects to massive team workflows. TaskFlow empowers you to achieve more with intuitive tools and beautiful design.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-zinc-900 text-white font-bold text-lg shadow-xl shadow-zinc-200 hover:bg-zinc-800 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Launch Dashboard
                <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border border-zinc-200 font-bold text-lg hover:bg-zinc-50 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>

          {/* Floating UI Elements Mockup */}
          <div className="mt-24 relative animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            <div className="relative rounded-3xl border border-zinc-100 shadow-2xl shadow-zinc-200 bg-white p-4 group">
              <div className="rounded-2xl bg-zinc-50 aspect-[16/9] flex items-center justify-center overflow-hidden">
                 <div className="space-y-4 w-1/2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-8 bg-white rounded-lg border border-zinc-100 flex items-center px-4 gap-3 animate-in slide-in-from-left duration-500 delay-${i*100}`}>
                        <div className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-green-400' : i === 2 ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
                        <div className="h-2 bg-zinc-100 rounded w-full"></div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white border border-zinc-100 shadow-xl rounded-3xl p-6 hidden lg:block animate-bounce-slow">
                 <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Completion</div>
                 <div className="text-3xl font-bold mb-4">92%</div>
                 <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-[92%]"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need to thrive</h2>
            <p className="text-zinc-500">Powerful features tailored for modern teams and ambitious individuals.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Role-Based Access", desc: "Granular permissions for Admins, Managers, and Team members." },
              { icon: Zap, title: "Extreme Speed", desc: "Optimized for performance with near-instant updates and responses." },
              { icon: CheckCircle, title: "Seamless Tracking", desc: "Visualize progress with intuitive status boards and lists." }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-3xl bg-white border border-zinc-100 hover:shadow-xl hover:shadow-zinc-200 hover:-translate-y-2 transition-all duration-500 group">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center gap-2 justify-center mb-8">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold">TaskFlow</span>
            </div>
            <p className="text-zinc-400 text-sm italic">&copy; {new Date().getFullYear()} TaskFlow. Engineered for excellence.</p>
        </div>
      </footer>
    </div>
  );
}


