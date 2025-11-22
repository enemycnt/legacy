import { useAuth } from "@/features/auth/useAuth";

export function useMfa() {
  const { completeMfa, isLoading, error } = useAuth();

  return {
    completeMfa,
    isLoading,
    error,
  };
}
