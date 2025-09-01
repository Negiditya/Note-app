import bannerImage from "../assets/auth-banner.png";
import logo from "../assets/logo.png";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [showOTP, setShowOTP] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: "", otp: "" });
    const [errors, setErrors] = useState({});

    // validation
    const validateEmail = () => {
        if (!formData.email.trim()) {
            setErrors({ email: "Email is required" });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrors({ email: "Email is invalid" });
            return false;
        }
        setErrors({});
        return true;
    };

    // handler to send OTP
    const sendOtpHandler = async () => {
        if (!validateEmail()) return;

        setLoading(true);
        try {
            const res = await api.post("/login", { email: formData.email });
            alert("OTP sent to your email!");
            setOtpSent(true);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // handler to verify OTP and login
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.otp.trim()) {
            setErrors({ otp: "OTP is required" });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/verify-otp", {
                email: formData.email,
                otp: formData.otp
            });
            const { user } = res.data


            // Login user with the token
            login( user , res.data.token);
            alert("Login successful!");
            navigate('/');
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Invalid OTP or something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Section - Form */}
            <div className="flex flex-col p-8">
                {/* Logo at top-left */}
                <div className="flex items-center gap-2 mb-8">
                    <img src={logo} alt="HD Logo" className="h-8 w-10" />
                    <span className="font-bold text-lg">
                        HD
                    </span>
                </div>

                {/* Centered form */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-bold mb-2">Sign in</h1>
                        <p className="text-gray-500 mb-6">Please login to continue to your account.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="jonas_kahnwald@gmail.com"
                                        className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={otpSent}
                                    />
                                    {!otpSent && (
                                        <button
                                            type="button"
                                            onClick={sendOtpHandler}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                                        >
                                            {loading ? "Sending..." : "Send OTP"}
                                        </button>
                                    )}
                                </div>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            {otpSent && (
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                                    <div className="relative">
                                        <input
                                            type={showOTP ? "text" : "password"}
                                            name="otp"
                                            placeholder="Enter OTP"
                                            className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.otp}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOTP(!showOTP)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showOTP ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                                    <button
                                        type="button"
                                        onClick={sendOtpHandler}
                                        disabled={loading}
                                        className="text-sm text-blue-500 hover:text-blue-600 mt-1"
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            )}

                            {/* Keep me logged in checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="keepLoggedIn"
                                    checked={keepLoggedIn}
                                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
                                    Keep me logged in
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!otpSent || loading}
                                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <p className="text-sm mt-4 text-center text-gray-600">
                            Need an account?{" "}
                            <Link to="/signup" className="text-blue-500 hover:text-blue-600">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Image (only on desktop) */}
            <div className="hidden md:block">
                <img
                    src={bannerImage}
                    alt="Background"
                    className="w-full h-screen object-cover"
                />
            </div>
        </div>
    );
}