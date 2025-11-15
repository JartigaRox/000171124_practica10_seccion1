import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/sales/report");
      
      if (response.data.success) {
        setReport(response.data.data);
      }
      setError("");
    } catch (err) {
      console.error("Error obteniendo reporte:", err);
      setError(err.response?.data?.message || "Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalSales = () => {
    return report.reduce((sum, item) => sum + parseFloat(item.total_sales), 0);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Cargando reporte...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <button onClick={fetchReport} style={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Reporte de Ventas por Cliente</h2>
        <button onClick={fetchReport} style={styles.refreshButton}>
          🔄 Actualizar
        </button>
      </div>

      {report.length === 0 ? (
        <p style={styles.noData}>No hay datos de ventas para mostrar</p>
      ) : (
        <>
          <div style={styles.summary}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Total de Clientes</div>
              <div style={styles.summaryValue}>{report.length}</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Ventas Totales</div>
              <div style={styles.summaryValue}>{formatAmount(getTotalSales())}</div>
            </div>
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Promedio por Cliente</div>
              <div style={styles.summaryValue}>
                {formatAmount(getTotalSales() / report.length)}
              </div>
            </div>
          </div>

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Total de Ventas</th>
                  <th style={styles.th}>% del Total</th>
                </tr>
              </thead>
              <tbody>
                {report.map((item, index) => {
                  const percentage = (parseFloat(item.total_sales) / getTotalSales()) * 100;
                  return (
                    <tr key={index} style={styles.row}>
                      <td style={styles.tdNumber}>{index + 1}</td>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.tdAmount}>{formatAmount(item.total_sales)}</td>
                      <td style={styles.td}>
                        <div style={styles.percentageContainer}>
                          <div style={styles.percentageBar}>
                            <div 
                              style={{
                                ...styles.percentageFill,
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                          <span style={styles.percentageText}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={styles.footerRow}>
                  <td colSpan="2" style={styles.footerLabel}>TOTAL GENERAL</td>
                  <td style={styles.footerAmount}>{formatAmount(getTotalSales())}</td>
                  <td style={styles.footerPercentage}>100%</td>
                </tr>
              </tfoot>
            </table>
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
    marginBottom: "30px",
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
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  summaryCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "10px",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: "28px",
    color: "#646cff",
    fontWeight: "bold",
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
  tdNumber: {
    padding: "15px",
    fontSize: "14px",
    color: "#666",
    fontWeight: "600",
    width: "60px",
  },
  tdAmount: {
    padding: "15px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#27ae60",
  },
  percentageContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  percentageBar: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  percentageFill: {
    height: "100%",
    backgroundColor: "#646cff",
    transition: "width 0.5s ease",
  },
  percentageText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    minWidth: "50px",
  },
  footerRow: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },
  footerLabel: {
    padding: "15px",
    fontSize: "14px",
    textTransform: "uppercase",
    color: "#333",
  },
  footerAmount: {
    padding: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#27ae60",
  },
  footerPercentage: {
    padding: "15px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
};

export default SalesReport;