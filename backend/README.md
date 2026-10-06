# Local FastAPI backend

Run these commands from the project root with Python 3.10 or newer.

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt
backend/.venv/Scripts/python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Using the virtual environment's Python directly avoids needing to activate it.
On macOS/Linux use `backend/.venv/bin/python` instead of
`backend/.venv/Scripts/python`.

Check `http://127.0.0.1:8000/api/health` for `{"status":"ok"}`.
Interactive API documentation is at `http://127.0.0.1:8000/docs`.
Run `npm run dev` in a separate terminal for the existing frontend.

## Frontend contracts

The frontend is unchanged and still uses disconnected methods in
`src/services/api.ts`. When ready, replace those method bodies with `fetch`
calls to `http://127.0.0.1:8000/api`, using this mapping:

| Frontend method | HTTP route | Current behavior |
| --- | --- | --- |
| `getProjects()` | `GET /api/projects` | `[]` |
| `getConfiguration(projectId)` | `GET /api/projects/{projectId}/configuration` | `null` |
| `saveConfiguration(projectId, value)` | `PUT /api/projects/{projectId}/configuration` | 503, storage not configured |
| `getLatestRun(projectId)` | `GET /api/projects/{projectId}/triage/latest` | `null` |
| `startTriage(projectId, parameters)` | `POST /api/projects/{projectId}/triage` | 503, triage/ML not configured |
| `getTriageRun(projectId, runId)` | `GET /api/projects/{projectId}/triage/{runId}` | 503, result storage not configured |
| `getWorkbookAccess(projectId, runId?)` | `GET /api/projects/{projectId}/workbook?run_id={runId}` | Null URLs with an explanatory message |

The Jenkins adapter also exposes
`GET /api/projects/{projectId}/jenkins/builds/{buildNumber}?environment={environment}`;
it currently returns 503. Omit the workbook query parameter when no run is selected.
URL-encode project/run IDs and query values when connecting the frontend.

JSON request bodies match existing TypeScript types:

```text
Configuration: { "jenkins": { "base_url": "...", "username": "...", "token": "..." } }
Run parameters: { "environment": "...", "buildNumber": <positive integer> }
```

Send `Content-Type: application/json` for POST/PUT. Check `response.ok` before
reading a success response; errors have a `detail` field (validation errors
return 422). Never treat a 503 response as a saved configuration or created run.
Run responses keep the camelCase fields and status strings from
`src/types/index.ts`. CORS allows localhost and 127.0.0.1 on port 5173.

## Connect existing Python code later

- `services/configuration.py`: load real projects and connect the existing
  configuration reader/writer. No storage is implemented now.
- `services/jenkins.py`: import existing Jenkins functions inside `get_build`;
  resolve connection settings server-side.
- `services/triage.py`: call the Jenkins adapter and existing Python triage/ML
  workflow in `start_triage`, then expose real status, results, predictions or
  classifications via the run/result functions. No separate prediction contract
  is invented before the existing ML inputs/outputs are known. Connect workbook
  access here too.
- `models/schemas.py`: shared Pydantic contracts corresponding to frontend types.
- `routers/api.py`: maps HTTP requests to those service functions.

Flow: React → FastAPI route → service → existing Python code → response → React.
There are no simulated projects, builds, runs, models, or saved credentials.
Health reports that the API is running, not that Jenkins/ML is connected.

`backend/.env.example` documents optional settings. The app reads exported
environment variables; it does not automatically load `.env`. For example,
set `$env:CORS_ORIGINS = "http://localhost:5173"` before starting Uvicorn.
The empty Jenkins variables are reserved for later and currently unused.

Environment files, virtual environments, private keys, credential/token files,
local `config.yml`/`config.yaml`, and backend data/output directories are ignored.
Keep future generated configs and workbooks inside the ignored directories.
The Jenkins token uses `SecretStr` to mask accidental representations and JSON
responses. When connecting storage, do not return the real token; an unchanged
masked token must preserve the saved credential instead of overwriting it.
