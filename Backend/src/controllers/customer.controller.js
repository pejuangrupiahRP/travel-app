import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

// CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const { email, password, fullName, phone, address, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CUSTOMER',
        profile: {
          create: {
            fullName,
            phone,
            address,
            gender,
          }
        }
      },
      include: { profile: true }
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { profile: true }
    });
    if (!customer) return res.status(404).json({ message: "Customer tidak ditemukan" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      include: {
        profile: true,
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS ONLY
export const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui status" });
  }
};
// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, fullName, phone, address, gender, status } = req.body;

    const updated = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        status,
        profile: {
          update: {
            fullName,
            phone,
            address,
            gender,
          }
        }
      },
      include: { profile: true }
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Gagal memperbarui data customer" });
  }
};