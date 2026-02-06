import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from "@/config/api";
const PackageCreate = () => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        destinationId: '',
        price: '',
        quota: '',
        durationDays: '',
        description: '',
        facilities: [''],
        itineraries: [{ dayNumber: 1, title: '', description: '' }]
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/admin/destinations`)
            .then((res) => res.json())
            .then((data) => setDestinations(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/packages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                navigate("/admin/packages");
            }
        } catch (error) {
            console.error(error);
        }
    };


    const addFacility = () => {
        setFormData({ ...formData, facilities: [...formData.facilities, ''] });
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

    const addItinerary = () => {
        setFormData({
            ...formData,
            itineraries: [
                ...formData.itineraries,
                { dayNumber: formData.itineraries.length + 1, title: '', description: '' }
            ]
        });
    };

    const removeItinerary = (index) => {
        const newItineraries = formData.itineraries.filter((_, i) => i !== index);
        setFormData({ ...formData, itineraries: newItineraries });
    };

    const updateItinerary = (index, field, value) => {
        const newItineraries = [...formData.itineraries];
        newItineraries[index][field] = value;
        setFormData({ ...formData, itineraries: newItineraries });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/packages')}
                        className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900">Tambah Paket Wisata Baru</h1>
                    <p className="text-slate-600 mt-2">Lengkapi informasi paket wisata untuk pelanggan</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                            Informasi Dasar
                        </h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Judul Paket <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Contoh: Paket Honeymoon Bali 5D4N"
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Destinasi <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                                            onChange={e => setFormData({ ...formData, destinationId: e.target.value })}
                                            required
                                        >
                                            <option value="">Pilih Destinasi</option>
                                            {destinations.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Durasi (Hari) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="5"
                                        onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Harga (Rp) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="5000000"
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Kuota Peserta <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        placeholder="20"
                                        onChange={e => setFormData({ ...formData, quota: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Deskripsi Paket
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                                    rows="4"
                                    placeholder="Jelaskan keunggulan dan detail paket wisata..."
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Fasilitas */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
                                Fasilitas
                            </h2>
                            <button
                                type="button"
                                onClick={addFacility}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Fasilitas
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.facilities.map((facility, index) => (
                                <div key={index} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={facility}
                                        onChange={e => updateFacility(index, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Contoh: Hotel Bintang 5, Sarapan, Tour Guide"
                                    />
                                    {formData.facilities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(index)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                <div className="w-2 h-6 bg-amber-600 rounded-full"></div>
                                Itinerary Perjalanan
                            </h2>
                            <button
                                type="button"
                                onClick={addItinerary}
                                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Hari
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.itineraries.map((itinerary, index) => (
                                <div key={index} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-semibold">
                                            Hari {itinerary.dayNumber}
                                        </span>
                                        {formData.itineraries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItinerary(index)}
                                                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={itinerary.title}
                                            onChange={e => updateItinerary(index, 'title', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none bg-white"
                                            placeholder="Judul aktivitas hari ini"
                                        />
                                        <textarea
                                            value={itinerary.description}
                                            onChange={e => updateItinerary(index, 'description', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none resize-none bg-white"
                                            rows="3"
                                            placeholder="Deskripsi detail aktivitas..."
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/packages')}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30"
                        >
                            Simpan Paket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PackageCreate;