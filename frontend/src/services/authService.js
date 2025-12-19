// Point to the Python Flask Server Port (5000)
// And remove "/api/auth" because your app.py routes are just "/login" and "/register"
const BASE_URL = "http://localhost:3000/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "Server connection failed" };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Server connection failed" };
  }
};