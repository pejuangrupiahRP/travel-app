import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, UserCheck, UserX, Loader2, Search, MapPin } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const CustomerIndex = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/customers`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filteredCustomers = customers.filter(c => 
    c.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Database Pelanggan</h1>
          <p className="text-slate-500">Kelola informasi dan status akun customer Anda</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Cari nama atau email..."
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama & Identitas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aktivitas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Kolom 1: Profil (Data dari tabel Profile) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                        {customer.profile?.fullName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{customer.profile?.fullName || 'Belum diatur'}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin size={10} /> {customer.profile?.address || 'Alamat tidak tersedia'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 2: Kontak */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-700 flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" /> {customer.email}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" /> {customer.profile?.phone || '-'}
                      </span>
                    </div>
                  </td>

                  {/* Kolom 3: Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {customer.status}
                    </span>
                  </td>

                  {/* Kolom 4: Aktivitas */}
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-500 space-y-1">
                      <p className="font-medium text-slate-700">{customer._count.bookings} Pesanan</p>
                      <p className="flex items-center gap-1">
                        <Calendar size={12} /> Gabung: {new Date(customer.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </td>

                  {/* Kolom 5: Aksi */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => {/* Tambah fungsi toggle status atau edit */}}
                      className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
                    >
                      {customer.status === 'ACTIVE' ? <UserX size={20} /> : <UserCheck size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerIndex;