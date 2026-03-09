import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listProjectsLocal, createProject, deleteProject, updateProject } from "../repo/projects";
import { pull, online } from "../sync/sync";
import { useToast } from "../ui/Toast";

function ProjectForm({ initial, onCancel, onSave }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    if (title.trim().length < 2) {
      toast.push({ title: "Sprawdź dane", desc: "Nazwa musi mieć co najmniej 2 znaki." });
      return;
    }
    setLoading(true);
    try {
      await onSave({ title: title.trim(), description: description.trim() });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="col" onSubmit={submit}>
      <div className="col" style={{ gap: 6 }}>
        <div className="label">Nazwa</div>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="col" style={{ gap: 6 }}>
        <div className="label">Opis</div>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" type="button" onClick={onCancel}>
          Anuluj
        </button>
        <button className="btn primary" disabled={loading} type="submit">
          {loading ? "Zapisywanie…" : "Zapisz"}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [busy, setBusy] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [query, setQuery] = useState("");
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => (p.title || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
  }, [projects, query]);

  async function refresh() {
    setBusy(true);
    try {
      if (online()) {
        await pull();
      }
      const list = await listProjectsLocal();
      setProjects(list);
    } catch (e) {
      toast.push({ title: "Błąd", desc: e?.response?.data?.detail || e?.message });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(data) {
    try {
      await createProject(data);
      toast.push({ title: "Projekt utworzony", desc: online() ? "Zapisano na serwerze." : "Zapisano lokalnie (offline)." });
      setCreating(false);
      await refresh();
    } catch (e) {
      toast.push({ title: "Nie udało się utworzyć", desc: e?.response?.data?.detail || e?.message });
    }
  }

  async function onUpdate(key, data) {
    try {
      await updateProject(key, data);
      toast.push({ title: "Zaktualizowano", desc: online() ? "Zmiany wysłane na serwer." : "Zmiany dodane do kolejki (offline)." });
      setEditingKey(null);
      await refresh();
    } catch (e) {
      toast.push({ title: "Nie udało się zaktualizować", desc: e?.response?.data?.detail || e?.message });
    }
  }

  async function onDelete(key) {
    if (!confirm("Usunąć projekt razem z zadaniami?") ) return;
    try {
      await deleteProject(key);
      toast.push({ title: "Usunięto", desc: online() ? "Usunięto na serwerze." : "Usunięcie dodane do kolejki (offline)." });
      await refresh();
    } catch (e) {
      toast.push({ title: "Nie udało się usunąć", desc: e?.response?.data?.detail || e?.message });
    }
  }

  const editing = projects.find((p) => p.key === editingKey);

  return (
    <div className="grid">
      <div className="col12">
        <div className="card card-pad">
          <div className="row" style={{ marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>Projekty</h2>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                {busy ? "Odświeżanie…" : `${projects.length} projekt(y)`}
              </div>
            </div>
            <div className="spacer" />
            <input className="input" style={{ maxWidth: 340 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj…" />
            <button className="btn primary" onClick={() => setCreating(true)}>
              + Nowy
            </button>
            <button className="btn" onClick={refresh} disabled={busy}>
              Odśwież
            </button>
          </div>

          {(creating || editing) ? (
            <div className="grid">
              <div className="col12">
                <div className="card card-pad">
                  <div className="row" style={{ marginBottom: 10 }}>
                    <b>{editing ? "Edycja projektu" : "Nowy projekt"}</b>
                    <div className="spacer" />
                    <span className="pill">{online() ? "server" : "offline"}</span>
                  </div>
                  <ProjectForm
                    initial={editing || null}
                    onCancel={() => {
                      setCreating(false);
                      setEditingKey(null);
                    }}
                    onSave={(data) => (editing ? onUpdate(editing.key, data) : onCreate(data))}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid" style={{ marginTop: 14 }}>
            {filtered.map((p) => (
              <div key={p.key} className="col6">
                <div className="card card-pad">
                  <div className="row">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.description || "Brak opisu"}
                      </div>
                    </div>
                    <div className="spacer" />
                    <span className="pill">{p.serverId ? `id:${p.serverId}` : "local"}</span>
                  </div>

                  <div className="row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
                    <Link className="btn" to={`/projects/${encodeURIComponent(p.key)}`}>
                      Otwórz
                    </Link>
                    <button className="btn" onClick={() => setEditingKey(p.key)}>
                      Edytuj
                    </button>
                    <button className="btn danger" onClick={() => onDelete(p.key)}>
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!busy && filtered.length === 0 ? (
              <div className="col12" style={{ color: "var(--muted)" }}>
                Nic nie znaleziono.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}