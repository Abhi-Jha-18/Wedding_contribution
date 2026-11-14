import React from 'react';
import { Link } from 'react-router-dom';
import { sampleWishlistItems } from '../../data/sampleData';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import Button from '../common/Button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function WishlistPreview() {
  // Show top 3 sample items
  const previewItems = sampleWishlistItems.slice(0, 3);

  return (
    <section id="wishlist-preview" className="py-20 sm:py-28 bg-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-bold">
              Real Aspirations
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight mt-2">
              What Couples Are Dreaming Of
            </h2>
            <p className="text-navy/60 text-base mt-2 max-w-xl">
              From adventurous honeymoons to cozy living spaces, see how easily guests can chip in.
            </p>
          </div>

          <Link to="/wedding/arjun-and-priya">
            <Button variant="outline" icon={ArrowRight} iconPosition="right">
              View Arjun & Priya's Full Registry
            </Button>
          </Link>
        </div>

        {/* Wishlist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewItems.map((item) => (
            <Card
              key={item.id}
              hover
              padding="none"
              className="flex flex-col justify-between border border-navy/10 bg-white"
            >
              {/* Card visual header */}
              <div className="relative p-6 bg-gradient-to-br from-navy to-[#18294d] text-white">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="gold" size="sm">
                    {item.category}
                  </Badge>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-white/70 line-clamp-2 min-h-[32px]">
                  {item.description}
                </p>
              </div>

              {/* Card body & progress */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <ProgressBar
                    current={item.currentAmount}
                    target={item.targetAmount}
                    showAmount={true}
                    size="md"
                  />
                </div>

                {/* Simulated action button linking to demo wedding */}
                <Link to="/wedding/arjun-and-priya" className="w-full">
                  <Button
                    variant="emerald"
                    size="md"
                    fullWidth
                    icon={Heart}
                  >
                    Contribute to Goal
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
