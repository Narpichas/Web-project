import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Layout from './components/Layout'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [cart, setCart] = useState([])
  const [adminDashboardKey, setAdminDashboardKey] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        setCurrentPage(userData.user.role === 'admin' ? 'admin' : 'home')
      } else {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setCurrentPage('home')
      }
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setCurrentPage('home')
    }
  }

  const handleLogin = (userData, token) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem('token', token)
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'home')
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setCart([]) // clear cart state
    localStorage.removeItem('token')
    localStorage.removeItem('cart') // clear cart from storage
    setCurrentPage('home')
  }

  // Navigation handler for Navbar
  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  // Add to cart handler
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id)
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Remove from cart handler
  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Function to reset admin dashboard to main view
  const goToAdminDashboardHome = () => {
    setAdminDashboardKey(prev => prev + 1);
    setCurrentPage('admin');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <ProductList onAddToCart={handleAddToCart} />
      case 'login':
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />
      case 'register':
        return <Register onRegister={handleLogin} onSwitchToLogin={() => setCurrentPage('login')} />
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      case 'admin':
        return <Admin user={user} onLogout={handleLogout} dashboardKey={adminDashboardKey} />
      case 'cart':
        return <Cart cart={cart} onRemoveFromCart={handleRemoveFromCart} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return <ProductList onAddToCart={handleAddToCart} />
    }
  }

  return (
    <>
      <Layout
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        goToAdminDashboardHome={goToAdminDashboardHome}
      >
        {renderPage()}
      </Layout>
      <Footer />
    </>
  )
}

export default App
