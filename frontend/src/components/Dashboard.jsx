import { useState, useEffect } from 'react';

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); 
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  useEffect(() => {
    fetchUserStats();
    fetchNotifications();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const ordersResponse = await fetch('http://localhost:3000/api/orders/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.length
        }));
      }
      setStats(prev => ({
        ...prev,
        wishlistItems: 0,
        reviews: 0
      }));
    } catch (err) {
      setError('Failed to load your stats');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        ));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Quick Actions handlers
  const handleViewOrders = () => setActiveView('orders');
  const handleViewProfile = () => setActiveView('profile');
  const handleBackToDashboard = () => setActiveView('dashboard');

  // Orders View
  if (activeView === 'orders') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-lilta text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View your order history</p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
        {ordersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => {
                setActiveView('dashboard');
                onNavigate('home');
              }}
              className="btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">
                    <span className="font-medium">Total:</span> ${order.total}
                  </p>
                </div>
                {order.items && order.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <span className="text-gray-700">{item.name || `Item ${index + 1}`}</span>
                          <span className="text-gray-600">Qty: {item.quantity || 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

 
  if (activeView === 'profile') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-lilta text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">View your account details</p>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="btn-secondary"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="card p-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900 text-lg">{user.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {user.role}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Member Since</label>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-lilita text-gray-900 mb-2 tracking-tight">User Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome to your personal dashboard</p>
      </div>
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-base">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="card p-6 flex flex-col items-center text-center shadow-lg rounded-2xl bg-white">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold text-2xl">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">User Profile</h3>
          <p className="text-gray-500 mb-4">Account Information</p>
          <div className="space-y-2 w-full">
            <div>
              <label className="block text-xs font-medium text-gray-400">Email</label>
              <p className="text-gray-900 text-base break-all">{user.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400">Role</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {user.role}
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400">Member Since</label>
              <p className="text-gray-900 text-base">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        {/* Quick Actions Card */}
        <div className="card p-6 flex flex-col items-center text-center shadow-lg rounded-2xl bg-white">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3 w-full">
            <button 
              onClick={() => onNavigate('home')}
              className="w-full btn-primary text-base py-2"
            >
              Go Shopping
            </button>
            <button 
              onClick={handleViewProfile}
              className="w-full btn-secondary text-base py-2"
            >
              View Profile
            </button>
            <button 
              onClick={handleViewOrders}
              className="w-full btn-secondary text-base py-2"
            >
              View Orders ({stats.totalOrders})
            </button>
          </div>
        </div>
        {/* Stats Card */}
        <div className="card p-6 flex flex-col items-center text-center shadow-lg rounded-2xl bg-white">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Stats</h3>
          {loading ? (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Orders</span>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Wishlist Items</span>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reviews</span>
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Orders</span>
                <span className="text-2xl font-bold text-blue-600">{stats.totalOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Wishlist Items</span>
                <span className="text-2xl font-bold text-green-600">{stats.wishlistItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reviews</span>
                <span className="text-2xl font-bold text-purple-600">{stats.reviews}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Notifications */}
      <div className="mt-10">
        <div className="card p-6 shadow-lg rounded-2xl bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
            {notifications.filter(n => !n.isRead).length > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
          {notificationsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 004 6v10a4 4 0 004 4h10a4 4 0 004-4V6a4 4 0 00-4-4H8a4 4 0 00-2.83 1.17z" />
                </svg>
              </div>
              <p className="text-gray-500">No notifications</p>
              <p className="text-sm text-gray-400">You'll see order updates here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.isRead 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Logout Button */}
      <div className="mt-10 text-center">
        <button
          onClick={onLogout}
          className="btn-secondary text-base px-8 py-2 rounded-full shadow"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 