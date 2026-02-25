"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] p-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 shadow-lg shadow-red-500/5">
                <AlertTriangle className="h-10 w-10" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">Bir Şeyler Yanlış Gitti</h2>
            <p className="mb-8 max-w-md text-slate-400">
                Uygulama yüklenirken beklenmedik bir hata oluştu. Lütfen tekrar denemeyi veya sayfayı yenilemeyi deneyin.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Tekrar Dene
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-800"
                >
                    Sayfayı Yenile
                </button>
            </div>

            {error.message && (
                <div className="mt-8 rounded-lg bg-red-500/5 p-3 text-left">
                    <p className="font-mono text-xs text-red-400">Hata Detayı: {error.message}</p>
                </div>
            )}
        </div>
    );
}
