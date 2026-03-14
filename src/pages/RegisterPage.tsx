import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";
import { AxiosError } from "axios";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!form.name.trim()) {
      errors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!form.password) {
      errors.password = "Password is required";
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      errors.password = "Password must contain at least one uppercase letter (A-Z)";
    } else if (!/[a-z]/.test(form.password)) {
      errors.password = "Password must contain at least one lowercase letter (a-z)";
    } else if (!/[0-9]/.test(form.password)) {
      errors.password = "Password must contain at least one number (0-9)";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await authApi.register(form.name, form.email, form.password);
      toast.success(res.message);
      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      const error = err as AxiosError<{
        message: string;
        errors?: { msg: string; path: string }[];
      }>;
      if (error.response?.data?.errors) {
        const backendErrors: FieldErrors = {};
        error.response.data.errors.forEach((e) => {
          if (e.path === "name") backendErrors.name = e.msg;
          if (e.path === "email") backendErrors.email = e.msg;
          if (e.path === "password") backendErrors.password = e.msg;
        });
        setFieldErrors(backendErrors);
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
        <p className="text-sm text-gray-500 mb-6">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`input-field ${fieldErrors.name ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
              }}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`input-field ${fieldErrors.email ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`input-field ${fieldErrors.password ? "border-red-400 focus:ring-red-400" : ""}`}
              placeholder="Min 6 chars, Aa1 required"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">⚠ {fieldErrors.password}</p>
            )}
            {/* Live password rules */}
            {!fieldErrors.password && form.password.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className={`text-xs ${form.password.length >= 6 ? "text-green-500" : "text-gray-400"}`}>
                  {form.password.length >= 6 ? "✓" : "○"} At least 6 characters
                </p>
                <p className={`text-xs ${/[A-Z]/.test(form.password) ? "text-green-500" : "text-gray-400"}`}>
                  {/[A-Z]/.test(form.password) ? "✓" : "○"} One uppercase letter (A-Z)
                </p>
                <p className={`text-xs ${/[a-z]/.test(form.password) ? "text-green-500" : "text-gray-400"}`}>
                  {/[a-z]/.test(form.password) ? "✓" : "○"} One lowercase letter (a-z)
                </p>
                <p className={`text-xs ${/[0-9]/.test(form.password) ? "text-green-500" : "text-gray-400"}`}>
                  {/[0-9]/.test(form.password) ? "✓" : "○"} One number (0-9)
                </p>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400">
            <span className="bg-white px-2">or continue with</span>
          </div>
        </div>

        <button
          onClick={() => authApi.googleLogin()}
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;