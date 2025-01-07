import { MenuFetchError } from './error-handling';

export const API_CONFIG = {
  baseUrl: 'https://srv7.robotpos.com/kiosk2025/kioskService.asmx',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // 15 seconds
};

export async function fetchWithRetry(
  url: string, 
  options: RequestInit,
  retries = 3
): Promise<Response> {
  let lastError: Error = new Error('Failed to fetch after multiple retries');

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new MenuFetchError(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (i === retries - 1) break;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
    }
  }
  
  throw lastError;
}
