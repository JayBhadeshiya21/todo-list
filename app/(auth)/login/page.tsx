"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof schema>;


export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: LoginForm) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Login failed");
      return;
    }

    toast.success("Login successful");
  
    if (data.user.Role === 'Admin') {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[150px] opacity-60 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="w-full max-w-md px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
                    <CheckCircle className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
            </Link>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Welcome back</h1>
            <p className="text-zinc-500 mt-3 font-medium">Log in to your dashboard to continue</p>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-2xl shadow-zinc-200/50 p-10 relative group overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-transparent pointer-events-none"></div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
            
            {/* Email */}
            <div className="space-y-2 group/field">
                <label className="text-sm font-bold text-zinc-700 ml-1">Email Address</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="name@example.com"
                        className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                    />
                </div>
                {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                    <span className="w-1 h-1 bg-red-500 rounded-full block"></span>
                    {errors.email.message}
                </p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-2 group/field">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-bold text-zinc-700">Password</label>
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="••••••••"
                        className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                    />
                </div>
                {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                     <span className="w-1 h-1 bg-red-500 rounded-full block"></span>
                    {errors.password.message}
                </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex items-center justify-center bg-zinc-900 text-white rounded-2xl py-4 text-sm font-bold overflow-hidden shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-zinc-500 text-sm font-medium">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>

        <div className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
          &copy; {new Date().getFullYear()} TaskFlow Excellence System
        </div>
      </div>
    </div>
  );
}
