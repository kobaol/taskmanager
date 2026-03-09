import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { online, syncNow } from "../sync/sync";
import { useToast } from "./Toast";

export default function Layout({ children }) {
  const { isAuthed, me, logout } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [isOnline, setIsOnline] = useState(online());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  async function doSync() {
    if (!isOnline) {
      toast.push({ title: "Offline", desc: "Synchronizacja jest niedostępna bez internetu." });
      return;
    }
    setSyncing(true);
    try {
      await syncNow();
      toast.push({ title: "Gotowe", desc: "Dane zostały zsynchronizowane." });
    } catch (e) {
      toast.push({ title: "Błąd synchronizacji", desc: e?.response?.data?.detail || e?.message });
    } finally {
      setSyncing(false);
    }
  }

  function onLogout() {
    logout();
    nav("/login");
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to={isAuthed ? "/" : "/login"}>
            Task Manager
          </Link>
          <span className={`pill ${isOnline ? "ok" : "bad"}`}>{isOnline ? "online" : "offline"}</span>
          {isAuthed ? (
            <>
              <NavLink to="/" className="pill" style={{ textDecoration: "none" }}>
                Projekty
              </NavLink>
              <button className="btn" onClick={doSync} disabled={syncing} title="Synchronizuj lokalne zmiany">
                {syncing ? "Sync…" : "Sync"}
              </button>
              <div className="spacer" />
              <span className="pill">{me?.email || "…"}</span>
              <button className="btn" onClick={onLogout}>
                Wyloguj się
              </button>
            </>
          ) : (
            <>
              <div className="spacer" />
              <NavLink to="/login" className="pill" style={{ textDecoration: "none" }}>
                Logowanie
              </NavLink>
              <NavLink to="/register" className="pill" style={{ textDecoration: "none" }}>
                Rejestracja
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  );
}