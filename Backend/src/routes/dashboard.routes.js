import express from "express";
import { getDashboardStats, getRecentBookings } from "../controllers/dashboard.controller.js";

const router = express.Router();

// Ini akan menjadi GET /api/admin/dashboard/stats
router.get("/stats", getDashboardStats);

// Ini akan menjadi GET /api/admin/dashboard/recent-bookings
router.get("/recent-bookings", getRecentBookings);

export default router;