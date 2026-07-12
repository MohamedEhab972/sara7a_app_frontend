import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { UserCircle } from "lucide-react";
import { useRegister } from "@/hooks/use-register";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { registerSchema, type RegisterFormData } from "./register.schema";

interface RegisterFormProps {
  disabled?: boolean;
  onSuccess: (email: string) => void;
}

export function RegisterForm({ disabled, onSuccess }: RegisterFormProps) {
  const { register: registerUser, loading } = useRegister({ onSuccess });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDisabled = loading || disabled;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function onSubmit(data: RegisterFormData) {
    registerUser(data, imageFile);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative size-20 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Upload profile picture"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="size-full object-cover" />
          ) : (
            <UserCircle className="size-10 text-muted-foreground transition group-hover:text-primary m-auto mt-5" />
          )}
        </button>
        <span className="text-xs text-muted-foreground">Profile picture (optional)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          disabled={isDisabled}
          placeholder="John Doe"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          disabled={isDisabled}
          placeholder="you@example.com"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="uniqueAccName" className="text-sm font-medium">
          Username
        </label>
        <input
          id="uniqueAccName"
          type="text"
          autoComplete="username"
          disabled={isDisabled}
          placeholder="john_doe"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("uniqueAccName")}
        />
        {errors.uniqueAccName && (
          <p className="text-xs text-destructive">{errors.uniqueAccName.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          disabled={isDisabled}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {/* Phone (optional) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          disabled={isDisabled}
          placeholder="+1 555 000 0000"
          className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("phone")}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button type="submit" className="w-full" disabled={isDisabled}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </motion.div>
    </form>
  );
}
