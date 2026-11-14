import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, Shield, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b1324] text-white border-t border-gold/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold">
                <Sparkles className="w-5 h-5 fill-gold/20" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Wedd<span className="text-gold">Wish</span>
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
              The modern, dignified digital wedding registry for couples celebrating love in India.
              Turn well-wishes into unforgettable experiences and lifelong goals.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gold">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span>Academic Prototype • Milestone 1 Frontend</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="#how-it-works" className="hover:text-gold transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-gold transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#wishlist-preview" className="hover:text-gold transition-colors">
                  Sample Wishlists
                </a>
              </li>
              <li>
                <Link to="/wedding/arjun-and-priya" className="hover:text-gold transition-colors">
                  Arjun & Priya's Registry
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">
              Couples
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link to="/login" className="hover:text-gold transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gold transition-colors">
                  Create Registry
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-gold transition-colors">
                  Couple Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Tech */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-4">
              College Project
            </h4>
            <div className="text-sm text-white/70 space-y-2.5">
              <p className="text-xs text-white/50">
                Designed with Midnight Elegance: Navy, Gold, Soft Ivory & Emerald.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/60 pt-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>support@weddwish.internal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2027 WeddWish Platform. Built for academic demonstration.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-gold">
              Crafted with <Heart className="w-3.5 h-3.5 fill-gold" /> for memorable weddings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
