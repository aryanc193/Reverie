import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useRedirectIfAuthenticated } from "@/hooks/useRequireAuth";

export default function LoginPage() {
  const { isLoading, isAuthenticated } = useRedirectIfAuthenticated();

  if (isLoading) return <LoadingScreen label="Checking session" />;
  if (isAuthenticated) return null;

  return (
    <AuthLayout title="Sign in" tagline="Welcome back. Pick up where your thoughts left off.">
      <LoginForm />
    </AuthLayout>
  );
}
