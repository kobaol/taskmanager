import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useToast } from "../ui/Toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      toast.push({ title: "Konto utworzone", desc: "Teraz zaloguj się do systemu." });
      nav("/login");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Nie udało się zarejestrować");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ marginTop: 24 }}>
      <div className="col6">
        <div className="card card-pad">
          <h2 style={{ margin: 0, marginBottom: 12 }}>Rejestracja</h2>
          <form className="col" onSubmit={onSubmit}>
            <div className="col" style={{ gap: 6 }}>
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@test.com" />
            </div>
            <div className="col" style={{ gap: 6 }}>
              <div className="label">Hasło</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimum 6 znaków" />
              <div className="label">(backend wymaga 6+ znaków; bcrypt ma limit 72 bajty)</div>
            </div>
            <button className="btn primary" disabled={loading} type="submit">
              {loading ? "Tworzenie…" : "Utwórz konto"}
            </button>
            {error ? <div style={{ color: "var(--danger)" }}>{error}</div> : null}
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Masz już konto? <Link to="/login">Zaloguj się</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="col6">
        <div className="card card-pad">
          <h3 style={{ margin: 0, marginBottom: 8 }}>Wskazówka</h3>
          <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>
            Do testów możesz szybko utworzyć kilku użytkowników i sprawdzić, że dostęp do cudzych danych jest ograniczony przez JWT.
          </div>
        </div>
      </div>
    </div>
  );
}