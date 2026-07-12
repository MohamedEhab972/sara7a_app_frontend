import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { updateProfileSchema, type UpdateProfileFormData } from "./update-profile.schema";
import type { User } from "@/types";

interface UpdateProfileFormProps {
  currentUser: User;
  onSubmit: (data: UpdateProfileFormData, image?: File) => void;
  loading: boolean;
}

export function UpdateProfileForm({ currentUser, onSubmit, loading: updateLoading }: UpdateProfileFormProps) {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      uniqueAccName: currentUser.uniqueAccName,
      password: "",
      newPassword: "",
    },
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, imageFile))}
      className="flex flex-col gap-4"
    >
      {/* Avatar picker */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="group relative size-20 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Change profile picture"
        >
          {imagePreview ?? currentUser.profilePicture ? (
            <img
              src={imagePreview ?? currentUser.profilePicture}
              alt="Profile"
              className="size-full object-cover"
            />
          ) : (
            <UserCircle className="m-auto mt-5 size-10 text-muted-foreground transition group-hover:text-primary" />
          )}
        </button>
        <span className="text-xs text-muted-foreground">Click to change photo</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">Full name</label>
          <input
            id="name"
            type="text"
            disabled={updateLoading}
            placeholder="John Doe"
            className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="uniqueAccName" className="text-sm font-medium">Username</label>
          <input
            id="uniqueAccName"
            type="text"
            disabled={updateLoading}
            placeholder="john_doe"
            className="rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            {...register("uniqueAccName")}
          />
          {errors.uniqueAccName && (
            <p className="text-xs text-destructive">{errors.uniqueAccName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          disabled={updateLoading}
          placeholder="you@example.com"
          className="rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Change password <span className="font-normal">(leave blank to keep current)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">Current password</label>
            <PasswordInput
              id="password"
              disabled={updateLoading}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium">New password</label>
            <PasswordInput
              id="newPassword"
              disabled={updateLoading}
              placeholder="••••••••"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={updateLoading}>
        {updateLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
