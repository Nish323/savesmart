"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import Cookies from "js-cookie";
import axios from "@/utils/axios/client";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthDialog: boolean;
  authDialogView: "login" | "signup";
  setIsLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  setShowAuthDialog: (show: boolean) => void;
  setAuthDialogView: (view: "login" | "signup") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAuthDialog, setShowAuthDialog] = useState<boolean>(false);
  const [authDialogView, setAuthDialogView] = useState<"login" | "signup">("login");

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      
      if (token) {
        try {
          const response = await axios.get('/user/check-auth');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication error:', error);
          Cookies.remove('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/user/login', { email, password });
      Cookies.set('token', response.data.token, { expires: 30 });
      
      // Fetch user data after successful login
      const userResponse = await axios.get('/user/check-auth');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/user/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      Cookies.set('token', response.data.token, { expires: 30 });
      
      // Fetch user data after successful signup
      const userResponse = await axios.get('/user/check-auth');
      setUser(userResponse.data);
      setIsAuthenticated(true);
      setShowAuthDialog(false);
      router.push('/home');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await axios.post('/user/logout');
      Cookies.remove('token');
      setUser(null);
      setIsAuthenticated(false);
      setShowAuthDialog(false); // Reset dialog state when logging out
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we still want to remove the token and log the user out
      Cookies.remove('token');
      setUser(null);
      setIsAuthenticated(false);
      setShowAuthDialog(false); // Reset dialog state when logging out
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        showAuthDialog,
        authDialogView,
        setIsLoading,
        login,
        signup,
        logout,
        setShowAuthDialog,
        setAuthDialogView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthProvider以下でuseAuthを使用してください");
  }
  return context;
};
