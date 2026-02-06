import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import {
  MapPin, ArrowRight, Star, Calendar, Users, Sparkles, Globe2,
  Heart, Award, Clock, Shield, TrendingUp, Zap, CheckCircle,
  Send, Phone, Mail, ChevronLeft, ChevronRight, X, Play, Pause,
  Search, Filter, SlidersHorizontal, Bookmark, Share2, Eye
} from 'lucide-react';

// Import default images
import img1 from "@/assets/images/img1.jpg";
import img2 from "@/assets/images/img2.jpg";
import img3 from "@/assets/images/jepang.jpg";
import img4 from "@/assets/images/img4.jpg";

// ==================== CUSTOM HOOKS ====================

// Hook untuk Intersection Observer (lazy loading & animations)
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

// Hook untuk countdown timer
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

// ==================== COMPONENTS ====================

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Floating Action Button Component
const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3">
        {isOpen && (
          <>
            <button className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-all transform hover:scale-105">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Hubungi Kami
              </span>
            </button>

            <button className="group relative flex items-center gap-3 bg-white rounded-full shadow-lg p-3 hover:shadow-xl transition-all transform hover:scale-105">
              <Send className="w-5 h-5 text-blue-600" />
              <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Chat Langsung
              </span>
            </button>
          </>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-xl p-4 hover:shadow-2xl transition-all transform hover:scale-110 hover:rotate-90"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </button>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 bg-gray-900 text-white rounded-full shadow-xl p-3 hover:shadow-2xl transition-all transform hover:scale-110"
        >
          <ArrowRight className="w-5 h-5 -rotate-90" />
        </button>
      )}
    </>
  );
};

