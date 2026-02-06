import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, ArrowLeft, Save } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const CustomerCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', fullName: '', phone: '', address: '', gender: 'Laki-laki'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) navigate('/admin/customers');
    } catch (error) { alert("Pendaftaran gagal"); }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-800">
        <ArrowLeft size={18} /> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold mb-6">Tambah Customer Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bagian Akun */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Informasi Akun</h3>
              <div>
                <label className="text-sm block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="email" required className="w-full pl-10 pr-4 py-2 border rounded-xl" 
                    onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="password" required className="w-full pl-10 pr-4 py-2 border rounded-xl" 
                    onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Bagian Profil */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Data Pribadi</h3>
              <div>
                <label className="text-sm block mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="text" required className="w-full pl-10 pr-4 py-2 border rounded-xl" 
                    onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm block mb-2">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="text" className="w-full pl-10 pr-4 py-2 border rounded-xl" 
                    onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
              <Save size={20} /> Simpan Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerCreate;