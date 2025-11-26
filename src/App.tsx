import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminPanel } from "./components/AdminPanel";
import { CartPage } from "./components/CartPage";
import { HomePage } from "./components/HomePage";
import { Layout } from "./components/Layout";
import { PaymentDashboard } from "./components/PaymentDashboard";
import { RegistrationForm } from "./components/RegistrationForm";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/cart/:id" element={<CartPage />} />
            <Route path="/dashboard" element={<PaymentDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
