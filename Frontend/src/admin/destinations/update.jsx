import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Loader2, X, MapPin, Globe } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';

const DestinationUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    countryId: '',
    cityId: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');

  // 1. Load Data Negara dan Data Destinasi (Awal)
  useEffect(() => {
    const initData = async () => {
      try {
        // Ambil data negara
        const countryRes = await fetch(`${API_BASE_URL}/api/admin/destinations/master/countries`);
        const countryData = await countryRes.json();
        setCountries(countryData);

        // Ambil data destinasi yang akan diedit
        const destRes = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`);
        if (!destRes.ok) throw new Error("Gagal mengambil data destinasi");
        const destData = await destRes.json();

        setFormData({
          name: destData.name || '',
          countryId: destData.countryId?.toString() || '',
          cityId: destData.cityId?.toString() || '',
          description: destData.description || ''
        });
        setExistingThumbnail(destData.thumbnail);
      } catch (error) {
        console.error("Error:", error);
        alert("Data tidak ditemukan!");
        navigate('/admin/destinations');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, navigate]);

  // 2. Load Data Kota setiap kali countryId berubah
  useEffect(() => {
    if (formData.countryId) {
      fetch(`${API_BASE_URL}/api/admin/destinations/master/cities/${formData.countryId}`)
        .then(res => res.json())
        .then(data => setCities(data))
        .catch(err => console.error("Error load cities:", err));
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('countryId', formData.countryId);
    data.append('cityId', formData.cityId);
    data.append('description', formData.description);
    
    // Kirim file baru jika ada
    if (file) {
      data.append('thumbnail', file);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
        method: 'PUT',
        body: data // Gunakan FormData, bukan JSON
      });

      if (!response.ok) throw new Error("Gagal memperbarui data");

      alert("Destinasi berhasil diperbarui!");
      navigate('/admin/destinations');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Memuat data destinasi...</p>
      </div>
    );
  }

  const STORAGE_URL = API_BASE_URL.replace('/api', '') + '/uploads/destinations';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate('/admin/destinations')} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Kembali ke Daftar
      </button>

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Edit Destinasi</h2>
          <p className="text-slate-500 text-sm">Perbarui informasi lokasi tujuan wisata</p>
        </div>
        
        <div className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nama Destinasi</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Negara */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Globe size={16} /> Negara
              </label>
              <select 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50"
                required
                disabled={!formData.countryId}
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
            <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${preview || existingThumbnail ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200'}`}>
              <div className="relative h-56 group">
                <img 
                  src={preview ? preview : `${STORAGE_URL}/${existingThumbnail}`} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded-lg shadow-sm" 
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                   <label className="bg-white text-indigo-600 px-4 py-2 rounded-lg cursor-pointer font-bold shadow-xl hover:scale-105 transition-transform">
                      Ganti Gambar
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                   </label>
                   {preview && (
                     <button 
                       type="button" 
                       onClick={() => {setFile(null); setPreview(null);}} 
                       className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded-full shadow-lg"
                     >
                       <X size={20} />
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi</label>
            <textarea 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl h-32 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/destinations')}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all disabled:bg-slate-400"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DestinationUpdate;