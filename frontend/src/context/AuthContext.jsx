"use client";

import { getUserApi, signupApi, singinApi, logoutApi } from "@/services/authService";
import { useRouter } from "next/navigation";
import { createContext, useReducer, useContext, useEffect } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "signin":
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "signup":
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "user/loaded":
      return {
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "logout":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
  }
};

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [{ user, isAuthenticated, isLoading, error }, dispatch] = useReducer(
    authReducer,
    initialState
  );

  async function signin(values) {
    dispatch({ type: "loading" });
    try {
      const response = await singinApi(values);
      const { user, message } = response;

      // ذخیره tokenها در localStorage و کوکی
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // ذخیره در کوکی برای middleware
        document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=31536000; samesite=lax`;
      }

      dispatch({ type: "signin", payload: user });
      toast.success(message);
      router.push("/profile");
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      dispatch({ type: "rejected", payload: errorMsg });
      toast.error(errorMsg);
    }
  }

  async function signup(values) {
    dispatch({ type: "loading" });
    try {
      const response = await signupApi(values);
      const { user, message } = response;

      // ذخیره tokenها در localStorage و کوکی
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // ذخیره در کوکی برای middleware
        document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; samesite=lax`;
        document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=31536000; samesite=lax`;
      }

      dispatch({ type: "signup", payload: user });
      toast.success(message);
      router.push("/profile");
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      dispatch({ type: "rejected", payload: errorMsg });
      toast.error(errorMsg);
    }
  }

  async function getUser() {
    dispatch({ type: "loading" });
    try {
      // چک کردن وجود token در localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          dispatch({ type: "rejected", payload: "توکن یافت نشد" });
          return;
        }
      }

      const { user } = await getUserApi();
      dispatch({ type: "user/loaded", payload: user });
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      dispatch({ type: "rejected", payload: errorMsg });

      // پاک کردن tokenهای نامعتبر
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }

  async function updateUser() {
    try {
      const { user } = await getUserApi();
      dispatch({ type: "user/loaded", payload: user });
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      dispatch({ type: "rejected", payload: errorMsg });
    }
  }

  async function logout() {
    dispatch({ type: "loading" });
    try {
      await logoutApi();

      // پاک کردن tokenها از localStorage و کوکی
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // پاک کردن کوکی‌ها
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax';
      }

      dispatch({ type: "logout" });
      toast.success("خروج با موفقیت انجام شد");
      router.push("/signin");
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      dispatch({ type: "rejected", payload: errorMsg });
      toast.error(errorMsg || "خطا در خروج");
    }
  }

  useEffect(() => {
    async function fetchData() {
      await getUser();
    }
    fetchData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, signin, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("not found Auth Context");
  return context;
}
