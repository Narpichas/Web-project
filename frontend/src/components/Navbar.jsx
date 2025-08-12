import { useState, useEffect } from 'react';

const Navbar = ({ user, onLogout, onNavigate, cartCount, goToAdminDashboardHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
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
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass shadow-large' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center animate-slide-in-left">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center space-x-3 group"
            >
              <div className="bg-gradient-gold rounded-full p-1 shadow-gold group-hover:shadow-large transition-all duration-300">
                <img 
                  src="http://localhost:3000/images/Urban%20core%20logo.png" 
                  alt="UrbanCore Logo" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <span className="text-2xl font-lilita text-gradient group-hover:scale-105 transition-transform duration-300">
                UrbanCore
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigate('home')}
              className="text-[#4B2E2E] hover:text-[#C6A664] font-medium transition-colors duration-300 hover:scale-105 transform"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className="text-[#4B2E2E] hover:text-[#C6A664] font-medium transition-colors duration-300 hover:scale-105 transform"
            >
              About
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className="text-[#4B2E2E] hover:text-[#C6A664] font-medium transition-colors duration-300 hover:scale-105 transform"
            >
              Contact
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4 animate-slide-in-right">
            {/* Cart */}
            <button
              onClick={() => handleNavigate('cart')}
              className="relative group"
            >
              <div className="bg-gradient-gold rounded-full p-2 shadow-gold group-hover:shadow-large transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.47L17 13M7 13V6h13" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-in">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft hover:shadow-medium transition-all duration-300">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce-in">
                        <span className="text-white text-xs font-bold">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[#4B2E2E] font-medium hidden sm:block">
                    {user.email.split('@')[0]}
                  </span>
                  <svg className="w-4 h-4 text-[#4B2E2E] group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-large opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-95 group-hover:scale-100">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        if (user.role === 'admin' && goToAdminDashboardHome) {
                          goToAdminDashboardHome();
                        } else {
                          handleNavigate('dashboard');
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-[#4B2E2E] hover:bg-[#FFF7ED] transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavigate('login')}
                  className="btn-outline text-sm py-2 px-4"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('register')}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <svg className="w-5 h-5 text-[#4B2E2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in-up">
            <div className="glass rounded-2xl mt-2 p-4 shadow-large">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-left px-4 py-2 text-[#4B2E2E] hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className="text-left px-4 py-2 text-[#4B2E2E] hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="text-left px-4 py-2 text-[#4B2E2E] hover:bg-white/50 rounded-lg transition-colors duration-200"
                >
                  Contact
                </button>
                {!user && (
                  <>
                    <hr className="border-[#C6A664]/20" />
                    <button
                      onClick={() => handleNavigate('login')}
                      className="text-left px-4 py-2 text-[#4B2E2E] hover:bg-white/50 rounded-lg transition-colors duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleNavigate('register')}
                      className="text-left px-4 py-2 text-[#4B2E2E] hover:bg-white/50 rounded-lg transition-colors duration-200"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 