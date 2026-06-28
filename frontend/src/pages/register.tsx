import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import { useRedirectIfAuthenticated } from "@/hooks/useRequireAuth";

export default function RegisterPage() {
  const { isLoading, isAuthenticated } = useRedirectIfAuthenticated();

  if (isLoading || isAuthenticated) return null;

  return (
    <AuthLayout title="Create account" tagline="A quiet space for reflection, memory, and growth.">
      <RegisterForm />
    </AuthLayout>
  );
}
