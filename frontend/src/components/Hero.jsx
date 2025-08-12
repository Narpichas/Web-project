import React from 'react';

const Hero = ({ onShopNow }) => {
  return (
    <section className="w-full pt-40 pb-20 bg-[#FFF7ED]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-10">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-lilita font-extrabold text-[#4B2E2E] mb-4 drop-shadow-lg">Limited Edition</h1>
          <p className="text-lg md:text-xl text-[#4B2E2E] mb-8 max-w-xl mx-auto md:mx-0">Discover our exclusive limited edition outfit. Stand out with unique style and premium quality—available only for a short time!</p>
          <button
            onClick={onShopNow}
            className="bg-[#C6A664] text-[#4B2E2E] font-bold px-8 py-3 rounded-full shadow hover:bg-[#4B2E2E] hover:text-[#FFF7ED] transition-transform transition-colors text-lg transform hover:scale-105 duration-200"
          >
            Shop Now
          </button>
        </div>
        {/* Featured Product Image */}
        <div className="flex-1 flex justify-center md:justify-end mt-12 md:mt-0">
          <img
            src="/images/limited edition.jpg"
            alt="Limited Edition Outfit"
            className="w-72 h-72 md:w-96 md:h-96 object-contain rounded-2xl shadow-lg border-4 border-[#C6A664] bg-white"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/Urban core logo.png';
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 