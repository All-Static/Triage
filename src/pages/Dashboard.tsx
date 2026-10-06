import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, LoaderCircle } from "lucide-react";
import * as api from "../services/api";
import type { TriageRun } from "../types";
import ExecutionOutput from "../components/ExecutionOutput";
import { PageHeading, useProject, Badge } from "../components/UI";
export default function Dashboard() {
  const { projectId } = useProject();
  const [input, setInput] = useState("");
  const [environment, setEnvironment] = useState("");
  const [run, setRun] = useState<TriageRun | null>(null);
  const [starting, setStarting] = useState(false);
  const [startFailed, setStartFailed] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .getLatestRun(projectId)
      .then((value) => {
        if (active) setRun(value);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : "Unable to load run status.",
          );
      });
    return () => {
      active = false;
    };
  }, [projectId]);
  useEffect(() => {
    if (!run || run.status === "Complete" || run.status === "Failed") return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const next = await api.getTriageRun(projectId, run!.id);
        if (!active) return;
        setRun(next);
        if (next.status !== "Complete" && next.status !== "Failed")
          timer = setTimeout(poll, 350);
      } catch (e) {
        if (active) {
          const message =
            e instanceof Error ? e.message : "Unable to retrieve run status.";
          setError(message);
          setRun((r) => (r ? { ...r, status: "Failed", error: message } : r));
        }
      }
    }
    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [projectId, run?.id]);
  const running =
    starting || (!!run && run.status !== "Complete" && run.status !== "Failed");
  async function start() {
    setError("");
    if (!environment.trim()) {
      setError("Enter an environment.");
      return;
    }
    if (
      !/^\d+$/.test(input) ||
      !Number.isSafeInteger(Number(input)) ||
      Number(input) < 1
    ) {
      setError("Enter a valid positive Jenkins build number.");
      return;
    }
    setStarting(true);
    setStartFailed(false);
    try {
      setRun(
        await api.startTriage(projectId, {
          environment,
          buildNumber: Number(input),
        }),
      );
    } catch (e) {
      setRun(null);
      setStartFailed(false);
      setError(e instanceof Error ? e.message : "Unable to start triage.");
    } finally {
      setStarting(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="putting a placeholder here idk to write(might not need)"
        title="Run Triage"
        description="also dont know what to write yet(might not need)"
      />
      <section className="analysis-panel">
        <div className="analysis-intro">
          <span className="analysis-symbol">
            <Play size={21} />
          </span>
          <div>
            <h3>Start with a build</h3>
            <p>
              Retrieve Jenkins data and run the existing ML triage workflow.
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void start();
          }}
        >
          <label className="field">
            Environment
            <input
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="Enter environment"
              disabled={running}
              autoComplete="off"
            />
          </label>
          <label className="field">
            Build Number
            <div className="build-input">
              <span>#</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                inputMode="numeric"
                aria-invalid={!!error}
                aria-describedby={error ? "run-error" : undefined}
                placeholder="Enter build number"
                disabled={running}
              />
            </div>
          </label>
          <button className="primary" disabled={running}>
            {running ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Play size={17} />
            )}
            Run Triage{!running && <ArrowRight size={16} />}
          </button>
        </form>
        <div
          className="table-footer"
          style={{ padding: "15px 0 0", border: 0 }}
        >
          <Link to="/configuration">Jenkins configuration ↗</Link>
        </div>
        {error && (
          <p id="run-error" className="error" role="alert">
            {error}
          </p>
        )}
      </section>
      <div className="section-heading">
        <div>
          <h2>Run Status</h2>
          <p>Status from the triage operation.</p>
        </div>
      </div>
      <section className="surface detail-section">
        <div className="result-heading" style={{ margin: 0 }} role="status">
          <div>
            {running && <LoaderCircle className="spin" size={17} />}
            <Badge
              tone={
                startFailed || run?.status === "Failed"
                  ? "red"
                  : run?.status === "Complete"
                    ? "green"
                    : "blue"
              }
            >
              {starting
                ? "Starting triage..."
                : startFailed
                  ? "Failed"
                  : (run?.status ?? "Ready")}
            </Badge>
            {run && (
              <b>
                {run.environment} · Build #{run.buildNumber}
              </b>
            )}
          </div>
          {run?.status === "Complete" && (
            <Link className="secondary" to="/results">
              View Results
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
        {run && (
          <p className="muted" style={{ fontSize: 11, margin: "14px 0 0" }}>
            Run {run.id}
          </p>
        )}
        {run?.error && (
          <p className="error" role="alert">
            {run.error}
          </p>
        )}
      </section>
      <ExecutionOutput messages={run?.output} />
    </>
  );
}
