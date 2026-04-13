import { getBackendUrl } from './backendService';

let isBackendHealthy: boolean | null = null;

export const checkBackendHealth = async (): Promise<boolean> => {
  if (isBackendHealthy !== null) return isBackendHealthy;

  const url = getBackendUrl();
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${url}/health`, {
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(id);
    isBackendHealthy = response.ok;
    return isBackendHealthy;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    isBackendHealthy = false;
    return false;
  }
};

export const isBackendAvailable = (): boolean => {
  // If we've already checked and it's false, definitely not available
  if (isBackendHealthy === false) return false;

  // Otherwise, assume it might be available if we have a URL or are in production
  return !!import.meta.env.VITE_BACKEND_URL || import.meta.env.PROD;
};
