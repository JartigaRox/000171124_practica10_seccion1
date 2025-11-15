import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/customers");
      
      if (response.data.success) {
        setCustomers(response.data.data);
      }
      setError("");
    } catch (err) {
      console.error("Error obteniendo clientes:", err);
      setError(err.response?.data?.message || "Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button onClick={fetchCustomers} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lista de Clientes</h2>
      
      {customers.length === 0 ? (
        <p style={styles.noData}>No hay clientes registrados</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Dirección</th>
                <th style={styles.th}>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} style={styles.row}>
                  <td style={styles.td}>{customer.id}</td>
                  <td style={styles.td}>{customer.code}</td>
                  <td style={styles.td}>{customer.name}</td>
                  <td style={styles.td}>{customer.address}</td>
                  <td style={styles.td}>{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={styles.footer}>
        Total de clientes: {customers.length}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#666",
  },
  error: {
    padding: "15px",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    color: "#666",
    fontSize: "16px",
  },
  tableContainer: {
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  headerRow: {
    backgroundColor: "#646cff",
    color: "white",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    textTransform: "uppercase",
  },
  row: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
    cursor: "pointer",
  },
  td: {
    padding: "15px",
    fontSize: "14px",
    color: "#333",
  },
  footer: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    fontWeight: "500",
    color: "#666",
  },
};

export default CustomerList;