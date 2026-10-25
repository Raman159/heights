import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { Home } from "./pages/Home";
import { Wellness } from "./pages/Wellness";
import { Service } from "./pages/Service";
import { Spa } from "./pages/Spa";
import { Gym } from "./pages/Gym";
import { Restro } from "./pages/Restro";
import { Offers } from "./pages/Offers";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import Admin from "./pages/Admin";
import { ToastProvider } from "./components/Toast";

function AppContent() {
  const location = useLocation();
  if (location.pathname.replace(/\/+$/, "") === "/admin") return <Admin />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/spa" element={<Spa />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/restro" element={<Restro />} />
        <Route path="/services/:slug" element={<Service />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/:id" element={<Offers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Contact />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ToastProvider>
  );
}
