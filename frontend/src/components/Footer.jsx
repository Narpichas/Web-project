const Footer = () => (
  <footer className="w-full bg-[#FFF7ED] border-t border-[#C6A664] py-8 mt-16">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <img src="/images/Urban core logo.png" alt="UrbanCore Logo" className="w-10 h-10 rounded-full object-cover border border-[#C6A664] bg-white shadow-sm" />
        <span className="text-xl font-lilita font-extrabold text-[#4B2E2E] tracking-tight select-none">UrbanCore</span>
      </div>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#4B2E2E] hover:text-[#C6A664] text-2xl" aria-label="Instagram">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5zm8.25 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM12 6.75A5.25 5.25 0 1 0 17.25 12 5.25 5.25 0 0 0 12 6.75zm0 1.5A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25z"/></svg>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#4B2E2E] hover:text-[#C6A664] text-2xl" aria-label="Facebook">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
        </a>
      </div>
      <div className="text-[#C6A664] text-sm mt-4 md:mt-0 text-center md:text-right">
        &copy; {new Date().getFullYear()} UrbanCore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer; 