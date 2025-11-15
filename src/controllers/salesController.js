import pool from "../config/database.js";

// POST: Crear una nueva venta
export const createSale = async (req, res) => {
  try {
    const { amount, id_customer } = req.body;

    // Validaciones
    if (!amount || !id_customer) {
      return res.status(400).json({
        success: false,
        message: "El monto y el ID del cliente son obligatorios",
      });
    }

    // Validar que amount sea un número positivo
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser un número positivo",
      });
    }

    // Verificar que el cliente existe
    const customerExists = await pool.query(
      "SELECT id FROM customers WHERE id = $1",
      [id_customer]
    );

    if (customerExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El cliente especificado no existe",
      });
    }

    // Insertar la venta
    const result = await pool.query(
      "INSERT INTO sales (amount, id_customer, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [amount, id_customer]
    );

    res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error registrando venta:", error);
    res.status(500).json({
      success: false,
      message: "Error registrando la venta",
      error: error.message,
    });
  }
};

// GET: Obtener todas las ventas
export const getAllSales = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name as customer_name, c.code as customer_code
       FROM sales s
       LEFT JOIN customers c ON s.id_customer = c.id
       ORDER BY s.created_at DESC`
    );
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error obteniendo ventas:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo ventas",
      error: error.message,
    });
  }
};