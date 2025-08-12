import { useState, useEffect } from 'react';

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    onAddToCart(product);
    // Add a visual feedback animation
    const button = document.querySelector(`[data-product-id="${product.id}"]`);
    if (button) {
      button.classList.add('animate-bounce-in');
      setTimeout(() => button.classList.remove('animate-bounce-in'), 800);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-warm min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl font-lilita text-gradient mb-4">UrbanCore Collection</h1>
            <p className="text-xl text-[#4B2E2E] opacity-80">Discover our latest streetwear essentials</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="loading-skeleton h-48 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="loading-skeleton h-6 mb-2 rounded"></div>
                  <div className="loading-skeleton h-4 w-20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-warm min-h-screen py-12 flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-lilita text-[#4B2E2E] mb-2">Oops! Something went wrong</h2>
          <p className="text-[#8B5C2A]">{error}</p>
          <button 
            onClick={fetchProducts} 
            className="btn-primary mt-4 animate-pulse-glow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-warm min-h-screen py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block animate-float mb-6">
            <div className="bg-gradient-gold rounded-full p-4 shadow-gold">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-lilita text-gradient mb-6 leading-tight">
            UrbanCore Collection
          </h1>
          <p className="text-xl text-[#4B2E2E] opacity-80 max-w-2xl mx-auto leading-relaxed">
            Discover our latest streetwear essentials crafted for the modern urban lifestyle. 
            From vintage-inspired hoodies to premium street fashion.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="bg-white rounded-full px-6 py-2 shadow-soft animate-slide-in-left">
              <span className="text-[#C6A664] font-bold">{products.length}</span>
              <span className="text-[#4B2E2E] ml-2">Products</span>
            </div>
            <div className="bg-white rounded-full px-6 py-2 shadow-soft animate-slide-in-right">
              <span className="text-[#C6A664] font-bold">Free</span>
              <span className="text-[#4B2E2E] ml-2">Shipping</span>
            </div>
          </div>
        </div>

        {/* Limited Edition Section */}
        {products.filter(p => p.category === 'Limited Edition').length > 0 && (
          <div className="mb-16 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-lilita text-gradient mb-4">⭐ Limited Edition Collection</h2>
              <p className="text-lg text-[#4B2E2E] opacity-80">Exclusive pieces with premium quality</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.filter(product => product.category === 'Limited Edition').map((product, index) => (
                <div 
                  key={product.id} 
                  className="product-card group animate-fade-in-up hover-lift bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img 
                      src={`http://localhost:3000${product.imageUrl}`} 
                      alt={product.name}
                      className="w-full h-96 object-contain rounded-t-2xl"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 text-sm font-bold shadow-soft animate-pulse">
                        ⭐ LIMITED EDITION
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-lg font-bold text-[#4B2E2E] shadow-soft">
                        ₨{product.price}
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-lilita text-[#4B2E2E] mb-4 group-hover:text-[#C6A664] transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-[#8B5C2A] mb-6 leading-relaxed">
                      Exclusive limited edition piece with premium materials and unique design. 
                      Don't miss out on this rare opportunity to own something truly special.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-[#C6A664]">₨{product.price}</span>
                      <button
                        data-product-id={product.id}
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg shadow-soft hover:shadow-medium transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-base"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.47L17 13M7 13V6h13" />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.filter(product => product.category !== 'Limited Edition').map((product, index) => (
            <div 
              key={product.id} 
              className="product-card group animate-fade-in-up hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={`http://localhost:3000${product.imageUrl}`} 
                  alt={product.name}
                  className="product-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-[#4B2E2E] shadow-soft">
                    ₨{product.price}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-lilita text-[#4B2E2E] mb-3 group-hover:text-[#C6A664] transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#C6A664]">₨{product.price}</span>
                  <button
                    data-product-id={product.id}
                    onClick={() => handleAddToCart(product)}
                    className="bg-gradient-gold text-white font-medium py-1.5 px-3 rounded-lg shadow-soft hover:shadow-medium transform hover:scale-105 transition-all duration-300 flex items-center space-x-1.5 text-sm"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.47L17 13M7 13V6h13" />
                    </svg>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {products.length > 0 && (
          <div className="text-center mt-16 animate-fade-in-up">
            <div className="bg-gradient-secondary rounded-3xl p-8 shadow-large">
              <h2 className="text-3xl font-lilita text-[#4B2E2E] mb-4">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-[#8B5C2A] mb-6 max-w-2xl mx-auto">
                Join thousands of fashion enthusiasts who trust UrbanCore for their streetwear needs. 
                Quality meets style in every piece.
              </p>
              <button className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList; 