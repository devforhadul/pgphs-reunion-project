import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router";
import forhad_img from "../src/assets/forhad_Photo.jpg";
import AdminPage from "./components/AdminPage";
import FinishSignIn from "./components/auth/FinishSignIn";
import { CartPage } from "./components/CartPage";
import { ConfirmationPage } from "./components/ConfirmationPage";
import LoginPage from "./pages/login/LoginPage";
import NotFound from "./components/NotFound";
import "./index.css";
import MainLayout from "./Layout/MainLayout";
import StatusCheck from "./pages/checkstatus/StatusCheck";
import { PaymentDashboard } from "./pages/dashboard/PaymentDashboard";
import { HomePage } from "./pages/home/HomePage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import AuthProvider from "./provider/AuthProvider";
import ProtectedRoute from "./Routes/ProtectedRoute";
import UserDashboard from "./pages/user-dashboard/UserDashboard";
import PhotoFrame from "./components/PhotoFrame";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "registration",
        element: <RegistrationPage />,
      },
      {
        path: "cart/:id",
        element: <CartPage />,
      },
      {
        path: "dashboard",
        element: <PaymentDashboard />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "check-status",
        element: <StatusCheck />,
      },
      {
        path: "confirmation",
        element: <ConfirmationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // {
      //   path: "card",
      //   element: <ReunionCard  />,
      // },
      {
        path: "/finishSignIn",
        element: <FinishSignIn />,
      },
      {
        path: "user-dash",
        element: <UserDashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <FloatingWhatsApp
      phoneNumber="8801976-213292"
      accountName="Support"
      avatar={forhad_img}
      chatMessage="Hello! How can I help you?"
    />
    <PhotoFrame/>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
