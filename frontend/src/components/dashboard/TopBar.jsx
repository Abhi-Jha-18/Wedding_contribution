import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ExternalLink, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWedding } from '../../context/WeddingContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function TopBar({ onMenuClick }) {
  const { user } = useAuth();
  const { weddingProfile, contributions } = useWedding();
  const location = useLocation();

  // Page title calculation based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/dashboard/wedding':
        return 'Wedding Profile';
      case '/dashboard/wishlist':
        return 'Wishlist Management';
      case '/dashboard/contributions':
        return 'Contributions & Wishes';
      case '/dashboard/qr-code':
        return 'Shareable QR Code';
      case '/dashboard/settings':
        return 'Account Settings';
      default:
        return 'Dashboard';
    }
  };

  const coupleSlug = weddingProfile?.slug || 'arjun-and-priya';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-navy/10 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 text-navy/70 hover:text-navy rounded-lg hover:bg-navy/5"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="font-heading text-lg sm:text-xl font-bold text-navy">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-navy/50 hidden sm:block">
              Wedding Wishlist & Gift Platform
            </p>
          </div>
        </div>

        {/* Right: Quick Actions & User Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Public Page Link */}
          <Link
            to={`/wedding/${coupleSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              icon={ExternalLink}
              iconPosition="right"
            >
              Live Wedding Page
            </Button>
          </Link>

          {/* Notifications Indicator */}
          <div className="relative p-2 text-navy/60 hover:text-navy hover:bg-navy/5 rounded-lg cursor-pointer">
            <Bell className="w-4 h-4" />
            {contributions.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald" />
            )}
          </div>

          {/* User mini badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-navy/10">
            <Avatar name={user?.name || 'Couple'} size="sm" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-navy leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-navy/50 leading-tight">Demo Mode</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
