import { History, Calendar } from "lucide-react";

export default function EventsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <History className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Aile Etkinlikleri</h1>
            <p className="text-slate-400 max-w-md">
                Doğum günleri, anma törenleri ve diğer önemli aile olayları yakında burada listelenecek.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 w-full max-w-lg">
                <div className="flex items-center gap-4 rounded-xl border border-[#1e293b] bg-[#1e293b]/30 p-4 text-left">
                    <Calendar className="h-6 w-6 text-blue-500" />
                    <div>
                        <p className="text-sm font-medium text-white">Etkinlik Takvimi</p>
                        <p className="text-xs text-slate-500">Yaklaşan tüm olayları takip edin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
