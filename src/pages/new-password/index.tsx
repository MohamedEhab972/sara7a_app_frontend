import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { NewPasswordForm } from "./new-password-form";

export function NewPasswordPage() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { resetToken?: string; email?: string } | null;
  const resetToken = state?.resetToken;

  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;
  if (!resetToken) return <Navigate to="/forgot-password" replace />;

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10"
          >
            <KeyRound className="size-7 text-primary" />
          </motion.div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Choose a new password
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {state?.email
              ? `Set a new password for ${state.email}`
              : "Set a new password for your account"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-glass backdrop-blur-xl">
          <NewPasswordForm
            resetToken={resetToken}
            onSuccess={() => navigate("/login", { replace: true })}
          />
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Didn&apos;t receive the email?{" "}
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Try again
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
