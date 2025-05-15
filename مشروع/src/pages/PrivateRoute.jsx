// PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <p>جاري التحقق...</p>;

  // هنا نتحقق من البريد الإلكتروني للمدير فقط (غيّر البريد حسب مديرك)
  const adminEmail = "yalqlb019@gmail.com";

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default PrivateRoute;