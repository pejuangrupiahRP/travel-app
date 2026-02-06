import express from "express";
import { 
  getAllCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  updateCustomerStatus 
} from "../controllers/customer.controller.js";

const router = express.Router();

// Semua rute ini akan memiliki prefix /api/admin/customers
router.get("/", getAllCustomers);           // GET /api/admin/customers
router.get("/:id", getCustomerById);       // GET /api/admin/customers/:id
router.post("/", createCustomer);          // POST /api/admin/customers
router.patch("/:id", updateCustomer);      // PATCH /api/admin/customers/:id
router.patch("/:id/status", updateCustomerStatus); // PATCH /api/admin/customers/:id/status

export default router;