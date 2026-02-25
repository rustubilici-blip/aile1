import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";
import Link from "next/link";
import {
    User,
    Music,
    Video,
    FileText,
    ArrowLeft,
    Calendar,
    MapPin,
    Briefcase,
    PlayCircle,
    Image as ImageIcon
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function ElderDetailPage({ params }: { params: { id: string } }) {
    const person = await prisma.person.findUnique({
        where: { id: params.id },
        include: {
            documents: true,
            father: true,
            mother: true,
        }
    });

    if (!person || !person.isElder) {
        notFound();
    }

    const images = person.documents.filter(d => d.type === "IMAGE");
    const videos = person.documents.filter(d => d.type === "VIDEO");
    const audio = person.documents.filter(d => d.type === "AUDIO");

    return (
        <div className="flex min-h-screen bg-[#0f172a]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto space-y-12">
                    {/* Header/Back Button */}
                    <Link
                        href="/elders"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Geri Dön
                    </Link>

                    {/* Profile Section */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative h-48 w-48 md:h-64 md:w-64 flex-shrink-0 overflow-hidden rounded-3xl bg-slate-800 ring-4 ring-slate-800/50">
                            {images.length > 0 ? (
                                <Image
                                    src={images[0].fileUrl}
                                    alt={`${person.firstName} ${person.lastName}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-600 bg-slate-900/50">
                                    <User className="h-24 w-24 opacity-20" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    {person.firstName} {person.lastName}
                                </h1>
                                <p className="text-xl text-blue-500 font-medium mt-2">Aile Büyüğümüz</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span>
                                        {person.birthDate ? new Date(person.birthDate).toLocaleDateString("tr-TR") : "???"}
                                        {" — "}
                                        {person.deathDate ? new Date(person.deathDate).toLocaleDateString("tr-TR") : "Günümüz"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    <span>{person.birthplace || "Belirtilmemiş"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
                                    <Briefcase className="h-5 w-5 text-blue-500" />
                                    <span>{person.occupation || "Belirtilmemiş"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Biography Section */}
                    {person.biography && (
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FileText className="h-6 w-6 text-blue-500" />
                                Yaşam Öyküsü
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-300 leading-relaxed italic text-lg shadow-inner">
                                    "{person.biography}"
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Media Gallery */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold text-white">Anılar & Medya</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Photos */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" /> Fotoğraflar
                                </h3>
                                {images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {images.map((img) => (
                                            <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-slate-800">
                                                <Image src={img.fileUrl} alt="Anı" fill className="object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <PlayCircle className="h-8 w-8 text-white opacity-80" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-600 italic">Henüz fotoğraf eklenmemiş.</p>
                                )}
                            </div>

                            {/* Audio & Video */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
                                        <Music className="h-5 w-5" /> Ses Kayıtları
                                    </h3>
                                    {audio.length > 0 ? (
                                        <div className="space-y-3">
                                            {audio.map((track) => (
                                                <div key={track.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                                                        <Music className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <audio src={track.fileUrl} controls className="w-full h-8" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600 italic">Henüz ses kaydı eklenmemiş.</p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
                                        <Video className="h-5 w-5" /> Videolar
                                    </h3>
                                    {videos.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {videos.map((vid) => (
                                                <div key={vid.id} className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black">
                                                    <video src={vid.fileUrl} controls className="w-full h-full" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-600 italic">Henüz video eklenmemiş.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
