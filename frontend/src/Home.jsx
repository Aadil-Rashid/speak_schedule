import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
const API_BASE = "http://0.0.0.0:8000";

function Home() {
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [backendStatus, setBackendStatus] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [postResponse, setPostResponse] = useState(null);

  // 1️⃣ Check backend health
  const checkBackend = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      const data = await res.json();
      setBackendStatus(data.status || "Backend is up");
    } catch {
      setBackendStatus("Backend not reachable");
    }
  };

  // 2️⃣ Get all reminders
  const loadReminders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/all/reminders/`);
      const data = await res.json();
      setReminders(data);
    } catch {
      setError("Failed to load reminders");
    }
  };

  // 3️⃣ Create reminder
  const scheduleReminder = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    setPostResponse(null);

    try {
      const res = await fetch(`${API_BASE}/api/reminders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          raw_text: text,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);

      // ✅ ONLY show POST response
      setPostResponse(data);
      setText("");
    } catch (err) {
      setError(err.message || "Failed to schedule reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={checkBackend}>
          Is Backend Up?
        </button>
        <button style={styles.navBtn} onClick={() => navigate("/schedules")}>
          Get Schedules
        </button>
        <span style={styles.status}>{backendStatus}</span>
      </div>

      {/* MAIN CARD */}
      <div style={styles.card}>
        <h2>Speak it. Schedule it. Done.</h2>

        <input
          style={styles.input}
          placeholder="User ID (e.g. 1)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Schedule text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          style={styles.primaryBtn}
          disabled={loading || !userId || !text}
          onClick={scheduleReminder}
        >
          {loading ? "Scheduling..." : "Schedule Reminder"}
        </button>

        {postResponse && (
          <div style={styles.successBox}>
            <strong>Scheduled Successfully</strong>
            <div>User Id: {postResponse.user_id}</div>
            <div>Text: {postResponse.original_text}</div>
            <div>Scheduled Time: {postResponse.scheduled_time}</div>
          </div>
        )}
        {error && <p style={styles.error}>{error}</p>}

        <h4>Scheduled Reminders</h4>
        {reminders.length > 0 && (
          <>
            <h4>Scheduled Reminders</h4>
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
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    color: "#e5e7eb",
  },
  nav: {
    display: "flex",
    gap: 10,
    padding: 12,
    background: "#020617",
    borderBottom: "1px solid #1e293b",
    alignItems: "center",
  },
  navBtn: {
    padding: "6px 12px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  status: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#94a3b8",
  },
  card: {
    maxWidth: 480,
    margin: "40px auto",
    padding: 24,
    background: "rgba(15,23,42,0.9)",
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff",
  },
  primaryBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    background: "#2563eb",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  success: { color: "#22c55e", marginTop: 10 },
  error: { color: "#ef4444", marginTop: 10 },
  successBox: {
    marginTop: 16,
    padding: 12,
    background: "#052e16",
    border: "1px solid #2f6845",
    borderRadius: 6,
    color: "#f2f700",
  },
  table: {
    width: "100%",
    marginTop: 16,
    borderCollapse: "collapse",
  },
};

export default Home;
