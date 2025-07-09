"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function LogoutButton() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        setEmail(decoded.email); // ✅ only runs on client
      }
    } catch (err) {
      console.error("Invalid token or decoding failed", err);
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (!email) {
        toast.error("Email not found in token");
        return;
      }

      // Call your backend logout API
      await axios.post("/api/auth/logout", { email });

      // Clear session token
      sessionStorage.removeItem("authToken");

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}
