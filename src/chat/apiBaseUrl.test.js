import { describe, expect, test } from 'vitest';
import { resolveApiBaseUrl } from './apiBaseUrl';

describe('resolveApiBaseUrl', () => {
  test('uses explicit base url when provided', () => {
    expect(
      resolveApiBaseUrl({
        explicitBaseUrl: 'https://api.example.com',
        isDev: true,
      })
    ).toBe('https://api.example.com');
  });

  test('falls back to repo-owned backend port in development', () => {
    expect(resolveApiBaseUrl({ explicitBaseUrl: '', isDev: true })).toBe(
      'http://127.0.0.1:8001'
    );
  });

  test('uses same-origin requests in production when no explicit base url is set', () => {
    expect(resolveApiBaseUrl({ explicitBaseUrl: '', isDev: false })).toBe('');
  });
});
