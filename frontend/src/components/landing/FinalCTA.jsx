import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Button from '../common/Button';

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 bg-navy text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Decorative Top Accent */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 border border-gold mb-6 text-gold">
          <Heart className="w-6 h-6 fill-gold/40" />
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
          Ready to Start Your Wedding Wishlist?
        </h2>

        <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
          Create your personalized registry in minutes. Invite your friends and family to be part of
          your most cherished dreams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon={Sparkles}
            >
              Get Started Free
            </Button>
          </Link>
          <Link to="/wedding/arjun-and-priya" className="w-full sm:w-auto">
            <Button
              variant="outlineGold"
              size="lg"
              fullWidth
              icon={ArrowRight}
              iconPosition="right"
            >
              See Sample Wedding Page
            </Button>
          </Link>
        </div>

        <p className="text-xs text-white/50 mt-8">
          Free academic prototype • No credit card required • Instant setup
        </p>
      </div>
    </section>
  );
}
