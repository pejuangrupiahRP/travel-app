import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// 1. Ambil Semua Data (Sudah diperbaiki untuk include Master)
export const getDestinations = async (req, res) => {
  try {
    const data = await prisma.destination.findMany({
      include: {
        city: true,
        country: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Ambil Berdasarkan ID (Fungsi yang tadi menyebabkan error)
export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await prisma.destination.findUnique({
      where: { id: parseInt(id) },
      include: {
        city: true,
        country: true
      }
    });

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Create (Gunakan parseInt untuk ID)
export const createDestination = async (req, res) => {
  try {
    const { name, cityId, countryId, description } = req.body;
    const thumbnail = req.file ? req.file.filename : null;

    const data = await prisma.destination.create({
      data: {
        name,
        description,
        thumbnail,
        cityId: parseInt(cityId),
        countryId: parseInt(countryId)
      }
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. Update
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cityId, countryId, description } = req.body;
    const oldData = await prisma.destination.findUnique({ where: { id: parseInt(id) } });

    let thumbnail = oldData.thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
      if (oldData.thumbnail) {
        const oldPath = path.join('uploads/destinations', oldData.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const data = await prisma.destination.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        thumbnail,
        cityId: parseInt(cityId),
        countryId: parseInt(countryId)
      }
    });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. Delete
export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await prisma.destination.findUnique({ where: { id: parseInt(id) } });

    if (destination?.thumbnail) {
      // Pastikan path menunjuk ke folder yang benar di root Backend
      const filePath = path.join(process.cwd(), 'uploads', 'destinations', destination.thumbnail);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await prisma.destination.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};