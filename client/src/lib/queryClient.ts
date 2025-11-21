import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<any> {
  const { method = "GET", body, headers = {} } = options;
  
  // Add JWT token to headers if available
  const token = localStorage.getItem("authToken");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Add content type for POST/PUT requests with body
  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(queryKey.join("/") as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// LocalStorage persister
const localStoragePersister = {
  persistClient: async (client: any) => {
    try {
      const clientData = {
        clientState: client,
        timestamp: Date.now(),
      };
      localStorage.setItem("react-query-cache", JSON.stringify(clientData));
    } catch (error) {
      console.warn("Failed to persist query cache:", error);
    }
  },
  restoreClient: async () => {
    try {
      const cached = localStorage.getItem("react-query-cache");
      if (!cached) return undefined;
      
      const { clientState, timestamp } = JSON.parse(cached);
      
      // Expire cache after 24 hours
      if (Date.now() - timestamp > 1000 * 60 * 60 * 24) {
        localStorage.removeItem("react-query-cache");
        return undefined;
      }
      
      return clientState;
    } catch (error) {
      console.warn("Failed to restore query cache:", error);
      localStorage.removeItem("react-query-cache");
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      localStorage.removeItem("react-query-cache");
    } catch (error) {
      console.warn("Failed to remove query cache:", error);
    }
  },
};

// Initialize persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  buster: "v1.0.0", // Change this to invalidate cache
  hydrateOptions: {},
});
