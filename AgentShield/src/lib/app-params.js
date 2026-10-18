import { getAccessToken } from '@base44/sdk';
const isBrowser = typeof window !== 'undefined';
const clearRequested = () => isBrowser && new URLSearchParams(window.location.search).get('clear_access_token') === 'true';
if (clearRequested()) { window.localStorage.removeItem('base44_access_token'); window.localStorage.removeItem('token'); }
export const appParams = { appId: import.meta.env.VITE_BASE44_APP_ID, token: getAccessToken(), functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION, appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL };
