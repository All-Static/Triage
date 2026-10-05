// Disconnected service boundary. Replace these methods with FastAPI calls once
// its contracts are confirmed. Empty reads represent unavailable backend data.
import type { Configuration, Project, RunParameters, TriageRun, WorkbookAccess } from "../types";
export const backendUnavailable = "Backend not connected. This operation is unavailable until FastAPI is connected.";
export async function getProjects(): Promise<Project[]> { return []; }
export async function getLatestRun(_projectId: string): Promise<TriageRun | null> { return null; }
export async function getConfiguration(_projectId: string): Promise<Configuration | null> { return null; }
export async function startTriage(_projectId: string, _parameters: RunParameters): Promise<TriageRun> { throw new Error(backendUnavailable); }
export async function getTriageRun(_projectId: string, _runId: string): Promise<TriageRun> { throw new Error(backendUnavailable); }
export async function saveConfiguration(_projectId: string, _value: Configuration): Promise<Configuration> { throw new Error(backendUnavailable); }
export async function getWorkbookAccess(_projectId: string, _runId?: string): Promise<WorkbookAccess> {
  return { workbookUrl: null, downloadUrl: null, message: "No workbook is available. Connect the backend to access triage output." };
}
