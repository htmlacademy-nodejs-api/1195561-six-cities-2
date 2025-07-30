import { API_ENDPOINT } from '../types/index.js';

export function buildApiUrl(baseUrl: string): string {
  return `${baseUrl}${API_ENDPOINT}`;
}

export function getDefaultApiUrl(): string {
  return buildApiUrl('http://localhost:4000');
}
