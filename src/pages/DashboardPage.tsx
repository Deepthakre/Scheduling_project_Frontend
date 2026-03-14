import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Auth App</h1>
        <div className="flex items-center gap-4">
          {user?.role === "admin" && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              Admin
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm font-medium text-gray-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email Verified</span>
              <span className={`text-sm font-medium ${user?.isEmailVerified ? "text-green-600" : "text-red-500"}`}>
                {user?.isEmailVerified ? "✅ Verified" : "❌ Not Verified"}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-gray-500">Account ID</span>
              <span className="text-xs font-mono text-gray-400">{user?.id}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ✅ You are authenticated — JWT + Refresh Token active
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
