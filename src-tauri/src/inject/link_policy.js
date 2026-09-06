// Shared by the main page and the lightweight subframe bridge.
// This list intentionally preserves Pake's existing domain routing policy.
const MULTI_PART_PUBLIC_SUFFIXES = [
  "co.uk",
  "org.uk",
  "ac.uk",
  "gov.uk",
  "com.au",
  "net.au",
  "org.au",
  "co.jp",
  "ne.jp",
  "or.jp",
  "co.kr",
  "co.in",
  "com.br",
  "com.cn",
  "com.tw",
  "com.hk",
  "com.sg",
  "github.io",
  "gitlab.io",
  "pages.dev",
];

function getRootDomain(hostname) {
  const normalized = String(hostname || "").toLowerCase();
  if (!normalized) return "";
  const parts = normalized.split(".").filter(Boolean);
  if (parts.length <= 1) return normalized;
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PART_PUBLIC_SUFFIXES.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }
  return lastTwo;
}

function createInternalUrlMatcher(pattern) {
  let regex = null;
  if (pattern) {
    try {
      regex = new RegExp(pattern);
    } catch (error) {
      console.error("[Pake] Invalid internal_url_regex pattern:", error);
    }
  }
  return (url, baseUrl) => {
    if (regex) return regex.test(url);
    try {
      const target = new URL(url);
      const current = new URL(baseUrl);
      return (
        target.hostname === current.hostname ||
        getRootDomain(target.hostname) === getRootDomain(current.hostname)
      );
    } catch (error) {
      return false;
    }
  };
}
