import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const {  logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 bg-white">
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="HD Logo" className="h-6 w-8 sm:h-8 sm:w-10 object-contain" />
        <span className="font-bold text-lg sm:text-xl text-gray-800">HD</span>
      </div>

      {/* Center Title */}
      <h1 className="text-base sm:text-lg font-semibold text-gray-700">Dashboard</h1>

      {/* Right Section */}
      <button
        onClick={logout}
        className="text-red-500 font-medium text-sm sm:text-base hover:underline"
      >
        Sign Out
      </button>
    </nav>
  );
}

