import { useEffect, useState } from "react";

const API_BASE = "http://0.0.0.0:8000";

function Schedules() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/all/reminders/`);
        const data = await res.json();
        setReminders(data);
      } catch {
        setError("Failed to load schedules");
      }
    };

    fetchReminders();
  }, []);

  return (
    <div style={styles.page}>
      <h2>All Scheduled Reminders</h2>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Text</th>
            <th>Scheduled Time</th>
          </tr>
        </thead>
        <tbody>
          {reminders.map((r, i) => (
            <tr key={i}>
              <td>{r.user_id}</td>
              <td>{r.original_text}</td>
              <td>{r.scheduled_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 40,
    background: "linear-gradient(135deg, #020617, #0f172a)",
    color: "#e5e7eb",
  },
  table: {
    width: "100%",
    marginTop: 20,
    borderCollapse: "collapse",
  },
  error: { color: "#ef4444" },
};

export default Schedules;


