import Image from "next/image";
import Link from "next/link";
import { Network } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] font-sans text-slate-200">
      <main className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/20">
          <Network className="h-12 w-12 text-white" />
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Hafızaga Aile Mirası
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
          Ailenizin köklerini keşfedin, geçmişi geleceğe taşıyın. Profesyonel soy ağacı yönetim sistemi ile tüm aile bağlarınızı güvenle saklayın.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            Sisteme Giriş Yap
          </Link>
          <Link
            href="/tree"
            className="flex h-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-8 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-600 active:scale-95"
          >
            Soy Ağacını Görüntüle
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="mb-3 text-blue-500 font-bold text-2xl">30+</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Aktif Üye</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 text-emerald-500 font-bold text-2xl">Güvenli</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Veri Depolama</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 text-amber-500 font-bold text-2xl">Kolay</div>
            <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Yönetim</div>
          </div>
        </div>
      </main>
    </div>
  );
}
