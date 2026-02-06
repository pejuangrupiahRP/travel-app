import React from 'react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-600 text-center md:text-left">
            <p>
              &copy; {currentYear} <span className="font-semibold text-indigo-600">TravelKu</span>. 
              All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <a
              href="/admin/help"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              Bantuan
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/admin/documentation"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              Dokumentasi
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/admin/privacy"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              Kebijakan Privasi
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/admin/terms"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
            >
              Syarat & Ketentuan
            </a>
          </div>

          {/* Version Info */}
          <div className="text-sm text-gray-500">
            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;