import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  { register } from "../services/api";
import { toast } from "react-toastify";
const s = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#0d0d0f",
    padding: "24px 16px",
  },
  container: { width: "100%", maxWidth: 400 },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(108,99,255,0.1)",
    border: "1px solid rgba(108,99,255,0.25)",
    borderRadius: 20,
    padding: "4px 12px",
    marginBottom: 14,
  },
  dot: { width: 6, height: 6, borderRadius: "50%", background: "#6c63ff" },
  badgeText: {
    fontSize: "0.5rem",
    color: "#6c63ff",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "'JetBrains Mono', monospace",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#e8e8f0",
    marginBottom: 6,
    fontFamily: "'Syne', sans-serif",
  },
  subtitle: {
    fontSize: "0.55rem",
    color: "#6b6b80",
    lineHeight: 1.7,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 24,
  },
  card: {
    background: "#16161a",
    border: "1px solid #2a2a35",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  label: {
    display: "block",
    fontSize: "0.48rem",
    color: "#6b6b80",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 6,
    fontFamily: "'JetBrains Mono', monospace",
  },
  fieldWrap: { position: "relative", marginBottom: 4 },
  input: {
    width: "100%",
    background: "#1c1c22",
    border: "1px solid #2a2a35",
    borderRadius: 6,
    padding: "10px 12px 10px 36px",
    color: "#e8e8f0",
    fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  iconLeft: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b6b80",
    fontSize: "0.7rem",
    pointerEvents: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b6b80",
    fontSize: "0.75rem",
    padding: 0,
  },
  errorText: {
    fontSize: "0.45rem",
    color: "#ef4444",
    marginTop: 4,
    marginBottom: 10,
    fontFamily: "'JetBrains Mono', monospace",
  },
  fieldGroup: { marginBottom: 6 },
  btn: {
    width: "100%",
    padding: "11px",
    border: "none",
    borderRadius: 7,
    color: "#fff",
    fontSize: "0.6rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    marginTop: 8,
    transition: "all 0.25s",
  },
  footer: {
    textAlign: "center",
    fontSize: "0.5rem",
    color: "#6b6b80",
    marginTop: 16,
    fontFamily: "'JetBrains Mono', monospace",
  },
  link: { color: "#6c63ff", cursor: "pointer", fontWeight: 700 },
};

function Field({ label, type = "text", placeholder, icon, value, onChange, error }) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";

  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{label}</label>
      <div style={s.fieldWrap}>
        <span style={s.iconLeft}>{icon}</span>
        <input
          type={isPass && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            ...s.input,
            paddingRight: isPass ? 36 : 12,
            borderColor: error ? "#ef4444" : "#2a2a35",
          }}
          onFocus={(e) => (e.target.style.borderColor = error ? "#ef4444" : "#6c63ff")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#ef4444" : "#2a2a35")}
        />
        {isPass && (
          <button style={s.eyeBtn} onClick={() => setShow(!show)} type="button">
            {show ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {error && <div style={s.errorText}>⚠ {error}</div>}
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
   const navigate=useNavigate()
  function onSwitchToLogin(){

    try {
      
      navigate("/")
    } catch (error) {
       toast.error("User already exits")
    }
  }
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Min 3 characters";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min 6 characters";
    return e;
  };


    const handleSubmit = async () => {
  const e = validate();
  setErrors(e);
  if (Object.keys(e).length) return;

  try {
    setLoading(true);

    const res = await register(form)

    console.log(res.data);

    setSuccess(true);

    // redirect after success
    setTimeout(() => {
      navigate("/");
    }, 1500);

  } catch (err) {
    console.error(err);

    // axios error handling
    const message =
      err.response?.data?.message || "Something went wrong";

    setErrors({ api: message });
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={s.wrapper}>
      <div style={s.container}>

        <div style={s.badge}>
          <span style={s.dot}></span>
          <span style={s.badgeText}>New Account</span>
        </div>

        <h1 style={s.title}>Create Account</h1>
        <p style={s.subtitle}>
          Join the DevOps control panel and manage your deployments.
        </p>

        <div style={s.card}>
          <Field
            label="Username"
            placeholder="karan_dev"
            icon="◈"
            value={form.username}
            onChange={set("username")}
            error={errors.username}
          />
          <Field
            label="Email Address"
            placeholder="you@devops.io"
            icon="@"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
            icon="⚿"
            value={form.password}
            onChange={set("password")}
            error={errors.password}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              ...s.btn,
              background: success ? "#22c55e" : "#6c63ff",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "◌  Creating..." : success ? "✓  Account Created!" : "+  Register"}
          </button>
        </div>

        <p style={s.footer}>
          Already have an account?{" "}
          <span style={s.link} onClick={onSwitchToLogin}>Sign In →</span>
        </p>
      </div>
    </div>
  );
}