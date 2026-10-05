export interface Project {
  id: string;
  name: string;
}
export type RunStatus =
  | "Starting triage..."
  | "Retrieving Jenkins data..."
  | "Processing..."
  | "Complete"
  | "Failed";
export interface TriageRun {
  id: string;
  projectId: string;
  buildNumber: number;
  environment: string;
  status: RunStatus;
  error?: string;
  outputWorkbookName?: string;
  outputLocation?: string;
  summary?: string;
  output?: string[];
}
export interface WorkbookAccess {
  workbookUrl: string | null;
  downloadUrl: string | null;
  message: string;
}
export interface JenkinsConfiguration {
  base_url: string;
  username: string;
  token: string;
}
export interface Configuration {
  jenkins: JenkinsConfiguration;
}
export interface RunParameters {
  environment: string;
  buildNumber: number;
}
