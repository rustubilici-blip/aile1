"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Loader2, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
    user: {
        name: string | null;
        email: string;
    };
}

export default function Chat() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (isInitial = false) => {
        try {
            const res = await fetch("/api/chat");
            const data = await res.json();
            if (res.ok) {
                setMessages(data);
                if (isInitial) {
                    scrollToBottom();
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        fetchMessages(true);
        const interval = setInterval(() => fetchMessages(), 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (res.ok) {
                const message = await res.json();
                setMessages((prev) => [...prev, message]);
                setNewMessage("");
                scrollToBottom();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-500">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Aile Sohbeti</h2>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Grup Mesajlaşma</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-medium text-slate-400">Canlı</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-slate-500">
                        <MessageSquare className="mb-2 h-12 w-12 opacity-20" />
                        <p>Henüz mesaj yok. İlk mesajı siz yazın!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = (session?.user as any)?.id === msg.userId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                            >
                                <div className={`flex max-w-[80%] items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white ${isOwn ? "bg-blue-600" : "bg-slate-700"}`}>
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? "justify-end" : ""}`}>
                                            <span className="text-xs font-bold text-slate-300">
                                                {msg.user.name || "İsimsiz"}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(msg.createdAt).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${isOwn
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-slate-800 bg-slate-900/80 p-6">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı buraya yazın..."
                        className="w-full rounded-2xl border-none bg-slate-950/50 py-4 pl-6 pr-14 text-white placeholder-slate-600 shadow-inner ring-1 ring-slate-800 transition-all focus:bg-slate-950 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                    >
                        {sending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                    Hafızaga Aile İletişim Hattı - {new Date().getFullYear()}
                </p>
            </form>
        </div>
    );
}
