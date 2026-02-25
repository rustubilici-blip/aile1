"use client";

import Chat from "@/components/chat/Chat";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-5xl mx-auto w-full min-h-0">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold text-white">Aile Sohbeti</h1>
                        <p className="text-slate-400 text-sm">Tüm aile üyeleriyle anlık iletişim kurun.</p>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Chat />
                    </div>
                </div>
            </main>
        </div>
    );
}
