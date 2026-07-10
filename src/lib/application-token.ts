const STORAGE_KEY = "business-wizard-application-token";

// The business-account wizard is opened as an in-app webview: the host app
// appends ?application_token=<jwt> to the URL once, and every request this
// wizard makes must send it as `Authorization: Bearer <token>`. It's persisted
// to sessionStorage so it survives navigation between wizard steps/routes.
export function getApplicationToken(): string | null {
  if (typeof window === "undefined") return null;

  const fromUrl = new URLSearchParams(window.location.search).get("application_token");
  if (fromUrl) {
    sessionStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl;
  }

  return sessionStorage.getItem(STORAGE_KEY);
}

// Appends the application token to a wizard route so it survives full page
// navigations even if sessionStorage is ever unavailable (e.g. some in-app
// webviews restrict it). Use for every Link/router.push between wizard steps.
export function withApplicationToken(path: string): string {
  const token = getApplicationToken();
  if (!token) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}application_token=${encodeURIComponent(token)}`;
}
