import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../ui/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("user1@test.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      auth.setToken(data.access_token);
      toast.push({ title: "Zalogowano", desc: "Witamy!" });
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Nie udało się zalogować" );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid" style={{ marginTop: 24 }}>
      <div className="col6">
        <div className="card card-pad">
          <h2 style={{ margin: 0, marginBottom: 12 }}>Logowanie</h2>
          <form className="col" onSubmit={onSubmit}>
            <div className="col" style={{ gap: 6 }}>
              <div className="label">Email</div>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@test.com" />
            </div>
            <div className="col" style={{ gap: 6 }}>
              <div className="label">Hasło</div>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimum 6 znaków" />
            </div>
            <button className="btn primary" disabled={loading} type="submit">
              {loading ? "Logowanie…" : "Zaloguj się"}
            </button>
            {error ? <div style={{ color: "var(--danger)" }}>{error}</div> : null}
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Nie masz konta? <Link to="/register">Zarejestruj się</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="col6">
        <div className="card card-pad">
          <h3 style={{ margin: 0, marginBottom: 8 }}>Tryb offline</h3>
          <div style={{ color: "var(--muted)", lineHeight: 1.5 }}>
            Po zalogowaniu możesz tworzyć/edytować projekty i zadania bez internetu — zmiany
            trafią do lokalnej kolejki i zsynchronizują się przyciskiem <b>Sync</b> po przywróceniu połączenia.
          </div>
        </div>
      </div>
    </div>
  );
}