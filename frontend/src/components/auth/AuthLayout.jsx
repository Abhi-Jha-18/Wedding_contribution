import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export default function AuthLayout({
  children,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left Column: Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Brand header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 fill-gold/20" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-navy">
                Wedd<span className="text-gold">Wish</span>
              </span>
            </Link>

            <h1 className="font-heading text-3xl font-bold text-navy tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-navy/60 font-body">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl border border-navy/10 shadow-lg">
            {children}
          </div>
        </div>
      </div>

      {/* Right Column: Decorative Luxury Panel (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden flex-col justify-between p-12 text-white">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tagline */}
        <div className="relative z-10 flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest">
          <Heart className="w-4 h-4 fill-gold/30" />
          <span>Curated Wedding Experience</span>
        </div>

        {/* Center Romantic Wedding Editorial Quote */}
        <div className="relative z-10 max-w-lg my-auto">
          <p className="font-script text-5xl text-gold/90 mb-4 leading-relaxed">
            "Two souls, one heartfelt journey."
          </p>
          <blockquote className="font-heading text-2xl font-normal leading-snug text-white/90 mb-6">
            Let your loved ones contribute to experiences that will last a lifetime, not items that will gather dust.
          </blockquote>
          <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-white/70">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald" />
              <span>Full control over your dream wishlist goals</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald" />
              <span>Direct guestbook wishes from friends & family</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald" />
              <span>Free demonstration platform for college project</span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 text-xs text-white/40 flex items-center justify-between">
          <span>WeddWish Platform © 2027</span>
          <span>Theme: Midnight Elegance</span>
        </div>
      </div>
    </div>
  );
}
