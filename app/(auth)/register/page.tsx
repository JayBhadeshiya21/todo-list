"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created successfully. Please sign in.");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[150px] opacity-60 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="w-full max-w-xl px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
        <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-6 transition-transform">
                    <CheckCircle className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
            </Link>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">Create your account</h1>
            <p className="text-zinc-500 mt-3 font-medium">Join thousands of users managing tasks effortlessly</p>
        </div>

        <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-2xl shadow-zinc-200/50 p-10 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 to-transparent pointer-events-none"></div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative">
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-2 group/field">
                      <FormLabel className="text-sm font-bold text-zinc-700 ml-1">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                {...field}
                                placeholder="johndoe"
                                className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2 group/field">
                      <FormLabel className="text-sm font-bold text-zinc-700 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                {...field}
                                placeholder="name@example.com"
                                className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2 group/field">
                      <FormLabel className="text-sm font-bold text-zinc-700 ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                {...field}
                                placeholder="••••••••"
                                className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2 group/field">
                      <FormLabel className="text-sm font-bold text-zinc-700 ml-1">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within/field:text-blue-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                {...field}
                                placeholder="••••••••"
                                className="w-full bg-white/60 border border-zinc-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-zinc-400 hover:border-zinc-300"
                            />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="group relative w-full flex items-center justify-center bg-zinc-900 text-white rounded-2xl py-4 text-sm font-bold overflow-hidden shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none mt-4"
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  {form.formState.isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                      <span className="flex items-center gap-2">
                          Create Account
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                  )}
              </button>
              </form>
            </Form>

            <div className="mt-8 text-center border-t border-zinc-100 pt-8">
                <p className="text-zinc-500 text-sm font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 font-bold hover:underline underline-offset-4 decoration-2">
                        Sign In
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
