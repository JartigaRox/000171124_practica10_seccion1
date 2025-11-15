import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  searchCustomerByCode,
} from "../controllers/customerController.js";

const router = express.Router();

// Rutas de clientes
router.get("/search", searchCustomerByCode);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

export default router;