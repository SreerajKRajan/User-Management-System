import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login"); 
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername){
        setUsername(storedUsername);
      }
    }
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("username")
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Home Page</h1>
        <div className="flex items-center space-x-4">
          <span className="text-xl">Welcome {username}!</span>
          <button onClick={() => {navigate("/user-details")}} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition duration-300">
            User Details
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-700">
            Explore your dashboard, manage your account, and more.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
