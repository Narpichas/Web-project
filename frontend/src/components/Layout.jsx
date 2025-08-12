import Navbar from './Navbar';

const Layout = ({ children, ...navbarProps }) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#FDEEDC] to-[#C6A664] text-[#4B2E2E]"
    >
      <Navbar {...navbarProps} />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
};

export default Layout; 