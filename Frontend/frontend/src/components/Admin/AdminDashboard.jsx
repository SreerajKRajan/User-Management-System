import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  fetchUsers,
  setSearchTerm,
  updateUser,
} from "../../redux/slices/adminAuthSlice";
import { createUser } from "../../redux/slices/adminAuthSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, searchTerm, loading, error } = useSelector(
    (state) => state.admin
  );
  const token = localStorage.getItem("token");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUserData, setEditUserData] = useState({
    id: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
    } else {
      dispatch(fetchUsers(token));
    }

    const handlePopState = (event) => {
      if (!token) {
        navigate("/admin-login", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [token, dispatch, navigate]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  const filteredUsers = users.filter(
    (user) =>
      user &&
      user.username &&
      user.email &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateUser = () => {
    setShowForm(!showForm);
    setIsEditing(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(createUser(formData))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers(token));
      })
      .catch((error) => console.error("Error creating user:", error));

    setFormData({ username: "", email: "", password: "" });
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setShowForm(true);
    setEditUserData({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(editUserData))
      .unwrap()
      .then(() => {
        dispatch(fetchUsers(token));
      })
      .catch((error) => console.error("Error updating user:", error));

    setIsEditing(false);
    setShowForm(false);
    setEditUserData({ id: "", username: "", email: "" });
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by username or email"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleCreateUser}
          className="bg-green-500 text-white px-4 py-2"
        >
          {showForm && !isEditing ? "Cancel" : "Create User"}
        </button>
      </div>

      {(showForm || isEditing) && (
        <form
          onSubmit={isEditing ? handleEditFormSubmit : handleFormSubmit}
          className="mb-4"
        >
          <div className="mb-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={isEditing ? editUserData.username : formData.username}
              onChange={
                isEditing
                  ? (e) =>
                      setEditUserData({
                        ...editUserData,
                        username: e.target.value,
                      })
                  : handleInputChange
              }
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={isEditing ? editUserData.email : formData.email}
              onChange={
                isEditing
                  ? (e) =>
                      setEditUserData({
                        ...editUserData,
                        email: e.target.value,
                      })
                  : handleInputChange
              }
              className="border p-2 w-full"
              required
            />
          </div>
          {!isEditing && (
            <div className="mb-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
            </div>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            {isEditing ? "Update User" : "Create User"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading users</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-4 py-2 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
