import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replace, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../../redux/actions/authActions";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then((response) => {
        localStorage.setItem("token", response.access); 
        localStorage.setItem("refresh_token", response.refresh);
        alert("Login successful!");
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Login failed:", err.message);
      });
  };
  

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-300 font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleInputChange(setUsername)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error.detail}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg hover:opacity-90 transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </div>
  </div>
  );
};

export default Login;
