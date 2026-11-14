import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Choose Us', href: '#why-us' },
    { label: 'Explore Wishes', href: '#wishlist-preview' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-md py-3.5 border-b border-gold/20'
          : 'bg-navy py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-gold/20" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white">
                Wedd<span className="text-gold">Wish</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gold/80 -mt-1 font-body">
                Midnight Elegance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/wedding/arjun-and-priya"
              className="text-sm font-medium text-gold hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Demo Wedding</span>
              <span className="text-[10px] bg-gold/20 px-1.5 py-0.5 rounded text-gold border border-gold/40">
                LIVE
              </span>
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="sm"
                icon={User}
                onClick={() => navigate('/dashboard')}
              >
                Dashboard ({user.name.split(' ')[0]})
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/90 hover:text-gold px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate('/register')}
                >
                  Create Your Wishlist
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gold p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-b border-gold/20 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-white/90 hover:text-gold py-2"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/wedding/arjun-and-priya"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-gold py-2"
          >
            Sample Wedding Page
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
              >
                Open Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outlineGold"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Create Your Wishlist
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
