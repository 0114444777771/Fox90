// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">لوحة تحكم المدير</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Button onClick={() => navigate("/orders")} className="w-full">
          عرض الطلبات
        </Button>
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
