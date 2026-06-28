import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading, isAuthenticated };
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isLoading, isAuthenticated };
}
