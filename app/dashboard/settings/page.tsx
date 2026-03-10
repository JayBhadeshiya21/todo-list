"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and system configuration.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details and how others see you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <input className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" placeholder="Username" disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input className="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" placeholder="Email" disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-zinc-500">Switch between light and dark themes.</p>
                    </div>
                    <Button variant="outline">Toggle Theme</Button>
                </CardContent>
            </Card>
        </div>
    );
}
