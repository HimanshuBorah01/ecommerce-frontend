import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h1 className="text-7xl font-bold text-gray-200 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>500</h1>
        <div className="h-0.5 w-16 bg-gray-200 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-[#111827] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Server Error</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Something went wrong on our end. We're working to fix it. Please try again in a moment.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="btn-outline">
            <RefreshCw size={16} /> Try Again
          </button>
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}