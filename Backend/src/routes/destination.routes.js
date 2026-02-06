  import express from "express";
  import multer from "multer";
  import path from "path";
  import { 
    getDestinations, 
    getDestinationById, 
    createDestination, 
    updateDestination, 
    deleteDestination 
  } from "../controllers/destination.controller.js";
  import { getCountries, getCitiesByCountry } from "../controllers/master.controller.js";

  const router = express.Router();

  // ==========================================
  // KONFIGURASI MULTER (PENYIMPANAN GAMBAR)
  // ==========================================
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Simpan di: backend/uploads/destinations
      cb(null, 'uploads/destinations');
    },
    filename: (req, file, cb) => {
      // Format: timestamp-random.ext
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit 2MB (Opsional)
  });

  // ==========================================
  // RUTE MASTER DATA (UNTUK DROPDOWN)
  // ==========================================
  router.get("/master/countries", getCountries);
  router.get("/master/cities/:countryId", getCitiesByCountry);

  // ==========================================
  // RUTE CRUD DESTINASI
  // ==========================================

  // 1. Ambil semua data & Ambil data berdasarkan ID
  router.get("/", getDestinations);
  router.get("/:id", getDestinationById);

  // 2. Tambah Destinasi Baru (Upload single image)
  router.post("/", upload.single('thumbnail'), createDestination);

  // 3. Update Destinasi (Upload single image jika ada perubahan)
  router.put("/:id", upload.single('thumbnail'), updateDestination);

  // 4. Hapus Destinasi
  router.delete("/:id", deleteDestination);

  export default router;