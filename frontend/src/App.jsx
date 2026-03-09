import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./ui/Layout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProjectsPage from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetail";
import { useAuth } from "./auth/AuthContext";

function Private({ children }) {
  const { isAuthed, loadingMe } = useAuth();
  if (loadingMe) {
    return (
      <div className="card card-pad">
        <b>Перевіряємо сесію…</b>
        <div style={{ color: "var(--muted)", marginTop: 6 }}>Якщо це триває довго — перевірте, чи запущений бекенд.</div>
      </div>
    );
  }
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Private>
              <ProjectsPage />
            </Private>
          }
        />
        <Route
          path="/projects/:projectKey"
          element={
            <Private>
              <ProjectDetailPage />
            </Private>
          }
        />
        <Route path="/login" element={isAuthed ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthed ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
