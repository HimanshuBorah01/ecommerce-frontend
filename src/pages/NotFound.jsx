import { Link } from 'react-router-dom';
import { Home, Search, Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={40} className="text-[#FF5A1F]" />
        </div>
        <h1 className="text-7xl font-bold text-gray-200 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>404</h1>
        <div className="h-0.5 w-16 bg-gray-200 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-[#111827] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/search" className="btn-outline">
            <Package size={16} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}