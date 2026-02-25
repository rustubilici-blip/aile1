"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="tr">
            <body className={`${inter.className} bg-[#0f172a] text-white antialiased`}>
                <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Kritik Bir Hata Oluştu</h2>
                    <p className="mb-8 text-slate-400">
                        Sistem temelinde bir sorun meydana geldi. Lütfen uygulamayı yeniden başlatmayı deneyin.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                    >
                        Sistemi Yenile
                    </button>

                    {error.message && (
                        <div className="mt-8 rounded-lg bg-red-500/10 p-4 border border-red-500/20 max-w-lg overflow-auto">
                            <p className="font-mono text-sm text-red-400">Hata Mesajı: {error.message}</p>
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
