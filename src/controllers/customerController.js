import pool from "../config/database.js";

// GET: Obtener todos los clientes
export const getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM customers ORDER BY id ASC"
    );
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo clientes",
      error: error.message,
    });
  }
};

// GET: Obtener cliente por ID
export const getCustomerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de cliente inválido",
      });
    }

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error obteniendo cliente:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo cliente",
      error: error.message,
    });
  }
};

// GET: Buscar cliente por código
export const searchCustomerByCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'code' es requerido",
      });
    }

    const result = await pool.query(
      "SELECT * FROM customers WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente no encontrado con ese código",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error buscando cliente por código:", error);
    res.status(500).json({
      success: false,
      message: "Error buscando cliente",
      error: error.message,
    });
  }
};