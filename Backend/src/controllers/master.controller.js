import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua daftar negara untuk dropdown pertama
export const getCountries = async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc', // Urutkan berdasarkan abjad A-Z
      },
    });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ 
      message: "Gagal mengambil data negara", 
      error: error.message 
    });
  }
};

// Ambil daftar kota berdasarkan ID negara yang dipilih (Cascading Dropdown)
export const getCitiesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;

    const cities = await prisma.city.findMany({
      where: {
        countryId: parseInt(countryId),
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ 
      message: "Gagal mengambil data kota", 
      error: error.message 
    });
  }
};