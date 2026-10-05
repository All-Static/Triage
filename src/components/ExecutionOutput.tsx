// Render only execution messages returned by the backend.
export default function ExecutionOutput({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <section className="surface detail-section">
      <h2>Execution Output</h2>
      <pre role="log" aria-label="Triage execution output">
        {messages.join("\n")}
      </pre>
    </section>
  );
}
