'use client';

export default function Navbar() {
  return (
    <nav className="w-full bg-transparent py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-white text-xl font-bold">ONTHEGO</span>
          <i className="fas fa-motorcycle text-primary-500 text-xl"></i>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-white hover:text-primary-500 transition-colors">
            Home
          </a>
          <a href="#" className="text-white hover:text-primary-500 transition-colors">
            Motors
          </a>
          <a href="#" className="text-white hover:text-primary-500 transition-colors">
            How It Works
          </a>
          <a href="#" className="text-white hover:text-primary-500 transition-colors">
            AI Assistant
          </a>
        </div>
      </div>
    </nav>
  );
}

