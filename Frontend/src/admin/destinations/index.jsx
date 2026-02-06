// src/admin/destinations/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, MapPin, Globe, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DestinationIndex = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menentukan URL dasar untuk folder uploads agar gambar muncul
  const STORAGE_URL = API_BASE_URL.replace('/api', '') + '/uploads/destinations';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/destinations`);
      const data = await res.json();
      setDestinations(data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          fetchData();
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        alert("Terjadi kesalahan koneksi");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinasi Wisata</h1>
          <p className="text-slate-500 text-sm">Kelola daftar lokasi dan aset gambar destinasi</p>
        </div>
        <Link to="create" className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-200">
          <Plus size={20} /> Tambah Destinasi
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-4 py-4 font-semibold">Destinasi</th>
                <th className="px-4 py-4 font-semibold">Lokasi</th>
                <th className="px-4 py-4 font-semibold">Deskripsi</th>
                <th className="px-4 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {destinations.length > 0 ? (
                destinations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                         
                          <img
                            src={item.thumbnail ? `${API_BASE_URL.replace('/api', '')}/uploads/destinations/${item.thumbnail}` : `https://ui-avatars.com/api/?name=${item.name}`}
                            alt={item.name}
                            className="w-full h-full object-cover shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/100x100?text=No+Image";
                            }}
                          />
                        </div>
                        <span className="font-bold text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        {/* Perbaikan: Mengakses .name dari objek city dan country */}
                        <span className="text-slate-700 flex items-center gap-1 text-sm font-medium">
                          <MapPin size={14} className="text-indigo-500" />
                          {item.city?.name || "Kota tidak ada"}
                        </span>
                        <span className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                          <Globe size={12} />
                          {item.country?.name || "Negara tidak ada"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-sm max-w-xs truncate">
                      {item.description || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <Link to={`update/${item.id}`} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-400">Tidak ada data destinasi</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DestinationIndex;