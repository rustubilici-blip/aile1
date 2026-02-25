"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical, X, Loader2, User, Heart, Trash2, Upload, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PeoplePage() {
    const [people, setPeople] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "MALE",
        birthDate: "",
        deathDate: "",
        birthplace: "",
        occupation: "",
        biography: "",
        phone: "",
        imageUrl: "",
        fatherId: "",
        motherId: "",
        isElder: false
    });

    const fetchPeople = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/people");
            const data = await res.json();
            setPeople(Array.isArray(data) ? data : []);
            setSelectedIds([]); // Clear selection on fetch
        } catch (error) {
            console.error("Error fetching people:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const handleOpenModal = (person: any = null) => {
        if (person) {
            setEditingPerson(person);
            setFormData({
                firstName: person.firstName || "",
                lastName: person.lastName || "",
                gender: person.gender || "MALE",
                birthDate: person.birthDate ? new Date(person.birthDate).toISOString().split('T')[0] : "",
                deathDate: person.deathDate ? new Date(person.deathDate).toISOString().split('T')[0] : "",
                birthplace: person.birthplace || "",
                occupation: person.occupation || "",
                biography: person.biography || "",
                phone: person.phone || "",
                imageUrl: person.imageUrl || "",
                fatherId: person.fatherId || "",
                motherId: person.motherId || "",
                isElder: person.isElder || false
            });
        } else {
            setEditingPerson(null);
            setFormData({
                firstName: "",
                lastName: "",
                gender: "MALE",
                birthDate: "",
                deathDate: "",
                birthplace: "",
                occupation: "",
                biography: "",
                phone: "",
                imageUrl: "",
                fatherId: "",
                motherId: "",
                isElder: false
            });
        }
        setIsModalOpen(true);
    };

    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Resim yüklenemedi");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingPerson ? `/api/people/${editingPerson.id}` : "/api/people";
            const method = editingPerson ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchPeople();
            } else {
                const data = await res.json();
                if (res.status === 409 || data.error === "DUPLICATE_MEMBER") {
                    alert(data.message || "Bu bilgilere sahip bir aile üyesi zaten kayıtlı.");
                } else {
                    alert("İşlem sırasında bir hata oluştu.");
                }
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    const filteredPeople = people.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.birthplace?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`${selectedIds.length} kişiyi silmek istediğinizden emin misiniz?`)) return;

        try {
            const res = await fetch("/api/people", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (res.ok) {
                fetchPeople();
            } else {
                alert("Toplu silme işlemi başarısız.");
            }
        } catch (error) {
            alert("Bir hata oluştu.");
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPeople.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPeople.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu kişiyi silmek istediğinizden emin misiniz?")) return;
        try {
            const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchPeople();
            }
        } catch (error) {
            alert("Silme işlemi başarısız.");
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Aile Üyeleri</h1>
                    <p className="text-slate-400">Tüm aile bireylerini buradan yönetebilirsiniz.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Yeni Kişi Ekle
                </button>
            </div>

            <div className="rounded-2xl border border-[#1e293b] bg-[#1e293b]/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Üyelerde ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border-none bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-500/20 active:scale-95 border border-red-500/20"
                        >
                            <Trash2 className="h-4 w-4" />
                            Seçilenleri Sil ({selectedIds.length})
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#1e293b] text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length > 0 && selectedIds.length === filteredPeople.length}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-4">Ad Soyad</th>
                                <th className="px-6 py-4">Cinsiyet</th>
                                <th className="px-6 py-4">Doğum Yeri</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {loading && people.length === 0 ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-4 rounded bg-slate-800"></div></td>
                                        <td colSpan={5} className="px-6 py-4"><div className="h-4 w-full rounded bg-slate-800"></div></td>
                                    </tr>
                                ))
                            ) : filteredPeople.length > 0 ? (
                                filteredPeople.map((person) => (
                                    <tr key={person.id} className={`text-sm transition-colors hover:bg-slate-800/30 ${selectedIds.includes(person.id) ? 'bg-blue-500/5' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(person.id)}
                                                onChange={() => toggleSelect(person.id)}
                                                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {person.imageUrl ? (
                                                    <img src={person.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover border-2 border-slate-700" />
                                                ) : (
                                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2", person.gender === "MALE" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-pink-500/10 border-pink-500/20 text-pink-500")}>
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-white">{person.firstName} {person.lastName}</div>
                                                    <div className="text-xs text-slate-500">{person.phone || "No phone"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", person.gender === "MALE" ? "bg-blue-500/10 text-blue-500" : "bg-pink-500/10 text-pink-500")}>
                                                {person.gender === "MALE" ? "Erkek" : "Kadın"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{person.birthplace || "-"}</td>
                                        <td className="px-6 py-4">
                                            {person.isElder && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                                                    <Heart className="h-3 w-3" /> Aile Büyüğü
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(person)}
                                                    className="p-2 text-slate-500 hover:text-white transition-colors"
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(person.id)}
                                                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Sonuç bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                {editingPerson ? "Kişiyi Düzenle" : "Yeni Kişi Ekle"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Profile Image Upload Section */}
                                <div className="flex flex-col items-center gap-4 py-4 border-b border-slate-800/50 mb-6">
                                    <div className="relative group">
                                        <div className={cn(
                                            "h-24 w-24 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 flex items-center justify-center transition-all group-hover:border-blue-500/50",
                                            !formData.imageUrl && (formData.gender === "MALE" ? "text-blue-500" : "text-pink-500")
                                        )}>
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-12 w-12" />
                                            )}
                                        </div>
                                        <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                                            <Camera className="h-4 w-4 text-white" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white">Profil Fotoğrafı</p>
                                        <p className="text-xs text-slate-500 mt-1">Görsel seçmek için butona tıklayın</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Ad</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Soyad</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Telefon Numarası</label>
                                        <input
                                            type="tel"
                                            placeholder="05..."
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Cinsiyet</label>
                                        <select
                                            value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        >
                                            <option value="MALE">Erkek</option>
                                            <option value="FEMALE">Kadın</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Babası</label>
                                        <select
                                            value={formData.fatherId || ""}
                                            onChange={e => setFormData({ ...formData, fatherId: e.target.value || null as any })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        >
                                            <option value="">Seçilmedi</option>
                                            {people.filter(p => p.gender === "MALE" && p.id !== editingPerson?.id).map(p => (
                                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Annesi</label>
                                        <select
                                            value={formData.motherId || ""}
                                            onChange={e => setFormData({ ...formData, motherId: e.target.value || null as any })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        >
                                            <option value="">Seçilmedi</option>
                                            {people.filter(p => p.gender === "FEMALE" && p.id !== editingPerson?.id).map(p => (
                                                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Doğum Tarihi</label>
                                        <input
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Ölüm Tarihi</label>
                                        <input
                                            type="date"
                                            value={formData.deathDate}
                                            onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Doğum Yeri</label>
                                        <input
                                            type="text"
                                            value={formData.birthplace}
                                            onChange={e => setFormData({ ...formData, birthplace: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Meslek</label>
                                        <input
                                            type="text"
                                            value={formData.occupation}
                                            onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                            className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2.5 px-4 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl border border-blue-500/10 bg-blue-500/5">
                                    <div className="flex items-center gap-3">
                                        <input
                                            id="isElder"
                                            type="checkbox"
                                            checked={formData.isElder}
                                            onChange={e => setFormData({ ...formData, isElder: e.target.checked })}
                                            className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
                                        />
                                        <div>
                                            <label htmlFor="isElder" className="text-sm font-bold text-blue-400">Aile Büyüğü</label>
                                            <p className="text-xs text-slate-500 mt-0.5">Bu kişi aile büyüğü olarak işaretlensin.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Biyografi</label>
                                    <textarea
                                        value={formData.biography}
                                        onChange={e => setFormData({ ...formData, biography: e.target.value })}
                                        rows={4}
                                        placeholder="Kişinin hayatı hakkında kısa bilgi..."
                                        className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent py-3 px-4 transition-all"
                                    />
                                </div>

                                {editingPerson && (
                                    <div className="space-y-4 pt-4 border-t border-slate-800">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Medya ve Belgeler</h3>
                                        <div className="space-y-3">
                                            {editingPerson.documents?.map((doc: any) => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">{doc.type}</span>
                                                        <span className="text-xs text-slate-400 truncate max-w-[200px]">{doc.fileUrl}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            if (confirm("Silmek istediğinizden emin misiniz?")) {
                                                                const res = await fetch(`/api/documents?id=${doc.id}`, { method: "DELETE" });
                                                                if (res.ok) fetchPeople();
                                                            }
                                                        }}
                                                        className="text-slate-500 hover:text-red-500 p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                id="newDocUrl"
                                                placeholder="Dosya URL"
                                                className="rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-white p-2.5"
                                            />
                                            <div className="flex gap-2">
                                                <select id="newDocType" className="flex-1 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-white p-2.5">
                                                    <option value="IMAGE">Resim</option>
                                                    <option value="VIDEO">Video</option>
                                                    <option value="AUDIO">Ses</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const urlInput = document.getElementById("newDocUrl") as HTMLInputElement;
                                                        const typeInput = document.getElementById("newDocType") as HTMLSelectElement;
                                                        if (!urlInput.value) return;
                                                        const res = await fetch("/api/documents", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ personId: editingPerson.id, fileUrl: urlInput.value, type: typeInput.value })
                                                        });
                                                        if (res.ok) {
                                                            urlInput.value = "";
                                                            fetchPeople();
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition-colors"
                                                >
                                                    Ekle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="flex justify-end gap-3 p-5 border-t border-slate-800 shrink-0 bg-slate-900/50">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Değişiklikleri Kaydet"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
