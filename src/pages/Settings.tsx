import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import * as api from "../services/api";
import type { Configuration } from "../types";
import {
  useProject,
  PageHeading,
  LoadingState,
  EmptyState,
} from "../components/UI";
export default function Settings() {
  const { projectId } = useProject();
  const [config, setConfig] = useState<Configuration>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");
  useEffect(() => {
    let active = true;
    api
      .getConfiguration(projectId)
      .then((value) => {
        if (active) setConfig(value ?? { jenkins: { base_url: "", username: "", token: "" } });
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : "Unable to load configuration.",
          );
      });
    return () => {
      active = false;
    };
  }, [projectId]);
  async function save() {
    if (!config) return;
    setBusy("save");
    setError("");
    setMessage("");
    try {
      setConfig(await api.saveConfiguration(projectId, config));
      setMessage(
        "Configuration saved.",
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to save configuration.",
      );
    } finally {
      setBusy("");
    }
  }
  function update(key: keyof Configuration["jenkins"], value: string) {
    if (config) setConfig({ jenkins: { ...config.jenkins, [key]: value } });
    setMessage("");
  }
  return (
    <>
      <PageHeading
        eyebrow="TOOL SETUP"
        title="Configuration"
        description="Configuration for the existing Python triage tool."
      />
      {!config ? (
        error ? (
          <EmptyState>{error}</EmptyState>
        ) : (
          <LoadingState />
        )
      ) : (
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <section className="surface settings-section">
            <div className="settings-description">
              <h2>Jenkins Configuration</h2>
              <p>Enter the connection values for your Jenkins installation.</p>
            </div>
            <div className="settings-fields">
              <div className="field-grid">
                <label className="field">
                  Jenkins Base URL
                  <input
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                    required
                    placeholder="Enter Jenkins base URL"
                    value={config.jenkins.base_url}
                    onChange={(e) => update("base_url", e.target.value)}
                    aria-describedby="url-templates"
                  />
                </label>
                <label className="field">
                  Jenkins Username
                  <input
                    autoComplete="off"
                    spellCheck={false}
                    required
                    placeholder="Enter Jenkins username"
                    value={config.jenkins.username}
                    onChange={(e) => update("username", e.target.value)}
                  />
                </label>
                <label className="field">
                  Jenkins API Token
                  <input
                    type="password"
                    autoComplete="off"
                    required
                    placeholder="Enter Jenkins API token"
                    value={config.jenkins.token}
                    onChange={(e) => update("token", e.target.value)}
                  />
                </label>
              </div>
              <small id="url-templates" className="muted">
                {
                  "Base URL templates may include {env} and {job_id}. Placeholders are preserved exactly as entered."
                }
              </small>
              <small className="muted">
                The token remains masked and is not saved to browser storage.
              </small>
            </div>
          </section>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="save-bar">
            <div className="success-message" role="status">
              {message}
            </div>
            <button className="primary" disabled={!!busy}>
              <Save size={16} />
              {busy === "save" ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
