import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const PackagesIndex = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [destinations, setDestinations] = useState([]);
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        fetchPackages();
        fetchDestinations();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/packages/public`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setPackages(data.filter(pkg => pkg.status === 'ACTIVE'));
            } else {
                setPackages([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setLoading(false);
        }
    };

    const fetchDestinations = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/destinations`);
            const data = await response.json();
            setDestinations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDestination = !selectedDestination || pkg.destinationId === parseInt(selectedDestination);

        let matchesPrice = true;
        if (priceRange === 'low') matchesPrice = pkg.price < 5000000;
        else if (priceRange === 'medium') matchesPrice = pkg.price >= 5000000 && pkg.price < 10000000;
        else if (priceRange === 'high') matchesPrice = pkg.price >= 10000000;

        return matchesSearch && matchesDestination && matchesPrice;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDestination('');
        setPriceRange('all');
    };

    const hasActiveFilters = searchTerm || selectedDestination || priceRange !== 'all';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat paket wisata...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Clean & Professional */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Temukan Paket Wisata Terbaik
                        </h1>
                        <p className="text-xl text-blue-100">
                            Jelajahi {packages.length} paket wisata ke {destinations.length} destinasi menarik
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari paket wisata..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Destination */}
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                        >
                            <option value="">Semua Destinasi</option>
                            {destinations.map(dest => (
                                <option key={dest.id} value={dest.id}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>

                        {/* Price Range */}
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        >
                            <option value="all">Semua Harga</option>
                            <option value="low">&lt; Rp 5 Juta</option>
                            <option value="medium">Rp 5 - 10 Juta</option>
                            <option value="high">&gt; Rp 10 Juta</option>
                        </select>

                        {/* Sort */}
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">Terpopuler</option>
                            <option value="price-low">Harga Terendah</option>
                            <option value="price-high">Harga Tertinggi</option>
                            <option value="newest">Terbaru</option>
                        </select>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-gray-600">{filteredPackages.length} paket ditemukan</span>
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Hapus Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* No Results */}
                {filteredPackages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Paket Tidak Ditemukan
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Coba ubah filter atau kata kunci pencarian Anda
                        </p>
                        <button
                            onClick={clearFilters}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {filteredPackages.length} Paket Wisata
                            </h2>
                        </div>

                        {/* Package Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPackages.map((pkg) => (
                                <Link
                                    key={pkg.id}
                                    to={`/packages/${pkg.id}`}
                                    className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <MapPin size={60} className="text-white opacity-20" />
                                        </div>
                                        
                                        {/* Duration Badge */}
                                        <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-md shadow-sm">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {pkg.durationDays} Hari
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Location */}
                                        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span>{pkg.destination?.city}, {pkg.destination?.country}</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {pkg.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {pkg.description || 'Nikmati pengalaman liburan yang tak terlupakan'}
                                        </p>

                                        {/* Info */}
                                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={16} className="text-gray-400" />
                                                <span>{pkg.quota} orang</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={16} className="text-gray-400" />
                                                <span>{pkg._count?.schedules || 0} jadwal</span>
                                            </div>
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Mulai dari</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    {formatPrice(pkg.price)}
                                                </p>
                                            </div>
                                            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                Lihat Detail
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PackagesIndex;