"use client";

import { useEffect, useState } from "react";
import { UserPlus, Mail, Loader2, Trash2, User, Ban, CheckCircle, Search } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("VIEWER");

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (res.ok) {
                setUsers(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Kullanıcı oluşturulamadı");
            } else {
                setSuccess("Kullanıcı başarıyla oluşturuldu");
                setEmail("");
                setPassword("");
                setName("");
                setRole("VIEWER");
                fetchUsers();
            }
        } catch (err) {
            setError("Bir hata oluştu");
        } finally {
            setCreating(false);
        }
    };

    const handleToggleBan = async (user: any) => {
        setActionId(user.id);
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, isBanned: !user.isBanned }),
            });

            if (res.ok) {
                setSuccess(user.isBanned ? "Kullanıcının engeli kaldırıldı" : "Kullanıcı engellendi");
                fetchUsers();
            } else {
                const data = await res.json();
                setError(data.error || "İşlem başarısız");
            }
        } catch (err) {
            setError("İşlem sırasında hata oluştu");
        } finally {
            setActionId(null);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;

        setActionId(id);
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSuccess("Kullanıcı silindi");
                fetchUsers();
            } else {
                const data = await res.json();
                setError(data.error || "Silme işlemi başarısız");
            }
        } catch (err) {
            setError("İşlem sırasında hata oluştu");
        } finally {
            setActionId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
                    <p className="text-slate-400">Diğer aile üyeleri için hesap oluşturun ve yetkilerini yönetin.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create User Form */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 p-6 backdrop-blur-sm sticky top-24">
                        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                            Yeni Kayıt Oluştur
                        </h2>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500 border border-emerald-500/20">
                                    {success}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">İsim Soyisim</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border-none bg-slate-900/50 py-2.5 px-4 text-white placeholder-slate-600 transition-all focus:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Örn: Ali Yılmaz"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">E-posta</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border-none bg-slate-900/50 py-2.5 px-4 text-white placeholder-slate-600 transition-all focus:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                    placeholder="ornek@mail.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Şifre</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border-none bg-slate-900/50 py-2.5 px-4 text-white placeholder-slate-600 transition-all focus:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Yetki Seviyesi</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-xl border-none bg-slate-900/50 py-2.5 px-4 text-white transition-all focus:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="VIEWER">Ziyaretçi (Sadece Görüntüleme)</option>
                                    <option value="EDITOR">Editör (Ekleme/Düzenleme)</option>
                                    <option value="ADMIN">Yönetici (Tam Yetki)</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                            >
                                {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kullanıcıyı Kaydet"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 backdrop-blur-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#1e293b] bg-slate-900/20 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <th className="px-6 py-4">Kullanıcı</th>
                                    <th className="px-6 py-4">Yetki</th>
                                    <th className="px-6 py-4">Kayıt Tarihi</th>
                                    <th className="px-6 py-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e293b]">
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-slate-800"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-slate-800"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-slate-800"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.map((user) => (
                                    <tr key={user.id} className={`text-sm transition-colors hover:bg-slate-800/20 ${user.isBanned ? "opacity-50" : ""}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${user.isBanned ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">
                                                        {user.name || "İsimsiz"}
                                                        {user.isBanned && <span className="ml-2 text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded uppercase">Engelli</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === "ADMIN" ? "bg-red-500/10 text-red-500" :
                                                user.role === "EDITOR" ? "bg-blue-500/10 text-blue-500" :
                                                    "bg-slate-500/10 text-slate-400"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleBan(user)}
                                                    disabled={actionId === user.id}
                                                    title={user.isBanned ? "Engeli Kaldır" : "Engelle"}
                                                    className={`p-2 transition-colors rounded-lg ${user.isBanned ? "text-emerald-500 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10"}`}
                                                >
                                                    {actionId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : user.isBanned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={actionId === user.id}
                                                    title="Kullanıcıyı Sil"
                                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                                                >
                                                    {actionId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
