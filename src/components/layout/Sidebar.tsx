"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    History,
    Users,
    Network,
    Settings,
    LayoutDashboard,
    LogOut,
    Shield,
    MessageSquare,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

import { useSession } from "next-auth/react";

const navigation = [
    { name: "Kontrol Paneli", href: "/dashboard", icon: LayoutDashboard },
    { name: "Soy Ağacı", href: "/tree", icon: Network },
    { name: "Kişiler", href: "/people", icon: Users },
    { name: "Aile Büyükleri", href: "/elders", icon: Shield }, // Using Shield for Elders
    { name: "Aile Sohbeti", href: "/chat", icon: MessageSquare },
    { name: "Etkinlikler", href: "/events", icon: History },
    { name: "Ayarlar", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    const adminNavigation = isAdmin ? [
        { name: "Kullanıcı Yönetimi", href: "/admin/users", icon: Shield },
        { name: "Giriş Geçmişi", href: "/admin/login-history", icon: History },
    ] : [];

    const allNavigation = [...navigation, ...adminNavigation];

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-64 border-r border-[#1e293b] bg-[#0f172a] transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col px-3 py-4">
                    <div className="mb-10 flex items-center justify-between px-2">
                        <div className="flex items-center">
                            <Network className="mr-3 h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold tracking-tight text-white">Hafızaga</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {allNavigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => onClose?.()}
                                    className={cn(
                                        "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-500"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                            isActive ? "text-blue-500" : "text-slate-400 group-hover:text-white"
                                        )}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-[#1e293b] pt-4">
                        <button
                            onClick={() => signOut()}
                            className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
