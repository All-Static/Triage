import { useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  Layers,
  LayoutDashboard,
  FileSpreadsheet,
  Settings as SettingsIcon,
  PanelLeftClose,
  Menu,
} from "lucide-react";
import { ProjectContext, ProjectSelector, useData } from "./components/UI";
import * as api from "./services/api";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
const navigation = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/configuration", label: "Configuration", icon: SettingsIcon },
  { path: "/results", label: "Results", icon: FileSpreadsheet },
];
export default function App() {
  const { data: projects } = useData(api.getProjects, []);
  const [projectId, setProjectId] = useState("");
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const current =
    navigation.find((n) =>
      n.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(n.path),
    )?.label ?? "Dashboard";
  return (
    <ProjectContext.Provider
      value={{ projects: projects ?? [], projectId, setProjectId }}
    >
      <div className="app">
        <aside className={`sidebar ${menu ? "open" : ""}`}>
          <Link to="/" className="brand">
            <span className="brand-icon">
              <Layers size={23} />
            </span>
            <span>
              Triage Tool<span className="brand-sub"></span>
            </span>
          </Link>
          <div className="nav-label">WORKSPACE</div>
          <nav>
            {navigation.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => setMenu(false)}
              >
                <Icon size={19} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="main-shell">
          <header className="header">
            <div className="breadcrumb">
              <button
                className="mobile-menu icon-button"
                aria-label="Toggle navigation"
                onClick={() => setMenu(!menu)}
              >
                <Menu size={22} />
              </button>
              <span>Triage Assistant</span>
              <span className="slash">/</span>
              <b>{current}</b>
            </div>
            <div className="header-right">
              <ProjectSelector />
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Dashboard key={projectId} />} />
              <Route
                path="/configuration"
                element={<Settings key={projectId} />}
              />
              <Route path="/results" element={<Results key={projectId} />} />
              <Route
                path="/settings"
                element={<Navigate to="/configuration" replace />}
              />
              <Route path="/builds/*" element={<Navigate to="/" replace />} />
              <Route
                path="/failures/*"
                element={<Navigate to="/results" replace />}
              />
              <Route
                path="/history"
                element={<Navigate to="/results" replace />}
              />
              <Route
                path="*"
                element={
                  <div className="empty">
                    <h1>Page not found</h1>
                    <Link to="/">Return to dashboard</Link>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </ProjectContext.Provider>
  );
}
