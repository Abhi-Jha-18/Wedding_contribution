import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Gift, Plane } from 'lucide-react';
import Button from '../common/Button';

export default function Hero() {
  return (
    <section className="relative bg-navy text-white pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Decorative luxury background glow & shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle gold grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C9A45C 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Hero Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 fill-gold" />
              <span>Modern Wedding Gifting for Modern Couples</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
              Your Wedding. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#e8c683] to-gold">
                Your Dreams.
              </span>{' '}
              <br />
              Their Love.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-white/75 font-body max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Turn wedding gifting into something truly meaningful. Instead of duplicate toasters,
              create a customized wishlist for your dream honeymoon, first home, or lifelong adventures —
              and let loved ones contribute with warmth and ease.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Create Your Wishlist
                </Button>
              </Link>
              <Link to="/wedding/arjun-and-priya" className="w-full sm:w-auto">
                <Button
                  variant="outlineGold"
                  size="lg"
                  fullWidth
                  icon={Heart}
                >
                  Explore Demo Wedding
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span>100% Free Demo Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Personalized Invitation Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Direct Guest Well-Wishes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Luxury Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Outer Glow Border Frame */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-gold/50 via-gold/10 to-emerald/40 rounded-3xl blur-md opacity-70" />

              {/* Main Visual Invitation Card */}
              <div className="relative bg-[#162444] rounded-2xl border border-gold/40 p-6 sm:p-7 shadow-2xl backdrop-blur-md">
                {/* Card Header with Couple Names */}
                <div className="text-center pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold mx-auto mb-3 flex items-center justify-center text-gold">
                    <Heart className="w-6 h-6 fill-gold/30" />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold">
                    Wedding Celebration
                  </p>
                  <h3 className="font-script text-4xl text-white mt-1">
                    Arjun & Priya
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    February 14, 2027 • Udaipur, Rajasthan
                  </p>
                </div>

                {/* Floating Interactive Wishlist Preview Cards */}
                <div className="mt-5 space-y-3">
                  {/* Honeymoon Card */}
                  <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 hover:border-gold/40 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gold/20 text-gold">
                          <Plane className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">
                          Dream Honeymoon in Bali
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald">
                        ₹45,000 / ₹1.5L
                      </span>
                    </div>
                    {/* Tiny Progress bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald h-full rounded-full w-[30%]" />
                    </div>
                  </div>

                  {/* Furniture Card */}
                  <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 hover:border-gold/40 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gold/20 text-gold">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">
                          First Home Living Room
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald">
                        ₹32,000 / ₹75K
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald h-full rounded-full w-[43%]" />
                    </div>
                  </div>
                </div>

                {/* Simulated Floating Guest Toast */}
                <div className="mt-5 p-3 rounded-xl bg-gold/15 border border-gold/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold text-navy font-bold text-xs flex items-center justify-center shrink-0">
                    RV
                  </div>
                  <div className="text-xs leading-tight">
                    <p className="font-semibold text-white">
                      Rahul Verma contributed ₹10,000
                    </p>
                    <p className="text-gold/90 italic mt-0.5 truncate max-w-[200px]">
                      "Have an amazing honeymoon! 🌴"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
