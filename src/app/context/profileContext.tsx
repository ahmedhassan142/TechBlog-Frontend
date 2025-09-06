// contexts/profileContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./authContext";
import axios from "axios";

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  avatarLink?: string;
}

interface ProfileContextType {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = userDetails?.role === 'admin';

  const fetchUserDetails = useCallback(async () => {
    if (!isAuthenticated) {
      setUserDetails(null);
      setIsLoading(false);
      return;
    }

    // If we already have user data from auth context, use it
    if (authUser) {
      setUserDetails(authUser);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001"}/api/user/profile`,
        {
          withCredentials: true
        }
      );
      
      const userData = response.data.user || response.data;
      setUserDetails({
        _id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role || 'user',
        avatarLink: userData.avatarLink
      });
    } catch (err: any) {
      console.error("Profile fetch error:", err);
      setError(err.response?.data?.error || "Failed to load profile");
      setUserDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authUser]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <ProfileContext.Provider value={{ 
      userDetails, 
      isLoading, 
      error,
      refreshProfile: fetchUserDetails,
      isAdmin
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};