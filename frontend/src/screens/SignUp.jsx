import bannerImage from "../assets/auth-banner.png";
import logo from "../assets/logo.png";
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const [showOTP, setShowOTP] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // storing user's information
    const [user, setUser] = useState({ name: "", email: "", dob: "", otp: "" });
    const [errors, setErrors] = useState({});

    // validation function
    const validateForm = () => {
        const newErrors = {};

        if (!user.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!user.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!user.dob) {
            newErrors.dob = "Date of birth is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // handler to generate otp
    const otpHandler = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/register", {
                name: user.name,
                email: user.email,
                dob: user.dob
            });

            alert("OTP sent successfully!");
            setOtpSent(true);
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // handler to verify otp
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user.otp.trim()) {
            setErrors({ otp: "OTP is required" });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/verify-otp", {
                email: user.email,
                otp: user.otp
            });

            // Login user with the token
            login({ name: user.name, email: user.email }, res.data.token);
            alert("User registered successfully!");
            navigate('/');
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // single handler for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
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
                    <form className="w-full max-w-md" onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-2">Sign up</h1>
                        <p className="text-gray-500 mb-6">Sign up to enjoy the feature of HD</p>

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    value={user.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <input
                                    type="date"
                                    name="dob"
                                    placeholder="Date of Birth"
                                    className={`w-full border rounded px-3 py-2 ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                                    value={user.dob}
                                    onChange={handleChange}
                                />
                                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    value={user.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <input
                                        type={showOTP ? "text" : "password"}
                                        placeholder="OTP"
                                        name="otp"
                                        className={`w-full border rounded px-3 py-2 pr-10 ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                        value={user.otp}
                                        onChange={handleChange}
                                        disabled={!otpSent}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOTP(!showOTP)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showOTP ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={otpHandler}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    {loading ? "Sending..." : "Get OTP"}
                                </button>
                            </div>
                            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}

                            <button
                                type="submit"
                                disabled={!otpSent || loading}
                                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {loading ? "Verifying..." : "Sign up"}
                            </button>
                        </div>

                        <p className="text-sm mt-4 text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:underline">Sign in</Link>
                        </p>
                    </form>
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
