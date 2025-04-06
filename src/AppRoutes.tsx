
import { Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Properties from "./pages/Properties";
import Finances from "./pages/Finances";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/imoveis" element={<Properties />} />
      <Route path="/imoveis/adicionar" element={<Properties />} />
      <Route path="/imoveis/:id" element={<Properties />} />
      <Route path="/financas" element={<Finances />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
