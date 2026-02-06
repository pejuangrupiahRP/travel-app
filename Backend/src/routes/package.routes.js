import express from "express";
import { 
  getAllPackages, 
  getPackageById, // Tambahkan ini
  createPackage, 
  updatePackage, 
  getPublicPackages,
  deletePackage 
} from "../controllers/package.controller.js";

const router = express.Router();
router.get("/public", getPublicPackages);


router.get("/", getAllPackages);
router.get("/:id", getPackageById); 
router.post("/", createPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

export default router;