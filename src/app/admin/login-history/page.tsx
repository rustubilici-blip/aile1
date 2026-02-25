import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { History, User as UserIcon, Calendar, Clock } from "lucide-react";

export default async function LoginHistoryPage() {
    const history = await prisma.loginHistory.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
    });

    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Giriş Geçmişi</h1>
                        <p className="text-slate-400 mt-2">Sisteme en son giriş yapan kullanıcıların listesi.</p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-800 bg-slate-900/80">
                                <tr className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    <th className="px-6 py-4">Kullanıcı</th>
                                    <th className="px-6 py-4">Tarih</th>
                                    <th className="px-6 py-4">Saat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                            Henüz kayıtlı bir giriş bulunmuyor.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((log) => (
                                        <tr key={log.id} className="group transition-colors hover:bg-slate-800/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{log.user.name || "İsimsiz"}</p>
                                                        <p className="text-xs text-slate-500">{log.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-slate-500" />
                                                    {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-500" />
                                                    {new Date(log.createdAt).toLocaleTimeString("tr-TR")}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
