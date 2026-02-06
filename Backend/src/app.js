import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import packageRoutes from "./routes/package.routes.js";
import destinationRoutes from "./routes/destination.routes.js";
import customerRoutes from "./routes/customer.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API Backend berjalan 🚀" });
});

// --- RUTE PUBLIK (Untuk Customer) ---
// Perbaikan: Gunakan middleware router, bukan controller langsung
app.use("/api/packages", packageRoutes); 
app.use("/api/destinations", destinationRoutes); 

// --- RUTE ADMIN ---
app.use("/auth", authRoutes);
app.use("/api/admin/packages", packageRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/destinations", destinationRoutes);
app.use("/api/admin/customers", customerRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan!" });
});

export default app;