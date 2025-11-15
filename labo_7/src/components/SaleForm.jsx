import React, { useState, useEffect } from "react";
import axios from "axios";

const SaleForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    id_customer: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      if (response.data.success) {
        setCustomers(response.data.data);
      }
    } catch (err) {
      console.error("Error obteniendo clientes:", err);
      setMessage({
        text: "Error al cargar la lista de clientes",
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar mensaje al escribir
    if (message.text) setMessage({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.amount || !formData.id_customer) {
      setMessage({
        text: "Por favor, complete todos los campos",
        type: "error",
      });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setMessage({
        text: "El monto debe ser mayor a 0",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/sales", {
        amount: parseFloat(formData.amount),
        id_customer: parseInt(formData.id_customer),
      });

      if (response.data.success) {
        setMessage({
          text: "¡Venta registrada exitosamente!",
          type: "success",
        });
        // Limpiar formulario
        setFormData({ amount: "", id_customer: "" });
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Error registrando venta:", err);
      setMessage({
        text: err.response?.data?.message || "Error al registrar la venta",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar Nueva Venta</h2>

      {message.text && (
        <div
          style={{
            ...styles.message,
            ...(message.type === "success"
              ? styles.successMessage
              : styles.errorMessage),
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="id_customer" style={styles.label}>
            Cliente *
          </label>
          <select
            id="id_customer"
            name="id_customer"
            value={formData.id_customer}
            onChange={handleChange}
            style={styles.select}
            disabled={loading}
          >
            <option value="">Seleccione un cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.code} - {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="amount" style={styles.label}>
            Monto de la Venta *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Ingrese el monto"
            step="0.01"
            min="0.01"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar Venta"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  message: {
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  successMessage: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
  form: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "border-color 0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#646cff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  buttonDisabled: {
    backgroundColor: "#999",
    cursor: "not-allowed",
  },
};

export default SaleForm;