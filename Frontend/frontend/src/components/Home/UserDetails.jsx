import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetails = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profile_image: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user-details/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User data:", response.data);
        setUserData(response.data);
        setImageUrl(response.data.profile_image);
        setUpdatedUser({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", profileImage);
    formData.append("username", updatedUser.username);
    formData.append("email", updatedUser.email);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user-details/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully!");
      setImageUrl(
        `${response.data.profile_image}?timestamp=${new Date().getTime()}`
      );
      setUpdatedUser({
        username: response.data.user.username,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error("Error uploading profile image", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user-details/",
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      setUserData(response.data.user);
      setImageUrl(response.data.profile_image);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 p-6">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg border border-gray-300">
        <div className="text-center mb-6">
          <img
            src={imageUrl ? imageUrl : "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-500 shadow-md"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="block mx-auto mb-4 cursor-pointer file:bg-blue-500 file:text-white file:border-none file:rounded-full file:py-2 file:px-4 file:shadow-lg hover:file:bg-blue-600"
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={handleImageUpload}
          >
            Upload New Image
          </button>
        </div>

        <div className="text-center">
          {!isEditing ? (
            <>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {userData.username || "Loading username..."}
              </p>
              <p className="text-gray-600 mb-4 italic">
                {userData.email || "Loading email..."}
              </p>
              <button
                onClick={handleEditToggle}
                className="bg-yellow-500 text-white py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={updatedUser.username}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, username: e.target.value })
                  }
                  className="border border-gray-300 rounded-full px-4 py-2 w-full shadow-sm focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, email: e.target.value })
                  }
                  className="border border-gray-300 rounded-full px-4 py-2 w-full shadow-sm focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleEditToggle}
                  className="bg-red-500 text-white py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
