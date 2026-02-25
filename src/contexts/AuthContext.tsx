import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "@/services/api";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; rePassword: string; phone: string }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<string>;
  verifyResetCode: (code: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, password: string, rePassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const decodeToken = useCallback((t: string): User | null => {
    try {
      const decoded: any = jwtDecode(t);
      return { id: decoded.id, name: decoded.name, role: decoded.role };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (token) {
      const u = decodeToken(token);
      setUser(u);
    }
    setIsLoading(false);
  }, [token, decodeToken]);

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.signin({ email, password });
    const t = data.token;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(decodeToken(t));
  };

  const register = async (regData: { name: string; email: string; password: string; rePassword: string; phone: string }) => {
    const { data } = await authAPI.signup(regData);
    const t = data.token;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(decodeToken(t));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    const { data } = await authAPI.forgotPassword({ email });
    return data.message || "Reset code sent to your email";
  };

  const verifyResetCode = async (code: string) => {
    await authAPI.verifyResetCode({ resetCode: code });
  };

  const resetPassword = async (email: string, newPassword: string) => {
    await authAPI.resetPassword({ email, newPassword });
  };

  const changePassword = async (currentPassword: string, password: string, rePassword: string) => {
    const { data } = await authAPI.changePassword({ currentPassword, password, rePassword });
    const t = data.token;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(decodeToken(t));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, forgotPassword, verifyResetCode, resetPassword, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
