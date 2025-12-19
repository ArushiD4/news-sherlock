import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import bgImage from "../assets/images/bg.png"; // Make sure this path is correct

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      const data = await loginUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Redirect to Home after successful login
        navigate("/detect"); 
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white_custom px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-md bg-prussian_blue p-8 rounded-2xl shadow-xl border border-charcoal">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-oxford_blue border border-charcoal focus:outline-none focus:ring-2 focus:ring-white_custom/30 text-white_custom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-oxford_blue border border-charcoal focus:outline-none focus:ring-2 focus:ring-white_custom/30 text-white_custom"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 py-3 font-bold rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-oxford_blue shadow-md hover:scale-105 transition-all duration-300"
          >
            LOGIN
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#d4af37] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;