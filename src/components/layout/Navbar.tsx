"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User, Menu } from "lucide-react";

interface NavbarProps {
    onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1e293b] bg-[#0f172a]/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4 lg:hidden">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="flex w-full max-w-xl items-center">
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-full border-none bg-slate-800/50 py-2 pl-10 pr-3 text-sm text-white placeholder-slate-400 transition-all focus:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                        placeholder="Aile üyelerinde ara..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                </button>

                <div className="hidden items-center gap-3 border-l border-[#1e293b] pl-4 sm:flex">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-white">{session?.user?.name || "Kullanıcı"}</span>
                        <span className="text-xs text-slate-400 capitalize">
                            {session?.user?.role === "ADMIN" ? "Yönetici" : "Ziyaretçi"}
                        </span>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-500 border border-blue-500/30">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
