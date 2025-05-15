import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">جميع الطلبات</h1>
        <Button onClick={() => navigate("/dashboard")}>رجوع للوحة التحكم</Button>
      </div>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <p>لا توجد طلبات حتى الآن.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: "#f9f9f9",
            }}
          >
            <p><strong>الاسم:</strong> {order.firstName} {order.lastName}</p>
            <p><strong>البريد:</strong> {order.email}</p>
            <p><strong>الهاتف:</strong> {order.phone}</p>
            <p><strong>العنوان:</strong> {order.address}, {order.city}, {order.postalCode}</p>
            <p><strong>الدفع:</strong> {order.paymentMethod === "cod" ? "عند الاستلام" : "تحويل بنكي"}</p>
            <p><strong>عدد المنتجات:</strong> {order.cartItems.length}</p>
            <p><strong>وقت الإنشاء:</strong> {order.createdAt?.toDate().toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
