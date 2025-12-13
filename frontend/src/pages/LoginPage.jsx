import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/bg.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // states
  const [username, setUsername] = useState(""); // used as name in register
  const [email, setEmail] = useState("");       // used in login + register
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const API = "http://localhost:5000/api/users";

  const handleSubmit = async () => {
    try {
      // basic validation
      if (isLogin) {
        if (!email || !password) {
          alert("Please enter email and password");
          return;
        }
      } else {
        if (!username || !email || !password || !confirmPassword) {
          alert("Please fill all fields");
          return;
        }
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      }

      const endpoint = isLogin ? "/login" : "/register";

      const body = isLogin
        ? {
            email,
            password,
          }
        : {
            name: username,
            email,
            password,
          };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(text);
      alert("backend did not return valid json");
      return;
    }


      if (!res.ok) {
        alert(data.error || "Request failed");
        return;
      }

      alert(isLogin ? "Login successful" : "Registration successful");

      if (isLogin) navigate("/detect");
      else setIsLogin(true); 

    } catch (err) {
      alert(err.message || "Backend not reachable");
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen bg-oxford_blue flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `linear-gradient(rgba(7,17,36,0.55), rgba(7,17,36,0.55)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-prussian_blue w-full max-w-md p-8 rounded-2xl shadow-2xl border border-charcoal text-center">
        <h2 className="text-3xl font-bold text-white_custom mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {/* Username (Register only) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-eerie_black text-white_custom placeholder-white_custom"
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-eerie_black text-white_custom placeholder-white_custom"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-xl bg-eerie_black text-white_custom placeholder-white_custom"
        />

        {/* Confirm Password (Register only) */}
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-xl bg-eerie_black text-white_custom placeholder-white_custom"
          />
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-white_custom text-oxford_blue font-bold py-3 rounded-xl hover:bg-charcoal hover:text-white_custom transition-all duration-300"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-white_custom mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white_custom ml-2 underline hover:text-charcoal"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
