import { Navigate, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/auth.context";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordPage() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

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
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you an OTP to reset it
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-glass backdrop-blur-xl">
          <ForgotPasswordForm
            onSuccess={(email) => navigate("/reset-password", { state: { email } })}
          />
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
