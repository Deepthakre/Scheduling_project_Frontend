import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { AuthResponse } from "../types";

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
      return;
    }

    // Access token save karo
    localStorage.setItem("accessToken", accessToken);

    // Profile fetch karo
    api
      .get<AuthResponse>("/auth/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Logged in with Google!");
          navigate("/dashboard");
        }
      })
      .catch(() => {
        toast.error("Failed to load profile.");
        navigate("/login");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Completing Google login...</p>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;