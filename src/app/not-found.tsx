import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] p-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800 text-slate-400 shadow-lg">
                <Search className="h-10 w-10" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">Sayfa Bulunamadı</h2>
            <p className="mb-8 max-w-md text-slate-400">
                Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>

            <Link
                href="/"
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
            >
                Ana Sayfaya Dön
            </Link>
        </div>
    );
}
