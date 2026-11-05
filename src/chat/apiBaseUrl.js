export function resolveApiBaseUrl({ explicitBaseUrl = '', isDev = false } = {}) {
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  return isDev ? 'http://127.0.0.1:8001' : '';
}

export function getApiBaseUrl() {
  return resolveApiBaseUrl({
    explicitBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
    isDev: import.meta.env.DEV,
  });
}
