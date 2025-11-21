import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
      
      const response = await apiRequest("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    logout: () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      queryClient.clear();
      window.location.href = "/";
    },
    refreshAuth: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }
  };
}
