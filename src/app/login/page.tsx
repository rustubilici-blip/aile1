"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Network, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("E-posta veya şifre hatalı");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 p-8 backdrop-blur-xl">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                        <Network className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Hafızaga Giriş</h2>
                    <p className="mt-2 text-sm text-slate-400">Aile mirasınızı keşfetmeye devam edin</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border-none bg-slate-800/50 py-3 pl-10 pr-3 text-white placeholder-slate-500 transition-all focus:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                                placeholder="E-posta adresi"
                            />
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border-none bg-slate-800/50 py-3 pl-10 pr-3 text-white placeholder-slate-500 transition-all focus:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                                placeholder="Şifre"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Giriş Yap"}
                    </button>

                    <p className="text-center text-xs text-slate-500">
                        Hesabınız yok mu? Kayıt işlemleri için lütfen sistem yöneticisi ile iletişime geçin.
                    </p>
                </form>
            </div>
        </div>
    );
}