// Feature Card Component for "Why Choose Us" section
const FeatureCard = ({ feature, index }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative">
        <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
          <feature.icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          {feature.title}
        </h3>

        <p className="text-gray-300 mb-6">
          {feature.desc}
        </p>

        <div className="flex items-center gap-2 text-cyan-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Verified</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Package Card with Bookmark & Share
const PackageCard = ({ pkg, index, image }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className={`group transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}

          <img
            src={image}
            alt={pkg.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {index < 2 && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                🔥 Hot Deal
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
              <Star className="w-3 h-3 inline mr-1 text-yellow-500 fill-yellow-500" />
              4.8
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all transform hover:scale-110"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all transform hover:scale-110">
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform shadow-xl">
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>

          {/* Location Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <MapPin className="w-3 h-3 text-cyan-600" />
              <span className="text-xs font-semibold text-gray-800">
                {pkg.destination?.name || "Destinasi Eksotis"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {pkg.title}
          </h3>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>{pkg.durationDays || 3} Hari</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Min. {pkg.quota || 2}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Rp {(pkg.price || 5000000).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <Link
              to={`/packages/${pkg.id}`}
              className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 group/btn"
            >
              Lihat Detail
              <ArrowRight className="inline w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Destination Card
const DestinationCard = ({ dest, index, image }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative h-96 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <img
        src={image}
        alt={dest.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${isHovered
          ? 'from-black/80 via-black/50 to-transparent'
          : 'from-black/60 via-black/30 to-transparent'
        }`} />

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className={`transform transition-all duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-4'
          }`}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">
              {dest.city?.name || dest.country?.name || 'Destinasi Eksotis'}
            </span>
          </div>

          <h3 className="text-3xl font-bold text-white mb-3">{dest.name}</h3>

          <p className={`text-gray-200 mb-4 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
            }`}>
            {dest.description || 'Destinasi menakjubkan dengan pemandangan yang indah'}
          </p>

          <Link
            to={`/destinations/${dest.id}`}
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-cyan-400 hover:text-white transition-all transform hover:scale-105"
          >
            Jelajahi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`absolute top-4 right-4 transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
        <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Search & Filter Component
const SearchFilter = ({ onSearch, onFilter }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-xl p-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari destinasi, paket tour, atau aktivitas..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full py-3 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="absolute top-full mt-4 left-0 right-0 bg-white rounded-2xl shadow-xl p-6 z-10 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Harga</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500">
                <option>Semua Harga</option>
                <option>{'< Rp 5 Juta'}</option>
                <option>Rp 5 - 10 Juta</option>
                <option>{'> Rp 10 Juta'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500">
                <option>Semua Durasi</option>
                <option>1-3 Hari</option>
                <option>4-7 Hari</option>
                <option>7+ Hari</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500">
                <option>Semua Kategori</option>
                <option>Pantai</option>
                <option>Gunung</option>
                <option>Kota</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              Reset
            </button>
            <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Countdown Timer Component
const CountdownTimer = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

  const timeLeft = useCountdown(targetDate);

  return (
    <div className="flex items-center justify-center gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 min-w-[70px]">
            <div className="text-3xl font-bold text-white">{value.toString().padStart(2, '0')}</div>
          </div>
          <div className="text-white/80 text-xs mt-2 capitalize">{unit}</div>
        </div>
      ))}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const LandingPage = () => {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const heroImages = useMemo(() => [
    { url: img1, name: 'Destinasi Eksotis 1', description: 'Jelajahi keindahan alam yang menakjubkan' },
    { url: img2, name: 'Destinasi Eksotis 2', description: 'Pengalaman tak terlupakan menanti Anda' },
    { url: img3, name: 'Destinasi Eksotis 3', description: 'Petualangan impian dimulai dari sini' },
    { url: img4, name: 'Destinasi Eksotis 4', description: 'Temukan surga tersembunyi di dunia' }
  ], []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packagesRes, destinationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/packages`),
          fetch(`${API_BASE_URL}/api/admin/destinations`)
        ]);

        const [packagesData, destinationsData] = await Promise.all([
          packagesRes.json(),
          destinationsRes.json()
        ]);

        setPackages(packagesData.slice(0, 6));
        setDestinations(destinationsData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hero slider with play/pause
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, heroImages.length]);

  // Smooth scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper functions
  const getImageUrl = useCallback((thumbnail, type = 'destinations') => {
    if (!thumbnail) return null;
    if (thumbnail.startsWith('http')) return thumbnail;
    return `${API_BASE_URL}/uploads/${type}/${thumbnail}`;
  }, []);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroImages.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setIsPlaying(false);
  };

  // Filter packages based on search
  const filteredPackages = useMemo(() => {
    if (!searchTerm) return packages;
    return packages.filter(pkg =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Memuat pengalaman menakjubkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          background: scrollY > 50
            ? 'rgba(15, 23, 42, 0.95)'
            : 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), transparent)',
          backdropFilter: scrollY > 50 ? 'blur(20px)' : 'blur(8px)',
          boxShadow: scrollY > 50 ? '0 10px 40px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TravelGo</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['Beranda', 'Paket Tour', 'Destinasi', 'Tentang'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/90 hover:text-cyan-400 transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-white/90 hover:text-white transition-colors font-medium px-4 py-2"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Images */}
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: activeSlide === idx ? 1 : 0,
              transform: `scale(${activeSlide === idx ? 1 : 1.1})`,
              transition: 'opacity 1s, transform 8s'
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8 animate-slideDown">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">
                  Dipercaya <AnimatedCounter end={10000} suffix="+" /> Traveler
                </span>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white -ml-3"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slideUp">
                Jelajahi Dunia{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  Tanpa Batas
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-10 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Rasakan pengalaman perjalanan tak terlupakan ke destinasi impian dengan paket tour premium kami.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                <Link
                  to="/packages" // Ini akan secara otomatis mencari rute /packages yang terhubung ke index.jsx Anda
                  className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Mulai Petualangan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 animate-slideUp" style={{ animationDelay: '0.6s' }}>
                {[
                  { number: destinations.length || 50, label: 'Destinasi', icon: MapPin },
                  { number: 10, label: 'K+ Traveler', icon: Users },
                  { number: 4.9, label: '★ Rating', icon: Star }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                    <stat.icon className="w-6 h-6 text-cyan-400 mb-2" />
                    <div className="text-3xl font-bold text-white">
                      {idx === 2 ? stat.number : <AnimatedCounter end={stat.number} />}
                      {idx === 1 && 'K+'}
                      {idx === 2 && '★'}
                    </div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveSlide(idx);
                  setIsPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${activeSlide === idx
                    ? 'w-12 bg-gradient-to-r from-cyan-400 to-blue-500'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-full hover:bg-white/30 transition-all ml-2"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4" /> Pilihan Terbaik
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Destinasi Favorit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Koleksi destinasi pilihan yang paling banyak diminati traveler kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.length > 0 ? (
              destinations.map((dest, idx) => (
                <DestinationCard
                  key={dest.id}
                  dest={dest}
                  index={idx}
                  image={getImageUrl(dest.thumbnail) || heroImages[idx % heroImages.length].url}
                />
              ))
            ) : (
              heroImages.slice(0, 3).map((img, idx) => (
                <DestinationCard
                  key={idx}
                  dest={{ name: img.name, description: img.description }}
                  index={idx}
                  image={img.url}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Packages Section with Search */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🔥 Hot Deals
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Paket Tour Terpopuler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pilihan terbaik dengan harga terjangkau dan pelayanan premium
            </p>
          </div>

          {/* Search & Filter */}
          <SearchFilter
            onSearch={setSearchTerm}
            onFilter={() => { }}
          />

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg, idx) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={idx}
                  image={
                    pkg.destination?.thumbnail
                      ? getImageUrl(pkg.destination.thumbnail)
                      : heroImages[idx % heroImages.length].url
                  }
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-gray-600">
                  Coba kata kunci lain atau ubah filter pencarian
                </p>
              </div>
            )}
          </div>

          {packages.length > 6 && (
            <div className="text-center mt-12">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Lihat Semua Paket Tour
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" /> Keunggulan Kami
            </span>
            <h2 className="text-5xl font-bold text-white mb-4">
              Kenapa Memilih TravelGo?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Pengalaman terbaik untuk perjalanan impian Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Terpercaya & Aman',
                desc: 'Lebih dari 10,000 traveler puas dengan layanan kami yang profesional dan terpercaya',
                gradient: 'from-blue-400 to-cyan-400',
                bg: 'from-blue-500/10 to-cyan-500/10'
              },
              {
                icon: Award,
                title: 'Kualitas Premium',
                desc: 'Paket tour dengan destinasi pilihan terbaik dan hotel berbintang yang nyaman',
                gradient: 'from-purple-400 to-pink-400',
                bg: 'from-purple-500/10 to-pink-500/10'
              },
              {
                icon: Clock,
                title: 'Dukungan 24/7',
                desc: 'Tim customer service kami siap membantu Anda kapan saja dan dimana saja',
                gradient: 'from-orange-400 to-red-400',
                bg: 'from-orange-500/10 to-red-500/10'
              }
            ].map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Countdown */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" /> Penawaran Terbatas
          </span>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Siap Memulai Petualangan?
          </h2>

          <p className="text-xl text-white/90 mb-8">
            Daftar sekarang dan dapatkan diskon 20% untuk paket tour pertama Anda
          </p>

          {/* Countdown Timer */}
          <div className="mb-10">
            <p className="text-white/80 mb-4 text-sm">Promo berakhir dalam:</p>
            <CountdownTimer />
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all transform hover:scale-105 mb-8"
          >
            <Sparkles className="w-6 h-6" />
            Daftar Sekarang
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
            {[
              { icon: Shield, text: 'Pembayaran Aman' },
              { icon: CheckCircle, text: 'Garansi Terbaik' },
              { icon: Award, text: 'Terakreditasi' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/90">
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl">
                  <Globe2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">TravelGo</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Wujudkan petualangan impianmu bersama kami. Destinasi terbaik, harga terjangkau, pengalaman tak terlupakan.
              </p>
              <div className="flex gap-3">
                {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/20 rounded-full" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {['Tentang Kami', 'Paket Tour', 'Destinasi', 'Kontak'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <a href="mailto:info@travelgo.com" className="hover:text-cyan-400 transition-colors">
                      info@travelgo.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <a href="tel:+6281234567890" className="hover:text-cyan-400 transition-colors">
                      +62 812-3456-7890
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 TravelGo. All rights reserved. Made with ❤️ in Indonesia
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations CSS */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;