import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { VerifyPage } from "@/pages/verify";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { ResetPasswordPage } from "@/pages/reset-password";
import { NewPasswordPage } from "@/pages/new-password";
import { ProfilePage } from "@/pages/profile";
import { MessagesPage } from "@/pages/messages";
import { SentMessagesPage } from "@/pages/sent-messages";
import { PublicMessagePage } from "@/pages/public-message";

export const router = createBrowserRouter([
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "verify",
    element: <VerifyPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "new-password",
    element: <NewPasswordPage />,
  },
  {
    path: "u/:uniqueAccName",
    element: <PublicMessagePage />,
  },
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "sent-messages", element: <SentMessagesPage /> },
        ],
      },
    ],
  },
]);
