import { useState } from "react";
import { useNavigate } from "react-router-dom";


const API_BASE = "http://0.0.0.0:8000";

function Home() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [backendStatus, setBackendStatus] = useState("");
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [postResponse, setPostResponse] = useState(null);
  const [isListening, setIsListening] = useState(false);


  // Voice to text
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  // Get all reminders
  const loadReminders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/all/reminders/`);
      const data = await res.json();
      setReminders(data);
    } catch {
      setError("Failed to load reminders");
    }
  };

  // Create reminder
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
        <div style={styles.logo}>Schedule</div>
        <button style={styles.navBtn} onClick={() => navigate("/schedules")}>
          View All Schedules
        </button>
      </div>

      <div style={styles.content}>
        {/* MAIN CARD */}
        <div style={styles.card}>
          <h2 style={styles.title}>Schedule Messages.</h2>
          <p style={styles.subtitle}>Enter a message and we'll handle the scheduling for you.</p>

          <div style={styles.formGroup}>
            <label style={styles.label}>User ID</label>
            <input
              style={styles.input}
              placeholder="e.g. 1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Reminder Text</label>
              <button 
                style={{
                  ...styles.micBtn,
                  background: isListening ? "#ef4444" : "#1e293b",
                  borderColor: isListening ? "#ef4444" : "#334155"
                }} 
                onClick={handleVoiceInput}
                title="Speak your reminder"
              >
                {isListening ? "⏹ Listening..." : "🎤 Speak"}
              </button>
            </div>
            <textarea
              style={styles.textarea}
              placeholder="e.g. Remind me to call Mom tomorrow at 10am"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            style={{
              ...styles.primaryBtn,
              opacity: loading || !userId || !text ? 0.6 : 1,
              cursor: loading || !userId || !text ? "not-allowed" : "pointer"
            }}
            disabled={loading || !userId || !text}
            onClick={scheduleReminder}
          >
            {loading ? "Scheduling..." : "Schedule Reminder"}
          </button>

          {postResponse && (
            <div style={styles.successBox}>
              <div style={styles.successHeader}>
                <span style={{ fontSize: "18px" }}>✅</span>
                <strong>Scheduled Successfully</strong>
              </div>
              <div style={styles.successContent}>
                <div style={styles.successItem}><span>User ID:</span> <span>{postResponse.user_id}</span></div>
                <div style={styles.successItem}><span>Text:</span> <span>{postResponse.original_text}</span></div>
                <div style={styles.successItem}><span>Scheduled Time:</span> <span>{postResponse.scheduled_time}</span></div>
              </div>
            </div>
          )}
          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {/* RECENT REMINDERS */}
        {reminders.length > 0 && (
          <div style={styles.tableCard}>
            <h3 style={styles.tableTitle}>Recent Schedules</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headerRow}>
                    <th style={styles.th}>User ID</th>
                    <th style={styles.th}>Text</th>
                    <th style={styles.th}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.slice(0, 5).map((r, i) => (
                    <tr key={i} style={styles.row}>
                      <td style={styles.td}>{r.user_id}</td>
                      <td style={styles.td}>{r.original_text}</td>
                      <td style={styles.td}>{r.scheduled_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
    fontFamily: "'Inter', sans-serif",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "rgba(2, 6, 23, 0.8)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #1e293b",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    background: "linear-gradient(to right, #60a5fa, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navBtn: {
    padding: "8px 16px",
    background: "#1e293b",
    color: "#cbd5e1",
    border: "1px solid #334155",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  card: {
    padding: "32px",
    background: "rgba(30, 41, 59, 0.4)",
    borderRadius: "16px",
    border: "1px solid #1e293b",
    marginBottom: "32px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    textAlign: "center",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: "16px",
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: "32px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#94a3b8",
  },
  labelContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  micBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    background: "#1e293b",
    color: "#cbd5e1",
    border: "1px solid #334155",
    borderRadius: "14px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none",
    minHeight: "100px",
    resize: "vertical",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
    transition: "background 0.2s",
  },
  successBox: {
    marginTop: "24px",
    background: "rgba(20, 83, 45, 0.2)",
    border: "1px solid #166534",
    borderRadius: "12px",
    padding: "20px",
  },
  successHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    color: "#4ade80",
  },
  successContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  successItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#cbd5e1",
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px",
    background: "rgba(153, 27, 27, 0.2)",
    border: "1px solid #991b1b",
    borderRadius: "8px",
    color: "#f87171",
    textAlign: "center",
  },
  tableCard: {
    background: "rgba(30, 41, 59, 0.2)",
    borderRadius: "16px",
    border: "1px solid #1e293b",
    padding: "24px",
  },
  tableTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#f8fafc",
  },
  tableContainer: {
    background: "rgba(15, 23, 42, 0.4)",
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
  },
  th: {
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#94a3b8",
  },
  row: {
    borderBottom: "1px solid #1e293b",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#cbd5e1",
  },
};

export default Home;
