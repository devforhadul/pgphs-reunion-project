import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./Layout/MainLayout";
import { RegistrationForm } from "./components/RegistrationForm";
import { PaymentDashboard } from "./components/PaymentDashboard";
// import { AdminPanel } from "./components/AdminPanel";
import { CartPage } from "./components/CartPage";
import StatusCheck from "./components/StatusCheck";
import { Toaster } from "react-hot-toast";
import { HomePage } from "./components/HomePage";
import AdminPage from "./components/AdminPage";
import { ConfirmationPage } from "./components/ConfirmationPage";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import forhad_img from "../src/assets/forhad_Photo.jpg";
import LoginPage from "./components/LoginPage";
import NotFound from "./components/NotFound";

// const data = {
//   name: "forhad",
//   sscBatch: "2015",
//   regNo: "reg1", // e.g., "1234567890"
//   imageUrl: "https://i.ibb.co.com/Qv7rJXvP/forhad-formal.jpg",
// };

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
        element: <RegistrationForm />,
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
        path: "admin/9599",
        element: <AdminPage />,
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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <FloatingWhatsApp
      phoneNumber="8801976-213292"
      accountName="Support"
      avatar={forhad_img}
      chatMessage="Hello! How can I help you?"
    />
    <RouterProvider router={router} />
  </StrictMode>
);
