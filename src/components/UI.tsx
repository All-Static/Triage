import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LoaderCircle, Search, ChevronDown } from "lucide-react";
import type { Project } from "../types";
export const ProjectContext = createContext<{
  projects: Project[];
  projectId: string;
  setProjectId: (id: string) => void;
}>({ projects: [], projectId: "", setProjectId: () => {} });
export const useProject = () => useContext(ProjectContext);
export function useData<T>(fetcher: () => Promise<T>, dependencies: unknown[]) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  useEffect(() => {
    let current = true;
    setData(undefined);
    setError("");
    fetcher()
      .then((d) => {
        if (current) setData(d);
      })
      .catch((e) => {
        if (current)
          setError(e instanceof Error ? e.message : "Unable to load data.");
      });
    return () => {
      current = false;
    };
  }, dependencies);
  return { data, error };
}
export function ProjectSelector() {
  const { projects, projectId, setProjectId } = useProject();
  return (
    <div className="select-wrap">
      <select
        aria-label="Project"
        disabled={!projects.length}
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
      >
        {!projects.length && <option value="">No projects available</option>}
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown size={14} />
    </div>
  );
}
export function LoadingState({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <div className="loading" role="status">
      <LoaderCircle className="spin" size={22} />
      {label}
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <span className={`badge ${tone}`}>
      <i />
      {children}
    </span>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function StatCard({
  label,
  value,
  note,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: string | number;
  note: string;
  tone?: string;
  icon: ReactNode;
}) {
  return (
    <div className={`stat ${tone}`}>
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
