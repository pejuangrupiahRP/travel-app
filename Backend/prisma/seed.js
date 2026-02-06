import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  // 1. Buat User Admin & Customer
  // Menggunakan upsert agar tidak bentrok dengan data lama
  const admin = await prisma.user.upsert({
    where: { email: "admin@travel.com" },
    update: {}, // Jika sudah ada, tidak ada yang diubah
    create: {
      name: "Super Admin",
      email: "admin@travel.com",
      password: password,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Budi Traveler",
      email: "budi@example.com",
      password,
      role: "CUSTOMER",
    },
  });

  // 2. Buat Destinasi
  const bali = await prisma.destination.create({
    data: {
      name: "Bali Island",
      city: "Denpasar",
      country: "Indonesia",
      description: "Pulau Dewata dengan pantai yang indah.",
    },
  });

  // 3. Buat Paket Wisata
  const paketBali = await prisma.travelPackage.create({
    data: {
      destinationId: bali.id,
      title: "Liburan Eksklusif Bali 3 Hari",
      description: "Paket lengkap hotel & transportasi.",
      durationDays: 3,
      price: 5000000,
      quota: 10,
    },
  });

  // 4. Buat Jadwal (Schedule) - Penting untuk Booking!
  const jadwalBali = await prisma.schedule.create({
    data: {
      packageId: paketBali.id,
      departureDate: new Date("2026-05-01"),
      returnDate: new Date("2026-05-04"),
      availableQuota: 8,
    },
  });

  // 5. Buat Data Booking (Agar Total Revenue Muncul)
  await prisma.booking.create({
    data: {
      userId: customer.id,
      scheduleId: jadwalBali.id,
      bookingCode: "BK-001",
      totalPrice: 5000000,
      status: "PAID", // Status PAID agar terhitung di total revenue
    },
  });

  // 6. Buat Review (Agar Avg Rating Muncul)
  await prisma.review.create({
    data: {
      userId: customer.id,
      packageId: paketBali.id,
      rating: 5,
      comment: "Sangat memuaskan!",
    },
  });

  console.log("✅ Semua data dummy (User, Destinasi, Paket, Booking, Review) berhasil dibuat");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
