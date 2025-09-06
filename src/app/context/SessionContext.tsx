// contexts/SessionContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SessionContextType {
  sessionId: string;
  isNewSession: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [isNewSession, setIsNewSession] = useState<boolean>(false);

  useEffect(() => {
    const initializeSession = () => {
      // Try to get existing sessionId from localStorage
      let existingSessionId = localStorage.getItem('sessionId');
      
      // If doesn't exist, generate new one
      if (!existingSessionId) {
        existingSessionId = generateSessionId();
        localStorage.setItem('sessionId', existingSessionId);
        setIsNewSession(true);
        
        // Also set a cookie for server-side access
        document.cookie = `sessionId=${existingSessionId}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      } else {
        setIsNewSession(false);
      }
      
      setSessionId(existingSessionId);
    };

    initializeSession();
  }, []);

  const generateSessionId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return (
    <SessionContext.Provider value={{ sessionId, isNewSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};