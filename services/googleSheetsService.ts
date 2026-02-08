
import { AppState } from "../types";

/**
 * Optimized REST logic for Google Sheets integration.
 * Uses 'text/plain' to avoid CORS preflight (OPTIONS) which Google Apps Script doesn't support.
 */
export const syncToCloud = async (url: string, state: AppState): Promise<boolean> => {
  if (!url) return false;
  try {
    // We send as text/plain to avoid CORS preflight issues
    // Note: no-cors means we can't see the response body or status, 
    // but the request will still reach the server.
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      body: JSON.stringify(state),
    });
    return true; 
  } catch (error) {
    console.error("Cloud Sync POST Failed:", error);
    return false;
  }
};

/**
 * Fetches the application state from the Google Sheet Web App.
 * Handles redirects and basic validation.
 */
export const fetchFromCloud = async (url: string): Promise<AppState | null> => {
  if (!url) return null;
  try {
    const response = await fetch(url, { 
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow' // Explicitly follow GAS redirects
    });

    if (!response.ok) {
      console.warn(`Cloud Fetch Status: ${response.status} ${response.statusText}`);
      return null;
    }

    const rawData = await response.json();
    
    // Support both direct objects and stringified objects wrapped in a response
    let data = rawData;
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData);
      } catch (e) {
        console.error("Cloud data was string but not valid JSON:", rawData);
        return null;
      }
    }

    // Relaxed Validation: If it has 'config' and 'settings', it's likely a valid AppState
    if (data && typeof data === 'object' && (data.config || data.settings || data.timetable)) {
      console.log("Cloud Data Validated successfully.");
      return data as AppState;
    }
    
    console.warn("Cloud Data failed validation check:", data);
    return null;
  } catch (error) {
    console.error("Cloud Fetch (GET) Exception:", error);
    return null;
  }
};
