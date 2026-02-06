import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, X, ChevronDown, Save, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from "@/config/api";
const PackageUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data Awal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packageRes, destinationsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/packages/${id}`),
                    fetch(`${API_BASE_URL}/api/admin/destinations`),
                ]);

                const packageData = await packageRes.json();
                const destinationsData = await destinationsRes.json();

                // Pastikan format facilities adalah array string sederhana
                const sanitizedFacilities = packageData.facilities?.map(f =>
                    typeof f === 'string' ? f : (f.facility || f.name || "")
                ) || [];

                setFormData({
                    ...packageData,
                    facilities: sanitizedFacilities,
                    // Pastikan destinationId tersimpan sebagai nilai tunggal, bukan objek
                    destinationId: packageData.destinationId || packageData.destination?.id || ""
                });
                setDestinations(destinationsData);
            } catch (error) {
                console.error("Gagal memuat data:", error);
                alert("Gagal mengambil data dari server");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // 2. Fungsi Update (Submit Form)
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // 1. Pastikan pengambilan ID dari form benar
            // Jika formData.destinationId kosong, coba ambil dari objek relasi bawaan
            const dId = formData.destinationId || (formData.destination && formData.destination.id);

            const payload = {
                title: formData.title,
                description: formData.description,
                durationDays: parseInt(formData.durationDays),
                price: parseFloat(formData.price),
                quota: parseInt(formData.quota),
                status: formData.status,
                // 2. Gunakan "I" kapital sesuai struktur yang Anda konfirmasi
                destinationId: parseInt(dId)
            };

            // Log ini untuk memastikan tidak ada nilai NaN yang terkirim
            console.log("Kirim ke server:", payload);



            const response = await fetch(
                `${API_BASE_URL}/api/admin/packages/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );


            const result = await response.json();

            if (!response.ok) {
                // Jika error 400, pesan dari backend akan muncul di sini
                throw new Error(result.message || "Gagal update data");
            }

            alert("Berhasil diperbarui!");
            navigate('/admin/packages');
        } catch (error) {
            console.error("Detail Error:", error);
            alert("Kesalahan: " + error.message);
        }
    };
    // 3. Helper Functions untuk Fasilitas
    const addFacility = () => {
        setFormData({ ...formData, facilities: [...(formData.facilities || []), ''] });
    };

    const removeFacility = (index) => {
        const newFacilities = formData.facilities.filter((_, i) => i !== index);
        setFormData({ ...formData, facilities: newFacilities });
    };

    const updateFacility = (index, value) => {
        const newFacilities = [...formData.facilities];
        newFacilities[index] = value;
        setFormData({ ...formData, facilities: newFacilities });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Memuat data paket...</p>
                </div>
            </div>
        );
    }

    if (!formData) return <div className="p-10 text-center text-red-500">Data tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/packages')}
                        className="text-slate-600 hover:text-indigo-600 mb-4 flex items-center gap-2 transition-all font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Daftar
                    </button>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit Paket Wisata</h1>
                    <p className="text-slate-500 mt-2">ID Paket: #{id}</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                            Informasi Utama
                        </h2>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Paket Wisata</label>
                                <input
                                    type="text"
                                    value={formData.title || ""}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Destinasi</label>
                                    <div className="relative">
                                        <select
                                            value={formData.destinationId || ""}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white outline-none transition-all"
                                            onChange={e => setFormData({ ...formData, destinationId: e.target.value })}
                                            required
                                        >
                                            <option value="">Pilih Lokasi</option>
                                            {destinations.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Durasi (Hari)</label>
                                    <input
                                        type="number"
                                        value={formData.durationDays || ""}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Harga (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.price || ""}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kuota Maksimal</label>
                                    <input
                                        type="number"
                                        value={formData.quota || ""}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                        onChange={e => setFormData({ ...formData, quota: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Status Paket</label>
                                <div className="relative">
                                    <select
                                        value={formData.status || "ACTIVE"}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none bg-white outline-none"
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">Aktif (Tampil)</option>
                                        <option value="INACTIVE">Non-Aktif (Sembunyi)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    value={formData.description || ""}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Fasilitas Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                                Fasilitas Paket
                            </h2>
                            <button
                                type="button"
                                onClick={addFacility}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-bold text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {formData.facilities?.map((facility, index) => (
                                <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-top-1">
                                    <input
                                        type="text"
                                        value={facility}
                                        placeholder="Contoh: Hotel Bintang 5"
                                        onChange={e => updateFacility(index, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFacility(index)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/packages')}
                            className="px-8 py-3 text-slate-600 font-bold hover:text-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            <Save className="w-5 h-5" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackageUpdate;