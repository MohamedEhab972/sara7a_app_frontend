import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "motion/react";
import { useAuth } from "@/contexts/auth.context";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { Sara7aLogo } from "@/components/ui/sara7a-logo";
import { LoginForm } from "./login-form";

export function LoginPage() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo: string = (location.state as { from?: string })?.from ?? "/";

  const { handleCredential, loading: googleLoading } = useGoogleAuth({
    onSuccess: () => navigate(redirectTo, { replace: true }),
  });

  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <Sara7aLogo size="lg" />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-glass backdrop-blur-xl">
          <LoginForm
            disabled={googleLoading}
            onSuccess={() => navigate(redirectTo, { replace: true })}
          />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => {
                if (res.credential) handleCredential(res.credential);
              }}
              onError={() => void 0}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
