import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBooking,
      revenueData,
      totalCustomers,
      pendingBooking,
      totalPackages,
      totalDestinations,
      totalReviews,
      avgRatingData
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: 'PAID' } // Sesuaikan dengan Enum PAID Anda
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.travelPackage.count(), // Nama model TravelPackage
      prisma.destination.count(),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } })
    ]);

    res.json({
      totalBooking: totalBooking || 0,
      totalRevenue: revenueData._sum.totalPrice || 0,
      totalCustomers: totalCustomers || 0,
      pendingBooking: pendingBooking || 0,
      totalPackages: totalPackages || 0,
      totalDestinations: totalDestinations || 0,
      totalReviews: totalReviews || 0,
      avgRating: avgRatingData._avg.rating || 0
    });
  } catch (error) {
    console.error("Error Stats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        schedule: {
          include: {
            travelPackage: {
              include: { destination: true }
            }
          }
        }
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error Bookings:", error);
    res.status(500).json({ error: error.message });
  }
};