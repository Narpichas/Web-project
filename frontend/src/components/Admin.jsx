import { useState, useEffect } from 'react';

const Admin = ({ user, onLogout, dashboardKey }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [showProductManager, setShowProductManager] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showUserManager, setShowUserManager] = useState(false);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ email: '', password: '', role: 'user' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Reset to main dashboard when dashboardKey changes
  useEffect(() => {
    setShowProductManager(false);
    setShowUserManager(false);
    setActiveModal(null);
  }, [dashboardKey]);

  useEffect(() => {
    if (!showProductManager && !showUserManager && !activeModal) {
      fetchUsers();
      fetchProducts();
      fetchOrders();
    }
    if (showProductManager) fetchProducts();
    if (showUserManager) fetchUsers();
    if (activeModal === 'orders') fetchOrders();
  }, [showProductManager, showUserManager, activeModal]);

  const fetchProducts = async () => {
    setProductLoading(true);
    setProductError('');
    try {
      const res = await fetch('http://localhost:3000/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setProductError('Could not load products');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const fetchUsers = async () => {
    setUserLoading(true);
    setUserError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUserError('Could not load users');
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleMakeAdmin = async (id) => {
    if (!window.confirm('Promote this user to admin?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: 'admin' }),
      });
      if (!res.ok) throw new Error('Failed to promote user');
      const updated = await res.json();
      setUsers(users.map(u => u.id === id ? { ...u, role: 'admin' } : u));
    } catch (err) {
      alert('Error promoting user');
    }
  };

  const handleAddUserChange = (e) => {
    setAddUserForm({ ...addUserForm, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError('');
    setAddUserSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addUserForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add user');
      }
      setAddUserSuccess('User added!');
      setAddUserForm({ email: '', password: '', role: 'user' });
      fetchUsers();
      setTimeout(() => setShowAddUserModal(false), 1000);
    } catch (err) {
      setAddUserError(err.message || 'Error adding user');
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setForm({ name: '', price: '', imageUrl: '' });
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add product');
      setSuccess('Product added!');
      setForm({ name: '', price: '', imageUrl: '' });
      fetchProducts();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setError(err.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrdersError('Could not load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }
      
      const result = await res.json();
      
      // Update the order in the local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Show success message
      alert(`Order status updated to ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Error updating order status: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {!showProductManager && !showUserManager ? (
        <>
          <div className="text-center mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-lilita text-gray-900 mb-4 md:mb-0 tracking-tight">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">Manage your application</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Total Users Card */}
            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  {userLoading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Total Orders Card */}
            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  {ordersLoading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Total Products Card */}
            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  {productLoading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Revenue Card (static for now) */}
            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Admin Profile</h3>
                  <p className="text-gray-600">Administrator Account</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="card flex-1 min-w-0 p-8 rounded-2xl shadow-xl bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary" onClick={() => setShowProductManager(true)}>
                  Manage Products
                </button>
                <button className="w-full btn-secondary" onClick={() => setShowUserManager(true)}>
                  Manage Users
                </button>
                <button className="w-full btn-secondary" onClick={() => setActiveModal('orders')}>
                  View Orders
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="card p-8 rounded-2xl shadow-xl bg-white">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recent System Activity</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">System activity will appear here</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={onLogout}
              className="btn-secondary text-base px-8 py-2 rounded-full shadow"
            >
              Sign Out
            </button>
          </div>
        </>
      ) : null}
      {showUserManager && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-lilita text-[#4B2E2E]">Manage Users</h2>
            <button
              className="bg-[#C6A664] text-[#4B2E2E] font-bold px-6 py-2 rounded-full shadow hover:bg-[#4B2E2E] hover:text-[#FFF7ED] transition-colors text-lg"
              onClick={() => setShowAddUserModal(true)}
            >
              + Add User
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 mb-10">
            {userLoading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : userError ? (
              <div className="text-center text-red-600 py-8">{userError}</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-yellow-100 rounded-lg">
                  <thead>
                    <tr className="bg-[#FFF7ED] text-[#4B2E2E]">
                      <th className="py-2 px-4 border-b">ID</th>
                      <th className="py-2 px-4 border-b">Email</th>
                      <th className="py-2 px-4 border-b">Role</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="text-center hover:bg-[#FDEEDC] transition">
                        <td className="py-2 px-4 border-b">{u.id}</td>
                        <td className="py-2 px-4 border-b">{u.email}</td>
                        <td className="py-2 px-4 border-b">{u.role}</td>
                        <td className="py-2 px-4 border-b flex flex-col gap-2 items-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleMakeAdmin(u.id)}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
                <button onClick={() => setShowAddUserModal(false)} className="absolute top-3 right-3 text-[#C6A664] hover:text-[#4B2E2E] text-2xl font-bold">&times;</button>
                <h3 className="text-2xl font-lilita text-[#4B2E2E] mb-6 text-center">Add New User</h3>
                <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                  <input
                    type="email"
                    name="email"
                    value={addUserForm.email}
                    onChange={handleAddUserChange}
                    placeholder="Email"
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={addUserForm.password}
                    onChange={handleAddUserChange}
                    placeholder="Password"
                    className="input-field"
                    required
                    minLength={6}
                  />
                  <select
                    name="role"
                    value={addUserForm.role}
                    onChange={handleAddUserChange}
                    className="input-field"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {addUserError && <div className="text-red-600 text-sm">{addUserError}</div>}
                  {addUserSuccess && <div className="text-green-600 text-sm">{addUserSuccess}</div>}
                  <button
                    type="submit"
                    className="btn-primary w-full disabled:opacity-50"
                    disabled={addUserLoading}
                  >
                    {addUserLoading ? 'Adding...' : 'Add User'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-[#C6A664] hover:text-[#4B2E2E] text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-lilita text-[#4B2E2E] mb-6 text-center">Add New Product</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="input-field"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="input-field"
                required
                min="0"
              />
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL (e.g. /images/product.jpg)"
                className="input-field"
                required
              />
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
              <button
                type="submit"
                className="btn-primary w-full disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
      {activeModal === 'orders' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-3 right-3 text-[#C6A664] hover:text-[#4B2E2E] text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-lilita text-[#4B2E2E] mb-6 text-center">View Orders</h3>
            {ordersLoading ? (
              <div className="text-center py-8">Loading orders...</div>
            ) : ordersError ? (
              <div className="text-center text-red-600 py-8">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-yellow-100 rounded-lg">
                  <thead>
                    <tr className="bg-[#FFF7ED] text-[#4B2E2E]">
                      <th className="py-2 px-4 border-b">Order ID</th>
                      <th className="py-2 px-4 border-b">User</th>
                      <th className="py-2 px-4 border-b">Total</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Created</th>
                      <th className="py-2 px-4 border-b">Items</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="text-center hover:bg-[#FDEEDC] transition">
                        <td className="py-2 px-4 border-b">{order.id}</td>
                        <td className="py-2 px-4 border-b">{order.User?.email || 'N/A'}</td>
                        <td className="py-2 px-4 border-b">₨{order.total}</td>
                                                 <td className="py-2 px-4 border-b">
                           {order.status === 'pending' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                               Pending
                             </span>
                           )}
                           {order.status === 'paid' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                               Paid
                             </span>
                           )}
                           {order.status === 'shipped' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               Shipped
                             </span>
                           )}
                           {order.status === 'cancelled' && (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                               Cancelled
                             </span>
                           )}
                         </td>
                        <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b text-xs text-left whitespace-pre-wrap">
                          {Array.isArray(order.items) ? (
                            <table className="min-w-full">
                              <thead>
                                <tr>
                                  <th className="py-1 px-2">Image</th>
                                  <th className="py-1 px-2">Name</th>
                                  <th className="py-1 px-2">Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="py-1 px-2">
                                      {item.imageUrl ? (
                                        <img src={`http://localhost:3000${item.imageUrl}`} alt={item.name || `Item ${idx + 1}`} className="w-10 h-10 object-cover rounded" />
                                      ) : (
                                        <span className="text-gray-400">No Image</span>
                                      )}
                                    </td>
                                    <td className="py-1 px-2">{item.name || `Item ${idx + 1}`}</td>
                                    <td className="py-1 px-2">{item.quantity || 1}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <span>No items</span>
                          )}
                        </td>
                                                 <td className="py-2 px-4 border-b flex gap-2">
                           {order.status === 'pending' && (
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                               className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                             >
                               Approve
                             </button>
                           )}
                           {order.status === 'paid' && (
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                               className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                             >
                               Ship
                             </button>
                           )}
                           {(order.status === 'pending' || order.status === 'paid') && (
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                               className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                             >
                               Cancel
                             </button>
                           )}
                           {order.status === 'cancelled' && (
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                               className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors"
                             >
                               Re-open
                             </button>
                           )}
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {showProductManager && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-lilita text-[#4B2E2E] tracking-tight">Manage Products</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-14 mb-16">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900">Product List</h3>
              <button
                className="bg-[#C6A664] text-[#4B2E2E] font-bold px-8 py-3 rounded-full shadow hover:bg-[#4B2E2E] hover:text-[#FFF7ED] transition-colors text-lg"
                onClick={handleOpenModal}
              >
                + Add Product
              </button>
            </div>
            {productLoading ? (
              <div className="text-center py-12 text-lg">Loading products...</div>
            ) : productError ? (
              <div className="text-center text-red-600 py-12 text-lg">{productError}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-lg">No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-yellow-100 rounded-lg text-base">
                  <thead>
                    <tr className="bg-[#FFF7ED] text-[#4B2E2E]">
                      <th className="py-3 px-6 border-b">ID</th>
                      <th className="py-3 px-6 border-b">Name</th>
                      <th className="py-3 px-6 border-b">Price</th>
                      <th className="py-3 px-6 border-b">Image</th>
                      <th className="py-3 px-6 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="text-center hover:bg-[#FDEEDC] transition">
                        <td className="py-3 px-6 border-b">{product.id}</td>
                        <td className="py-3 px-6 border-b">{product.name}</td>
                        <td className="py-3 px-6 border-b">₨{product.price}</td>
                        <td className="py-3 px-6 border-b">
                          <img src={`http://localhost:3000${product.imageUrl}`} alt={product.name} className="w-20 h-20 object-cover rounded-lg mx-auto" />
                        </td>
                        <td className="py-3 px-6 border-b">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 