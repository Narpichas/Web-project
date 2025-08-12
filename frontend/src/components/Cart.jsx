import { useState } from 'react';

const Cart = ({ cart, onRemoveFromCart, onClearCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const total = cart.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

  const handleCheckout = () => {
    setShowModal(true);
    setSelectedMethod(null);
    setOrderSuccess('');
    setOrderError('');
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMethod(null);
    setOrderSuccess('');
    setOrderError('');
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderSuccess('');
    setOrderError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          total,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to place order');
      }
      setOrderSuccess('Order placed successfully!');
      if (onClearCart) onClearCart();
      setTimeout(() => {
        setShowModal(false);
        setOrderSuccess('');
      }, 1500);
    } catch (err) {
      setOrderError(err.message || 'Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="bg-[#FFF7ED] min-h-screen py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-yellow-100">
        <h2 className="text-3xl font-lilita text-[#4B2E2E] mb-8 text-center">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center py-10">
            <svg className="w-20 h-20 text-[#C6A664] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.52 17h8.96a1 1 0 00.87-1.47L17 13M7 13V6h13" />
            </svg>
            <div className="text-[#C6A664] text-lg font-semibold mb-2">Your cart is empty.</div>
            <div className="text-[#4B2E2E] text-sm">Add some products to see them here!</div>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-yellow-200 mb-6">
              {cart.map(item => (
                <li key={item.id} className="flex items-center py-4">
                  <img
                    src={`http://localhost:3000${item.imageUrl}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg bg-yellow-100 mr-4 border border-yellow-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-lilita text-[#4B2E2E]">{item.name}</h3>
                    <p className="text-[#C6A664]">₨{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <div className="text-[#4B2E2E] font-bold text-lg">
                      ₨{(item.quantity * parseFloat(item.price)).toFixed(2)}
                    </div>
                    <button
                      onClick={() => onRemoveFromCart && onRemoveFromCart(item.id)}
                      className="mt-2 bg-[#FDEEDC] text-[#8B5C2A] px-3 py-1 rounded-lg text-xs font-medium hover:bg-[#C6A664] hover:text-[#FFFFFF] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right text-2xl font-bold text-[#4B2E2E] mb-4">
              Total: ₨{total.toFixed(2)}
            </div>
            <div className="flex justify-center">
              <button className="btn-primary w-full max-w-xs" onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-[#C6A664] hover:text-[#4B2E2E] text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-lilita text-[#4B2E2E] mb-6 text-center">Choose Payment Method</h3>
            <div className="flex flex-col gap-4 mb-6">
              <button
                className={`w-full py-3 rounded-lg border-2 font-semibold transition-colors ${selectedMethod === 'bank' ? 'border-[#C6A664] bg-[#FFF7ED] text-[#4B2E2E]' : 'border-[#FDEEDC] bg-white text-[#4B2E2E] hover:border-[#C6A664]'}`}
                onClick={() => handleSelectMethod('bank')}
              >
                Bank Transfer
              </button>
              <button
                className={`w-full py-3 rounded-lg border-2 font-semibold transition-colors ${selectedMethod === 'esewa' ? 'border-[#C6A664] bg-[#FFF7ED] text-[#4B2E2E]' : 'border-[#FDEEDC] bg-white text-[#4B2E2E] hover:border-[#C6A664]'}`}
                onClick={() => handleSelectMethod('esewa')}
              >
                eSewa
              </button>
            </div>
            {selectedMethod && (
              <div className="flex flex-col items-center">
                <p className="mb-2 text-[#4B2E2E] font-semibold">Scan the QR to pay with {selectedMethod === 'bank' ? 'Bank Transfer' : 'eSewa'}:</p>
                <img
                  src={selectedMethod === 'bank' ? '/images/bank-qr.png' : '/images/esewa-qr.png'}
                  alt={`${selectedMethod} QR`}
                  className="w-48 h-48 object-contain rounded-lg border-2 border-[#C6A664] bg-[#FFF7ED] shadow-xl transition-transform duration-300 ease-out scale-90 opacity-0 animate-pop-in"
                />
                <button
                  className="btn-primary mt-6 w-full"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
                {orderSuccess && <div className="text-green-600 text-sm mt-4">{orderSuccess}</div>}
                {orderError && <div className="text-red-600 text-sm mt-4">{orderError}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart; 