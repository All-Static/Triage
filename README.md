# Triage Assistant

React + TypeScript + Vite frontend for the existing Python triage tool. The established styling is preserved.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Disconnected state

No backend is connected. There are no fixtures, generated runs, sample projects, or simulated connection tests. Project selection and Results show empty states. Configuration and run fields begin blank. Save Configuration and Run Triage report backend unavailability without saving configuration or creating a run.

Jenkins tokens use password inputs and are held only in component state while editing. No credentials are persisted to browser storage. URL placeholders `{env}` and `{job_id}` are preserved literally.

## Integration boundary

All data access is isolated in `src/services/api.ts`. Replace the disconnected methods with FastAPI requests after confirming the backend contracts. Configuration submissions have the shape `{ jenkins: { base_url, username, token } }`. Run parameters contain user-entered `environment` and `buildNumber`.

The architecture remains React → FastAPI → existing Python tool → Jenkins / existing ML workflow → existing Excel workbook. Python owns `config.yml`; React never creates or modifies it. `config.yml` is excluded by `.gitignore` in this frontend directory. The Python repository must also exclude its own configuration file.

Results and execution output display only backend-provided data. Workbook links can be supplied as HTTP/HTTPS `workbookUrl` or a `downloadUrl` served by the backend. No local workbook path is hardcoded. Excel remains the place to review and edit detailed triage data.

No Python code, Excel schema, ML logic, or existing training process is modified.
