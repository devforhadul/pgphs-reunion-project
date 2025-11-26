import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./Layout/MainLayout";
import { HomePage } from "./components/HomePage";
import { RegistrationForm } from "./components/RegistrationForm";
import { PaymentDashboard } from "./components/PaymentDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { CartPage } from "./components/CartPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
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
      // {
      //   path: "admin",
      //   element: <AdminPanel />,
      // },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
