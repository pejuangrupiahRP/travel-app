import bcrypt from "bcryptjs";
import prisma from "../config/database.js";
import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "Email dan password wajib diisi",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Email tidak ditemukan" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Password salah" });
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    message: "Login berhasil",
    token,
  });
};
