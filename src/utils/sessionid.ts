// utils/guestId.ts
import axios from 'axios'
export const getOrCreateGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  
  // First try to use the session ID
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    return sessionId;
  }
  
  // Fallback to legacy guest ID (for backward compatibility)
  let guestId = localStorage.getItem('blog3d_guestId');
  
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('blog3d_guestId', guestId);
  }
  
  return guestId;
};

// Update the interceptor to use session ID
export const withSessionId = (config: any) => {
  if (typeof window !== 'undefined') {
    const sessionId = localStorage.getItem('sessionId') || getOrCreateGuestId();
    if (sessionId) {
      config.headers = {
        ...config.headers,
        'x-session-id': sessionId
      };
    }
  }
  return config;
};

// Replace the old interceptor
axios.interceptors.request.use(withSessionId);