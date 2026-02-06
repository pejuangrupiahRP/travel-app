import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ArrowLeft, Save, Loader2, Info } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const CustomerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    gender: 'Laki-laki',
    identityNumber: '',
    status: 'ACTIVE'
  });

  // Ambil data customer saat komponen dimuat
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/customers/${id}`);
        const data = await res.json();
        
        // Mapping data dari User & Profile ke State
        setFormData({
          email: data.email,
          fullName: data.profile?.fullName || '',
          phone: data.profile?.phone || '',
          address: data.profile?.address || '',
          gender: data.profile?.gender || 'Laki-laki',
          identityNumber: data.profile?.identityNumber || '',
          status: data.status
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers/${id}`, {
        method: 'PATCH', // Gunakan PATCH untuk update sebagian
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Data berhasil diperbarui!");
        navigate('/admin/customers');
      }
    } catch (error) {
      alert("Gagal memperbarui data");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
      <p className="text-slate-500">Mengambil data customer...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate('/admin/customers')} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={18} /> Kembali ke Daftar
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Edit Profil Pelanggan</h2>
          <p className="text-slate-500 text-sm">ID Pelanggan: #{id}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section: Akun */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Info size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Informasi Akun</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Email (Tetap)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="email" value={formData.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Status Akun</label>
                <select 
                  value={formData.status}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="ACTIVE">ACTIVE (Aktif)</option>
                  <option value="INACTIVE">INACTIVE (Nonaktif)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Profil Pribadi */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <User size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Detail Profil</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Nama Lengkap</label>
                <input 
                  type="text" required value={formData.fullName}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                  onChange={e => setFormData({...formData, fullName: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" value={formData.phone}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-2">Alamat Tinggal</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <textarea 
                    rows="3" value={formData.address}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin/customers')} className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium">
              Batal
            </button>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
              <Save size={20} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerUpdate;