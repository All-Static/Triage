import { useState } from "react";
import { FileSpreadsheet, LoaderCircle, ExternalLink } from "lucide-react";
import * as api from "../services/api";
import { resolveWorkbookUrl } from "../services/workbook";
import { useData } from "./UI";

export default function WorkbookAction({
  projectId,
  runId,
}: {
  projectId: string;
  runId?: string;
}) {
  const { data, error } = useData(
    () => api.getWorkbookAccess(projectId, runId),
    [projectId, runId],
  );
  const [showMessage, setShowMessage] = useState(false);
  let url: string | null = null;
  let linkError = error;
  if (data) {
    try {
      url = resolveWorkbookUrl(data, window.location.origin);
    } catch {
      linkError =
        "Workbook access is unavailable. The backend must supply a valid web link or download endpoint.";
    }
  }
  return (
    <div style={{ maxWidth: 300 }}>
      {url ? (
        <a
          className="secondary"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileSpreadsheet size={16} />
          Open Triage Workbook
          <ExternalLink size={14} />
        </a>
      ) : (
        <button
          className="secondary"
          type="button"
          disabled={!data && !error}
          onClick={() => setShowMessage(true)}
          aria-describedby={showMessage ? "workbook-message" : undefined}
        >
          {!data && !error ? (
            <LoaderCircle className="spin" size={16} />
          ) : (
            <FileSpreadsheet size={16} />
          )}
          Open Triage Workbook
        </button>
      )}
      {showMessage && (
        <p
          id="workbook-message"
          role="status"
          className={linkError ? "error" : "muted"}
          style={{ fontSize: 11, marginTop: 8 }}
        >
          {linkError ||
            data?.message ||
            "No workbook location is available yet."}
        </p>
      )}
    </div>
  );
}
