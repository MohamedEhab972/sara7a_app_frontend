import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { VerifyPage } from "@/pages/verify";
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
