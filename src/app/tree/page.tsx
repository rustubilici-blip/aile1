import { TreeCanvas } from "@/components/tree/TreeCanvas";

export default function TreePage() {
    return (
        <div className="flex h-[calc(100vh-160px)] flex-col overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0f172a]/50">
            <div className="flex items-center justify-between border-b border-[#1e293b] px-6 py-4 bg-[#1e293b]/30">
                <div>
                    <h1 className="text-xl font-bold text-white">Aile Ağacı</h1>
                    <p className="text-xs text-slate-400">Gezinmek için sürükleyin, yakınlaştırmak için kaydırın.</p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Yeni Bağlantı Ekle
                    </button>
                    <button className="rounded-lg border border-[#1e293b] px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                        Dışa Aktar
                    </button>
                </div>
            </div>

            <div className="relative flex-1 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                <TreeCanvas />

                {/* Kontrol Butonları */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1e293b] bg-slate-900 text-white hover:bg-slate-800">+</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1e293b] bg-slate-900 text-white hover:bg-slate-800">-</button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1e293b] bg-slate-900 text-white hover:bg-slate-800">⦿</button>
                </div>
            </div>
        </div>
    );
}
