import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { User, Music, Video, FileText } from "lucide-react";

export default async function EldersPage() {
    const elders = await prisma.person.findMany({
        where: {
            isElder: true,
        },
        include: {
            documents: true,
        },
        orderBy: [
            { lastName: "asc" },
            { firstName: "asc" },
        ],
    });

    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Aile Büyükleri</h1>
                        <p className="text-slate-400 mt-2">Ailemizin koca çınarları, yol gösterenlerimiz.</p>
                    </div>

                    {elders.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-slate-500">
                            <User className="mb-4 h-12 w-12 opacity-20" />
                            <p>Henüz "Aile Büyüğü" olarak işaretlenmiş kimse yok.</p>
                            <p className="text-sm">Yönetici panelinden kişileri "Aile Büyüğü" olarak işaretleyebilirsiniz.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {elders.map((elder) => (
                                <div key={elder.id} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800/80 hover:shadow-xl hover:shadow-blue-500/5">
                                    <div className="flex items-start gap-4">
                                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-800 ring-2 ring-slate-700/50">
                                            {elder.documents.find(d => d.type === "IMAGE") ? (
                                                <Image
                                                    src={elder.documents.find(d => d.type === "IMAGE")!.fileUrl}
                                                    alt={`${elder.firstName} ${elder.lastName}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                    <User className="h-10 w-10" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {elder.firstName} {elder.lastName}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {elder.birthDate ? new Date(elder.birthDate).getFullYear() : "???"} - {elder.deathDate ? new Date(elder.deathDate).getFullYear() : "Günümüz"}
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                {elder.documents.some(d => d.type === "AUDIO") && (
                                                    <span title="Ses Kaydı Mevcut" className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                                        <Music className="h-4 w-4" />
                                                    </span>
                                                )}
                                                {elder.documents.some(d => d.type === "VIDEO") && (
                                                    <span title="Video Mevcut" className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                                                        <Video className="h-4 w-4" />
                                                    </span>
                                                )}
                                                {elder.biography && (
                                                    <span title="Biyografi Mevcut" className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                                        <FileText className="h-4 w-4" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {elder.biography && (
                                        <div className="mt-6">
                                            <p className="text-sm leading-relaxed text-slate-400 line-clamp-3 italic">
                                                "{elder.biography}"
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 flex justify-end">
                                        <Link
                                            href={`/elders/${elder.id}`}
                                            className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                                        >
                                            Detaylara Git →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
