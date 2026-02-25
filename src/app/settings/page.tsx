import { Settings as SettingsIcon, Shield, Bell, AppWindow } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
                <p className="text-slate-400">Sistem tercihlerini ve hesabınızı buradan yönetebilirsiniz.</p>
            </div>

            <div className="grid gap-6">
                <div className="rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 p-6 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        Güvenlik
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50">
                            <div>
                                <p className="text-sm font-medium text-white">Şifre Değiştir</p>
                                <p className="text-xs text-slate-500">Hesap güvenliğiniz için şifrenizi güncel tutun.</p>
                            </div>
                            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">Güncelle</button>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 p-6 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-emerald-500" />
                        Bildirimler
                    </h2>
                    <p className="text-sm text-slate-500">Bildirim ayarları yakında kullanıma sunulacak.</p>
                </div>
            </div>
        </div>
    );
}
