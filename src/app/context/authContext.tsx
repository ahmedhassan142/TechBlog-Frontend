// contexts/authContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useSession } from './SessionContext';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatarLink?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { sessionId } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Add request interceptor for session ID
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      // Send both authentication token and session ID
      const cookieToken = Cookies.get("authToken");
      if (cookieToken) {
        config.headers.Authorization = `Bearer ${cookieToken}`;
      }
      
      // Always include session ID for tracking
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId;
      }
      
      config.withCredentials = true;
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [sessionId, token]);

  // Check authentication status on initial load
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, []);

  // Add debug logging to your AuthContext
const checkAuth = async (): Promise<boolean> => {
  setIsLoading(true);
  try {
    const cookieToken = Cookies.get("authToken");
    
    console.log("Auth check - Cookie token exists:", !!cookieToken);
    console.log("Auth check - Session ID:", sessionId);
    
    if (!cookieToken) {
      console.log("Auth check - No token found, not authenticated");
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      return false;
    }

    // Verify token locally first (quick check)
    try {
      const decoded = jwt.decode(cookieToken) as { exp: number; role?: string } | null;
      
      if (decoded && decoded.exp * 1000 < Date.now()) {
        console.log("Auth check - Token expired");
        Cookies.remove("authToken");
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        return false;
      }
    } catch (e) {
      console.log("Auth check - Token decoding failed:", e);
      Cookies.remove("authToken");
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      return false;
    }

    // Verify with backend
    try {
      console.log("Auth check - Making API call with token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${cookieToken}` },
          withCredentials: true
        }
      );

      console.log("Auth check - API response:", response.data);
      
      if (response.data.user || response.data._id) {
        const userData = response.data.user || response.data;
        setToken(cookieToken);
        setIsAuthenticated(true);
        setUser({
          _id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role || 'user',
          avatarLink: userData.avatarLink
        });
        console.log("Auth check - Success, user authenticated:", userData.email);
        return true;
      }
    } catch (error: any) {
      console.log("Auth check - Primary API call failed:", error.response?.data || error.message);
      
      // Fallback to cookie-only authentication
      try {
        console.log("Auth check - Trying fallback (cookie-only)");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/user/profile`,
          { withCredentials: true }
        );

        console.log("Auth check - Fallback response:", response.data);
        
        if (response.data.user || response.data._id) {
          const userData = response.data.user || response.data;
          const newCookieToken = Cookies.get("authToken");
          if (newCookieToken) {
            setToken(newCookieToken);
          }
          setIsAuthenticated(true);
          setUser({
            _id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role || 'user',
            avatarLink: userData.avatarLink
          });
          console.log("Auth check - Fallback success, user authenticated:", userData.email);
          return true;
        }
      } catch (fallbackError: any) {
        console.error("Auth check - Fallback failed:", fallbackError.response?.data || fallbackError.message);
      }
    }
    
    // If all checks failed
    console.log("Auth check - All authentication methods failed");
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    return false;
  } catch (error) {
    console.error("Auth check - Unexpected error:", error);
    Cookies.remove("authToken");
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  // Response interceptor for handling 401 errors
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      
      // Store token and user data
      if (response.data.token) {
        Cookies.set("authToken", response.data.token, { 
          sameSite: 'lax'
        });
        setToken(response.data.token);
        
        // Set user data if available
        if (response.data.user) {
          setUser({
            _id: response.data.user._id,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email,
            role: response.data.user.role || 'user',
            avatarLink: response.data.user.avatarLink
          });
        }
      }
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://techblog-backend-w6kj.onrender.com"}/api/user/logout`,
        {},
        { 
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined
          },
          withCredentials: true 
        }
      );
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      Cookies.remove("authToken");
      router.push('/');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      token, 
      user,
      isLoading,
      login, 
      logout, 
      checkAuth,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};