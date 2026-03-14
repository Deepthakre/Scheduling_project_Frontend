import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";
import { AxiosError } from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      toast.success(res.message);
      setSent(true);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-500 text-sm mb-6">
              If <span className="font-medium text-indigo-600">{email}</span> is registered,
              you'll receive a password reset link shortly.
            </p>
            <Link to="/login" className="text-indigo-600 font-medium hover:underline text-sm">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
