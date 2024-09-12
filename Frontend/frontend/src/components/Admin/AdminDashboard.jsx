import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, setSearchTerm } from '../../redux/slices/adminAuthSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, searchTerm, loading, error } = useSelector((state) => state.admin);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin-login', { replace: true });
    } else {
      dispatch(fetchUsers(token));
    }
  }, [token, dispatch, navigate]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">Logout</button>
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

      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2">Delete</button>
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
