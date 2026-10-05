import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, ArrowRight } from "lucide-react";
import * as api from "../services/api";
import type { TriageRun } from "../types";
import {
  PageHeading,
  useProject,
  LoadingState,
  EmptyState,
  Badge,
} from "../components/UI";
import WorkbookAction from "../components/WorkbookAction";
import ExecutionOutput from "../components/ExecutionOutput";
export default function Results() {
  const { projectId } = useProject();
  const [run, setRun] = useState<TriageRun | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const value = await api.getLatestRun(projectId);
        if (!active) return;
        setRun(value);
        if (value && value.status !== "Complete" && value.status !== "Failed")
          timer = setTimeout(poll, 350);
      } catch (e) {
        if (active)
          setError(e instanceof Error ? e.message : "Unable to load results.");
      }
    }
    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [projectId]);
  return (
    <>
      <PageHeading
        eyebrow="TRIAGE OUTPUT"
        title="Results"
        description="Review and update triage data in the existing Excel workbook."
      />
      {error ? (
        <EmptyState>{error}</EmptyState>
      ) : run === undefined ? (
        <LoadingState />
      ) : (
        <>
          <section className="surface detail-section">
            <h2>
              <FileSpreadsheet size={19} />
              Triage Workbook
            </h2>
            <p>
              The workbook remains the place to review and edit the triage data
              used by the existing ML workflow.
            </p>
            {run ? (
              <div className="result-heading">
                <div>
                  <b>
                    {run.environment} · Build #{run.buildNumber}
                  </b>
                  <Badge
                    tone={
                      run.status === "Complete"
                        ? "green"
                        : run.status === "Failed"
                          ? "red"
                          : "blue"
                    }
                  >
                    {run.status}
                  </Badge>
                </div>
                <small>Run {run.id}</small>
              </div>
            ) : (
              <p className="muted">
                No triage results are available. Connect the backend and run triage to view its output.
              </p>
            )}
            {run?.error && (
              <p className="error" role="alert">
                {run.error}
              </p>
            )}
            {run?.status === "Complete" && (
              <>
                {(run.outputWorkbookName || run.outputLocation) && (
                  <dl>
                    {run.outputWorkbookName && (
                      <>
                        <dt>Output workbook</dt>
                        <dd style={{ overflowWrap: "anywhere" }}>
                          {run.outputWorkbookName}
                        </dd>
                      </>
                    )}
                    {run.outputLocation && (
                      <>
                        <dt>Output location</dt>
                        <dd style={{ overflowWrap: "anywhere" }}>
                          {run.outputLocation}
                        </dd>
                      </>
                    )}
                  </dl>
                )}
                {run.summary && <p>{run.summary}</p>}
              </>
            )}
            <WorkbookAction
              key={projectId + (run?.id ?? "")}
              projectId={projectId}
              runId={run?.id}
            />
            <Link className="detail-link" to="/">
              Run Triage
              <ArrowRight size={16} />
            </Link>
          </section>
          <ExecutionOutput messages={run?.output} />
        </>
      )}
    </>
  );
}
