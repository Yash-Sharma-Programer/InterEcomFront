import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

export default function Header({ isAuthenticated, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Store</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="btn btn-primary text-sm">
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <User className="w-6 h-6" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/products" className="block text-gray-700 hover:text-blue-600">
              Products
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
