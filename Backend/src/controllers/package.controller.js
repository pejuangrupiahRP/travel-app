import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET: Semua Paket untuk Tabel Admin
export const getAllPackages = async (req, res) => {
  try {
    const packages = await prisma.travelPackage.findMany({
      include: {
        destination: true, // Menampilkan nama kota/negara
        _count: { select: { schedules: true } } // Melihat jumlah jadwal tersedia
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
};

// POST: Tambah Paket Baru (Beserta Itinerary & Fasilitas)
export const createPackage = async (req, res) => {
  const { 
    destinationId, title, description, durationDays, price, quota, 
    itineraries, facilities 
  } = req.body;

  try {
    const result = await prisma.travelPackage.create({
      data: {
        destinationId: parseInt(destinationId),
        title,
        description,
        durationDays: parseInt(durationDays),
        price: parseFloat(price),
        quota: parseInt(quota),
        status: 'ACTIVE',
        // Sekaligus buat Itinerary jika ada
        itineraries: itineraries ? {
          create: itineraries.map(item => ({
            dayNumber: parseInt(item.dayNumber),
            title: item.title,
            description: item.description
          }))
        } : undefined,
        // Sekaligus buat Fasilitas jika ada
        facilities: facilities ? {
          create: facilities.map(f => ({ facility: f }))
        } : undefined
      }
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: "Gagal membuat paket", error: error.message });
  }
};

// PUT: Update Paket
export const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { destinationId, price, quota, durationDays, ...rest } = req.body;

  try {
    const updated = await prisma.travelPackage.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        destinationId: destinationId ? parseInt(destinationId) : undefined,
        price: price ? parseFloat(price) : undefined,
        quota: quota ? parseInt(quota) : undefined,
        durationDays: durationDays ? parseInt(durationDays) : undefined,
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Gagal update paket", error: error.message });
  }
};

// DELETE: Hapus Paket
export const deletePackage = async (req, res) => {
  const { id } = req.params;
  try {
    // Note: Pastikan menghapus relasi child dulu atau gunakan onDelete: Cascade di schema
    await prisma.$transaction([
      prisma.packageItinerary.deleteMany({ where: { packageId: parseInt(id) } }),
      prisma.packageFacility.deleteMany({ where: { packageId: parseInt(id) } }),
      prisma.travelPackage.delete({ where: { id: parseInt(id) } })
    ]);
    res.json({ message: "Paket berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: "Gagal menghapus. Pastikan tidak ada data booking terkait.", error: error.message });
  }
};
// GET: Semua Paket untuk Customer (Hanya yang ACTIVE)
export const getPublicPackages = async (req, res) => {
  try {
    const packages = await prisma.travelPackage.findMany({
      where: { status: 'ACTIVE' }, // Filter hanya yang aktif
      include: {
        destination: true,
        _count: { select: { schedules: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data paket", error: error.message });
  }
};
// GET: Ambil detail satu paket berdasarkan ID (Untuk Form Edit)
export const getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const pkg = await prisma.travelPackage.findUnique({
      where: { id: parseInt(id) },
      include: {
        destination: true,
        itineraries: true,
        facilities: true,
        // include hotel jika perlu di form edit
        hotels: { include: { hotel: true } } 
      }
    });

    if (!pkg) {
      return res.status(404).json({ message: "Paket tidak ditemukan" });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail paket", error: error.message });
  }
};