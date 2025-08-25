import { apiBaseURL } from '../services/apiClient';

export function absoluteUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = apiBaseURL.endsWith('/') ? apiBaseURL : `${apiBaseURL}/`;
  try {
    return new URL(path.startsWith('/') ? path.slice(1) : path, base).toString();
  } catch {
    return `${base}${path.replace(/^\/+/, '')}`;
  }
}
