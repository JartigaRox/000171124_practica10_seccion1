import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales");
      
      if (response.data.success) {
        setSales(response.data.data);
      }
      setError("");
    } catch (err) {
      console.error("Error obteniendo ventas:", err);
      setError(err.response?.data?.message || "Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando ventas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button onClick={fetchSales} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Lista de Ventas</h2>
        <button onClick={fetchSales} style={styles.refreshButton}>
          🔄 Actualizar
        </button>
      </div>
      
      {sales.length === 0 ? (
        <p style={styles.noData}>No hay ventas registradas</p>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>ID Venta</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Código Cliente</th>
                  <th style={styles.th}>Monto</th>
                  <th style={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} style={styles.row}>
                    <td style={styles.td}>#{sale.id}</td>
                    <td style={styles.td}>{sale.customer_name}</td>
                    <td style={styles.td}>{sale.customer_code}</td>
                    <td style={{...styles.td, ...styles.amount}}>
                      {formatAmount(sale.amount)}
                    </td>
                    <td style={styles.td}>{formatDate(sale.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={styles.footer}>
            <div style={styles.footerItem}>
              <strong>Total de ventas:</strong> {sales.length}
            </div>
            <div style={styles.footerItem}>
              <strong>Monto total:</strong> {formatAmount(
                sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0)
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  refreshButton: {
    padding: "10px 20px",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s",
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
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
  },
  td: {
    padding: "15px",
    fontSize: "14px",
    color: "#333",
  },
  amount: {
    fontWeight: "600",
    color: "#27ae60",
  },
  footer: {
    marginTop: "20px",
    padding: "15px 20px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "15px",
  },
  footerItem: {
    fontSize: "16px",
    color: "#666",
  },
};

export default SalesList;