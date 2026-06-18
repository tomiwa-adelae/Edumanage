import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuth } from "@/store/useAuth";
import {
  clearAuthCookie,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/utils";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the access token as a Bearer header so auth works on Safari/iOS where
// the cross-site (vercel ↔ render) cookie is blocked by ITP. Cookies are still
// sent via withCredentials for browsers that allow them.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

const PUBLIC_ROUTES = [
  "/auth",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/set-new-password",
];

function isPublicRoute(url?: string) {
  if (!url) return false;
  return PUBLIC_ROUTES.some((r) => url.includes(r));
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v?: any) => void;
  reject: (e?: any) => void;
}> = [];

function processQueue(error: any) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message;
    const path = originalRequest?.url || "";

    if (isPublicRoute(path)) {
      return Promise.reject(error);
    }

    // Handle 401 (access token expired)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh using the stored refresh token (Bearer/body) so it works on
        // Safari/iOS; falls back to the refresh cookie on other browsers.
        const { data } = await api.post(
          "/auth/refresh",
          { refreshToken: getRefreshToken() },
          { withCredentials: true }
        );

        // Persist the rotated tokens for subsequent requests.
        if (data?.accessToken) setAuthTokens(data.accessToken, data.refreshToken);

        // Refresh succeeded — retry queued requests
        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        isRefreshing = false;

        // Refresh failed — log out user
        clearAuthCookie();
        const { clearUser } = useAuth.getState();
        clearUser();
        if (typeof window !== "undefined") window.location.assign("/");

        return Promise.reject(err);
      }
    }

    // Handle 403 or other unauthorized access
    if (
      status === 403 ||
      message === "Unauthorized" ||
      message === "Forbidden"
    ) {
      clearAuthCookie();
      const { clearUser } = useAuth.getState();
      clearUser();
      if (typeof window !== "undefined") window.location.assign("/");
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper functions
export async function fetchData<T>(url: string): Promise<T> {
  const res = await api.get(url);
  return res.data;
}
export async function postData<T>(url: string, data: any): Promise<T> {
  const res = await api.post(url, data);
  return res.data;
}
export async function updateData<T>(url: string, data: any): Promise<T> {
  const res = await api.patch(url, data);
  return res.data;
}
