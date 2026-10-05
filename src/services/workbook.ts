import type { WorkbookAccess } from "../types";

// Resolve a workbook link supplied by the backend. Local filesystem paths and
// executable schemes are intentionally unsupported. A relative download URL
// can point to a FastAPI route that serves the original workbook.
export function resolveWorkbookUrl(
  access: WorkbookAccess,
  origin: string,
): string | null {
  if (access.workbookUrl) {
    const url = new URL(access.workbookUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(
        "The workbook must use an HTTP or HTTPS link supplied by the backend.",
      );
    }
    return url.href;
  }
  if (access.downloadUrl) {
    const url = new URL(access.downloadUrl, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(
        "The workbook download must be served by the backend over HTTP or HTTPS.",
      );
    }
    return url.href;
  }
  return null;
}
