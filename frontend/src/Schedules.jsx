import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://0.0.0.0:8000";

function Schedules() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/all/reminders/`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setReminders(data);
          setError("");
        } else {
          setReminders([]);
        }
      } catch {
        setError("Failed to load schedules");
      }
    };

    fetchReminders();
  }, []);

  const clearAllReminders = async () => {
    if (!window.confirm("Are you sure you want to delete ALL reminders?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/all/reminders/`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setReminders([]);
        setError("");
        setMessage(data.message || "All reminders cleared successfully");
      } else {
        throw new Error(data.detail || "Failed to clear reminders");
      }
    } catch (err) {
      setError(err.message || "Failed to clear reminders");
      setMessage("");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2 style={{ margin: 0 }}>All Scheduled Reminders</h2>
        <button 
          style={{
            ...styles.clearBtn,
            opacity: reminders.length === 0 ? 0.5 : 1,
            cursor: reminders.length === 0 ? "not-allowed" : "pointer"
          }} 
          onClick={clearAllReminders}
          disabled={reminders.length === 0}
        >
          Clear All Reminders
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {message && <p style={styles.success}>{message}</p>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Text</th>
              <th style={styles.th}>Scheduled Time</th>
            </tr>
          </thead>
          <tbody>
            {reminders.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ ...styles.td, textAlign: "center", padding: "40px" }}>
                  No reminders scheduled yet.
                </td>
              </tr>
            ) : (
              reminders.map((r, i) => (
                <tr key={i} style={styles.row}>
                  <td style={styles.td}>{r.user_id}</td>
                  <td style={styles.td}>{r.original_text}</td>
                  <td style={styles.td}>{r.scheduled_time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#e5e7eb",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    maxWidth: "800px",
    margin: "0 auto 30px auto",
  },
  backBtn: {
    padding: "8px 16px",
    background: "#1e293b",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  clearBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "auto",
  },
  error: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: "20px",
  },
  success: {
    color: "#22c55e",
    textAlign: "center",
    marginBottom: "20px",
  },
  tableContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "rgba(30, 41, 59, 0.4)",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  headerRow: {
    background: "#1e293b",
    color: "#f8fafc",
  },
  th: {
    padding: "16px",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #334155",
  },
  row: {
    borderBottom: "1px solid #1e293b",
  },
  td: {
    padding: "16px",
    color: "#cbd5e1",
    fontSize: "15px",
  },
};

export default Schedules;


