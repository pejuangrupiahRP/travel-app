import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, Clock, Star, Check, 
  ArrowLeft, Hotel, Shield, ChevronDown, ChevronUp, 
  AlertCircle, X, Heart, Share2, Download, Info,
  Sparkles, Award, TrendingUp, MessageCircle
} from 'lucide-react';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [participants, setParticipants] = useState(1);
  const [expandedDay, setExpandedDay] = useState(1); // Auto expand hari pertama
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    fetchPackageDetail();
    fetchSchedules();
    window.scrollTo(0, 0); // Scroll to top saat page load
  }, [id]);

  const fetchPackageDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/packages/${id}`);
      const data = await response.json();
      setPackageData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching package detail:', error);
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/schedules/package/${id}`);
      const data = await response.json();
      const availableSchedules = data.filter(schedule => 
        schedule.availableSlots > 0 && new Date(schedule.departureDate) > new Date()
      );
      setSchedules(availableSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const formatDateShort = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const calculateTotalPrice = () => {
    if (!packageData) return 0;
    return packageData.price * participants;
  };

  const calculateDiscount = () => {
    // Contoh logic: diskon 10% jika booking lebih dari 3 orang
    if (participants >= 3) {
      return calculateTotalPrice() * 0.1;
    }
    return 0;
  };

  const getFinalPrice = () => {
    return calculateTotalPrice() - calculateDiscount();
  };

  const handleBooking = () => {
    if (!selectedSchedule) {
      alert('Pilih jadwal keberangkatan terlebih dahulu');
      return;
    }
    
    navigate('/booking', {
      state: {
        packageId: packageData.id,
        packageTitle: packageData.title,
        scheduleId: selectedSchedule,
        participants,
        totalPrice: getFinalPrice(),
        discount: calculateDiscount()
      }
    });
  };

  const toggleDay = (dayNumber) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Save to localStorage or backend
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Lihat paket wisata ${packageData.title}`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link berhasil disalin!');
    } else {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  // Image gallery untuk package (bisa dari thumbnail atau default)
  const getPackageImages = () => {
    if (packageData?.thumbnail) {
      return [packageData.thumbnail];
    }
    // Default gradient images
    return [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-pulse" size={24} />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Memuat detail paket wisata...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle size={80} className="text-red-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Paket Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Maaf, paket wisata yang Anda cari tidak tersedia atau sudah dihapus.</p>
          <button 
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }

  const images = getPackageImages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/packages')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50'}`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Share2 size={20} />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
                    <button onClick={() => handleShare('whatsapp')} className="w-full px-4 py-2 text-left hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors">
                      WhatsApp
                    </button>
                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors">
                      Facebook
                    </button>
                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left hover:bg-sky-50 text-gray-700 hover:text-sky-600 transition-colors">
                      Twitter
                    </button>
                    <button onClick={() => handleShare('copy')} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 transition-colors">
                      Salin Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-3 max-h-[500px]">
          <div 
            className="col-span-4 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => setShowImageModal(true)}
          >
            <img 
              src={images[activeImageIndex]} 
              alt={packageData.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/667eea/ffffff?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Klik untuk perbesar</p>
              </div>
            </div>
          </div>
          
          {images.slice(1, 3).map((img, idx) => (
            <div 
              key={idx}
              className="hidden md:block col-span-1 relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActiveImageIndex(idx + 1);
                setShowImageModal(true);
              }}
            >
              <img 
                src={img} 
                alt={`Gallery ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowImageModal(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={images[activeImageIndex]} 
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                    <MapPin size={16} />
                    <span className="font-medium">{packageData.destination?.city}, {packageData.destination?.country}</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {packageData.title}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <Clock className="text-blue-600" size={18} />
                  <span className="text-gray-700 font-medium">{packageData.durationDays} Hari {packageData.durationDays - 1} Malam</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl">
                  <Users className="text-purple-600" size={18} />
                  <span className="text-gray-700 font-medium">Maks {packageData.quota} orang</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                  <Calendar className="text-green-600" size={18} />
                  <span className="text-gray-700 font-medium">{schedules.length} Jadwal</span>
                </div>
                {packageData.status === 'ACTIVE' && (
                  <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl">
                    <Award className="text-emerald-600" size={18} />
                    <span className="text-emerald-700 font-medium">Tersedia</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 mb-6">
                <Info className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Deskripsi Paket</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {packageData.description || 'Deskripsi paket wisata belum tersedia.'}
              </p>
            </div>

            {/* Itinerary */}
            {packageData.itineraries && packageData.itineraries.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Itinerary Perjalanan</h2>
                </div>
                <div className="space-y-3">
                  {packageData.itineraries
                    .sort((a, b) => a.dayNumber - b.dayNumber)
                    .map((itinerary, index) => (
                      <div 
                        key={itinerary.id} 
                        className="border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <button
                          onClick={() => toggleDay(itinerary.dayNumber)}
                          className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg">
                              {itinerary.dayNumber}
                            </div>
                            <div className="text-left">
                              <h3 className="font-bold text-gray-900 text-lg">{itinerary.title}</h3>
                              <p className="text-sm text-gray-500">Hari ke-{itinerary.dayNumber}</p>
                            </div>
                          </div>
                          <div className={`transform transition-transform ${expandedDay === itinerary.dayNumber ? 'rotate-180' : ''}`}>
                            <ChevronDown className="text-gray-400" size={24} />
                          </div>
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedDay === itinerary.dayNumber ? 'max-h-96' : 'max-h-0'
                          }`}
                        >
                          <div className="p-6 bg-white border-t-2 border-gray-100">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {itinerary.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {packageData.facilities && packageData.facilities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Fasilitas Termasuk</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.facilities.map((facility, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
                    >
                      <div className="bg-green-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <Check className="text-green-600" size={20} />
                      </div>
                      <span className="text-gray-700 font-medium pt-2">{facility.facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {packageData.hotels && packageData.hotels.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <Hotel className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Akomodasi Hotel</h2>
                </div>
                <div className="space-y-4">
                  {packageData.hotels.map((ph) => (
                    <div 
                      key={ph.id} 
                      className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {ph.hotel.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-sm">{ph.hotel.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className={i < ph.hotel.starRating ? 'text-yellow-400' : 'text-gray-300'}
                            fill={i < ph.hotel.starRating ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">({ph.hotel.starRating} Bintang)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews/Testimonials Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Testimoni Pelanggan</h2>
              </div>
              <p className="text-gray-600 text-center py-8">
                Testimoni pelanggan akan ditampilkan di sini.
              </p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border-2 border-blue-100">
              {/* Price Section */}
              <div className="mb-6 pb-6 border-b-2 border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Harga mulai dari</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatPrice(packageData.price)}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">per orang</p>
                
                {participants >= 3 && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <TrendingUp size={16} />
                      Hemat 10% untuk 3+ peserta!
                    </p>
                  </div>
                )}
              </div>

              {/* Schedule Selection */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  Pilih Jadwal Keberangkatan
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                >
                  <option value="">-- Pilih Jadwal --</option>
                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {formatDateShort(schedule.departureDate)} • {schedule.availableSlots} slot
                    </option>
                  ))}
                </select>
              </div>

              {/* Participants */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Users size={16} className="text-blue-600" />
                  Jumlah Peserta
                </label>
                <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-blue-500 hover:to-purple-500 hover:text-white text-gray-700 font-bold w-12 h-12 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={participants}
                    onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center bg-transparent py-3 font-bold text-lg focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setParticipants(participants + 1)}
                    className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-blue-500 hover:to-purple-500 hover:text-white text-gray-700 font-bold w-12 h-12 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border-2 border-blue-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Harga per orang</span>
                  <span className="font-semibold text-gray-900">{formatPrice(packageData.price)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700">Jumlah peserta</span>
                  <span className="font-semibold text-gray-900">× {participants}</span>
                </div>
                
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between items-center mb-3 text-green-600">
                    <span className="font-medium">Diskon (10%)</span>
                    <span className="font-semibold">- {formatPrice(calculateDiscount())}</span>
                  </div>
                )}
                
                <div className="border-t-2 border-blue-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">Total Bayar</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(getFinalPrice())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedSchedule}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 text-lg"
              >
                <Sparkles size={20} />
                Pesan Sekarang
              </button>

              {schedules.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 text-center font-medium">
                    ⚠️ Belum ada jadwal tersedia
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Shield className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="leading-tight">Pembayaran 100% aman & terenkripsi</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="leading-tight">Konfirmasi booking instant via email</span>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span className="leading-tight">Customer support 24/7 siap membantu</span>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">Butuh bantuan?</p>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center gap-2 hover:underline"
                >
                  <MessageCircle size={16} />
                  Hubungi Customer Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PackageDetail;