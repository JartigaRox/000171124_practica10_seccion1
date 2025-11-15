// src/routes/salesRoutes.js
import express from "express";
import {
  createSale,
  getAllSales,
  getSalesReport,
} from "../controllers/salesController.js";

const router = express.Router();

// Rutas de ventas
router.get("/report", getSalesReport);
router.post("/", createSale);
router.get("/", getAllSales);

export default router;