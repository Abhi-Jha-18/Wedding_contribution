import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  Gift,
  Coins,
  QrCode,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWedding } from '../../context/WeddingContext';
import Avatar from '../common/Avatar';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { weddingProfile } = useWedding();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Wedding', to: '/dashboard/wedding', icon: Heart },
    { label: 'My Wishlist', to: '/dashboard/wishlist', icon: Gift },
    { label: 'Contributions', to: '/dashboard/contributions', icon: Coins },
    { label: 'QR Code', to: '/dashboard/qr-code', icon: QrCode },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

  const coupleSlug = weddingProfile?.slug || 'arjun-and-priya';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy text-white flex flex-col justify-between border-r border-gold/20 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold">
                <Sparkles className="w-4 h-4 fill-gold/20" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                Wedd<span className="text-gold">Wish</span>
              </span>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Couple Name'}
              </p>
              <p className="text-[11px] text-gold/80 truncate">
                {weddingProfile?.partner1 && weddingProfile?.partner2
                  ? `${weddingProfile.partner1.split(' ')[0]} & ${weddingProfile.partner2.split(' ')[0]}`
                  : 'Registry Manager'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gold text-navy font-bold shadow-sm'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Quick link to public page */}
          <Link
            to={`/wedding/${coupleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gold bg-gold/10 hover:bg-gold/20 border border-gold/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Wedding Page</span>
            </span>
            <span className="text-[10px] bg-gold text-navy font-bold px-1.5 py-0.5 rounded">
              VIEW
            </span>
          </Link>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
