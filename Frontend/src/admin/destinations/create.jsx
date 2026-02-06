import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, X, MapPin, Globe } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DestinationCreate = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    countryId: '',
    cityId: '',
    description: ''
  });

  // 1. Ambil Data Negara saat pertama kali halaman dibuka
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/destinations/master/countries`)
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Error fetching countries:", err));
  }, []);

  // 2. Ambil Data Kota saat Negara berubah (Cascading)
  useEffect(() => {
    if (formData.countryId) {
      fetch(`${API_BASE_URL}/api/admin/destinations/master/cities/${formData.countryId}`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error("Error fetching cities:", err));
    } else {
      setCities([]);
    }
  }, [formData.countryId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('countryId', formData.countryId);
    data.append('cityId', formData.cityId);
    data.append('description', formData.description);
    if (file) data.append('thumbnail', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/destinations`, {
        method: 'POST',
        body: data // FormData otomatis mengatur header Content-Type
      });

      if (res.ok) {
        navigate('/admin/destinations');
      } else {
        const errorData = await res.json();
        alert("Gagal: " + errorData.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 mb-6 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={20} /> Kembali ke Daftar
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Tambah Destinasi Baru</h2>
        
        <div className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Destinasi</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Negara */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Globe size={16} /> Negara
              </label>
              <select 
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.countryId}
                onChange={e => setFormData({...formData, countryId: e.target.value, cityId: ''})}
              >
                <option value="">Pilih Negara</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Kota */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={16} /> Kota
              </label>
              <select 
                required
                disabled={!formData.countryId}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50"
                value={formData.cityId}
                onChange={e => setFormData({...formData, cityId: e.target.value})}
              >
                <option value="">Pilih Kota</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Thumbnail Destinasi</label>
            <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${preview ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
              {!preview ? (
                <div className="flex flex-col items-center py-6">
                  <ImageIcon className="text-slate-300 mb-2" size={48} />
                  <p className="text-sm text-slate-500 mb-1">Klik untuk pilih gambar</p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" required onChange={handleFileChange} />
                </div>
              ) : (
                <div className="relative h-56">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => {setFile(null); setPreview(null);}} className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full shadow-md">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
            <textarea 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 disabled:bg-slate-400 transition-all shadow-lg"
          >
            <Save size={20} /> {loading ? 'Menyimpan...' : 'Simpan Destinasi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationCreate;