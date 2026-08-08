import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, Heart, User, Lock, Mail, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';

const navItems = [
  { label: 'Dashboard', to: '/account/dashboard', icon: LayoutDashboard },
  { label: 'My Orders', to: '/account/orders', icon: Package },
  { label: 'My Addresses', to: '/account/addresses', icon: MapPin },
  { label: 'My Wishlist', to: '/account/wishlist', icon: Heart, badge: true },
  { divider: true },
  { label: 'My Profile', to: '/account/profile', icon: User },
  { label: 'Change Password', to: '/account/password', icon: Lock },
  { label: 'Change Email', to: '/account/email', icon: Mail },
  { label: 'Notification Settings', to: '/account/notifications', icon: Bell },
  { divider: true },
  { label: 'Help Center', to: '/help-center', icon: HelpCircle },
];

export default function AccountLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-6">
      {/* Mobile nav */}
      <nav className="md:hidden mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          {navItems.filter(i => !i.divider).map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-[#FF5A1F] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
          <button onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-red-600 bg-white border border-gray-200">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          {/* User card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-[#FF5A1F] font-bold text-lg">{(user?.name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-[#111827] text-sm truncate">{user?.name || user?.firstName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {navItems.map((item, i) => {
              if (item.divider) return <hr key={i} className="border-gray-100" />;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-[#FF5A1F] border-r-2 border-[#FF5A1F] font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#FF5A1F]'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && wishlistCount > 0 && (
                    <span className="min-w-[20px] h-5 bg-[#FF5A1F] text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                      {wishlistCount}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
            <hr className="border-gray-100" />
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}