export default function DashboardPage() {
    const stats = [
        { name: "Toplam Üye", value: "32", trend: "+2", label: "Bu ay" },
        { name: "Aileler", value: "8", trend: "0", label: "Sabit" },
        { name: "Yaklaşan Etkinlikler", value: "3", trend: "+1", label: "Bu hafta" },
        { name: "Dökümanlar", value: "124", trend: "+12", label: "Yeni eklenen" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400">Hoş geldiniz, ailenizin mirasını buradan yönetebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="rounded-xl border border-[#1e293b] bg-[#1e293b]/30 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50"
                    >
                        <p className="text-sm font-medium text-slate-400">{item.name}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{item.value}</span>
                            <span className="text-xs font-medium text-emerald-500">{item.trend}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-[#1e293b] bg-[#1e293b]/30 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Son Aktiviteler</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 text-sm">
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                                    AÖ
                                </div>
                                <div>
                                    <p className="text-white font-medium">Ahmet Öztürk eklendi</p>
                                    <p className="text-slate-500 text-xs">2 saat önce</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[#1e293b] bg-[#1e293b]/30 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Hızlı Erişim</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center rounded-lg border border-[#1e293b] py-4 hover:bg-slate-800 transition-colors">
                            <span className="text-blue-500 text-lg mb-1">+</span>
                            <span className="text-xs text-slate-400">Yeni Kişi</span>
                        </button>
                        <button className="flex flex-col items-center justify-center rounded-lg border border-[#1e293b] py-4 hover:bg-slate-800 transition-colors">
                            <span className="text-emerald-500 text-lg mb-1">↑</span>
                            <span className="text-xs text-slate-400">Döküman Yükle</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
