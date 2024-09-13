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
    <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-lg mx-auto p-6 bg-black shadow-lg rounded-lg">
      <div className="text-center mb-6">
        <img
          src={imageUrl ? imageUrl : "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="block mx-auto mb-4"
        />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleImageUpload}
        >
          Upload New Image
        </button>
      </div>

      <div className="text-center">
        {!isEditing ? (
          <>
            <p className="text-gray-600 mb-2">
              {userData.username || "Loading username..."}
            </p>
            <p className="text-gray-600 mb-4">
              {userData.email || "Loading email..."}
            </p>
            <button
              onClick={handleEditToggle}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form>
            <div className="mb-4">
              <label className="block text-left mb-1">Username</label>
              <input
                type="text"
                value={updatedUser.username}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, username: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-left mb-1">Email</label>
              <input
                type="email"
                value={updatedUser.email}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                }
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </button>
            <button
              onClick={handleEditToggle}
              className="bg-red-500 text-white py-2 px-4 rounded ml-4"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserDetails;
