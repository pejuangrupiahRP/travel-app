import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, MapPin, Calendar, Users, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from "@/config/api";

const PackageIndex = () => {
    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);

    // Penting: Mengambil URL dasar tanpa '/api' agar bisa mengakses folder uploads secara langsung
    const BASE_IMAGE_URL = API_BASE_URL.replace('/api', '');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/packages`);
            const data = await response.json();
            setPackages(data);
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus paket ini?")) {
            try {
                await fetch(`${API_BASE_URL}/api/admin/packages/${id}`, {
                    method: "DELETE",
                });
                fetchPackages();
            } catch (error) {
                console.error("Error deleting package:", error);
            }
        }
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.destination?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || pkg.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Kelola Paket Wisata</h1>
                        <p className="text-slate-600">Daftar semua paket perjalanan wisata yang tersedia</p>
                    </div>
                    <Link
                        to="/admin/packages/create"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-500/30 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Paket
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari paket atau destinasi..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none bg-slate-50"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="px-6 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50 text-slate-700 font-medium"
                        >
                            <option value="ALL">Semua Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 rounded-2xl"></div>)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPackages.map((pkg) => {
                            // Mencari file di folder destinations sesuai screenshot folder Anda
                            const imageUrl = pkg.destination?.thumbnail 
                                ? `${BASE_IMAGE_URL}/uploads/destinations/${pkg.destination.thumbnail}` 
                                : null;

                            return (
                                <div key={pkg.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
                                    {/* Thumbnail Section */}
                                    <div className="h-48 relative overflow-hidden bg-slate-200">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={pkg.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/600x400?text=Gambar+Error";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                <ImageIcon className="w-12 h-12 mb-2" />
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                pkg.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                                            }`}>
                                                {pkg.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{pkg.title}</h3>
                                        <div className="space-y-2 mb-6 text-slate-500">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                {pkg.destination?.name || 'Lokasi tidak ada'}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pkg.durationDays} Hari</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Kuota: {pkg.quota}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Mulai Dari</p>
                                                <p className="text-lg font-black text-indigo-600">Rp {pkg.price?.toLocaleString('id-ID')}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link to={`/admin/packages/update/${pkg.id}`} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackageIndex;