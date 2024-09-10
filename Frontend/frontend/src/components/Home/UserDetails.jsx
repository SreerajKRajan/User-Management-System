import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');  // State to handle the updated image URL

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/user-details/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setImageUrl(response.data.profile_image); // Set initial image URL
      } catch (error) {
        console.error('Error fetching user details', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profile_image', profileImage);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://127.0.0.1:8000/api/user-details/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile image updated successfully!');

      // Cache-busting: Update the image URL with a timestamp to avoid caching
      setImageUrl(`${response.data.profile_image}?timestamp=${new Date().getTime()}`);
    } catch (error) {
      console.error('Error uploading profile image', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">User Details</h1>
      <div className="mb-4">
        <img
          src={imageUrl ? imageUrl : '/default-profile.png'} // Updated to use the imageUrl state
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full"
        />
      </div>
      <form onSubmit={handleImageUpload}>
        <input type="file" onChange={handleImageChange} className="mb-4" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Upload Profile Image
        </button>
      </form>
    </div>
  );
};

export default UserDetails;
