const BASE_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    // If the server returns 400 or 500, we throw an error so the catch block handles it
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    console.error("Register Error:", error);
    // Return a structured error so the UI can display it
    return { success: false, message: error.message || "Server connection failed" };
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: error.message || "Server connection failed" };
  }
};