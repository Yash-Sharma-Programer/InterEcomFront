import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <p className="text-gray-400">
              Your trusted online shopping destination for quality products and exceptional service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 support@store.com</li>
              <li>📞 +1 (234) 567-8900</li>
              <li>📍 123 Main St, City, State</li>
              <li>Monday - Friday: 9AM - 6PM</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 py-8 text-center text-gray-400">
          <p>&copy; 2026 Your Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
