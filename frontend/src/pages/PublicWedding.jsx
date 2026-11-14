import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Gift,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { sampleCouple } from '../data/sampleData';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import ContributionModal from '../components/wedding/ContributionModal';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatRelativeTime } from '../utils/helpers';

export default function PublicWedding() {
  const { slug } = useParams();
  const { weddingProfile, wishlistItems, guestWishes, addGuestWish } = useWedding();

  // If this profile matches the slug or fallback to sample
  const couple = weddingProfile?.slug === slug ? weddingProfile : sampleCouple;

  // Selected item for modal
  const [selectedItem, setSelectedItem] = useState(null);

  // Guest wish form state
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [isSendingWish, setIsSendingWish] = useState(false);

  const coupleNameFormatted = `${couple.partner1} & ${couple.partner2}`;

  const handleSendWish = (e) => {
    e.preventDefault();
    if (!wishMessage.trim()) return;

    setIsSendingWish(true);
    addGuestWish({
      guestName: wishName.trim() || 'Well-Wisher',
      message: wishMessage.trim(),
    });

    setWishName('');
    setWishMessage('');
    setIsSendingWish(false);
    setWishSubmitted(true);
    setTimeout(() => setWishSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-ivory text-navy flex flex-col font-body selection:bg-gold selection:text-navy">
      {/* ── Top Floating Minimal Bar ───────────────────────── */}
      <header className="sticky top-0 z-30 bg-navy/90 backdrop-blur-md border-b border-gold/30 px-4 py-3 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-gold">
              <Sparkles className="w-3.5 h-3.5 fill-gold/20" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              Wedd<span className="text-gold">Wish</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gold/90 uppercase tracking-widest hidden sm:inline">
              Official Wedding Registry
            </span>
            <Link to="/register">
              <Button variant="secondary" size="sm">
                Create Your Own
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Section 1: Hero Wedding Invitation Header ──────── */}
      <section className="relative py-20 sm:py-28 text-center px-4 overflow-hidden bg-gradient-to-b from-white via-ivory to-ivory border-b border-gold/20">
        {/* Subtle Decorative Rings in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gold/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-gold/10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Top Invitation Crest */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ivory border-2 border-gold mb-6 shadow-sm text-gold">
            <Heart className="w-7 h-7 fill-gold/20 text-gold" />
          </div>

          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] font-semibold text-gold mb-3">
            Together with their families
          </p>

          {/* Couple Names in Great Vibes Script */}
          <h1 className="font-script text-6xl sm:text-7xl lg:text-8xl text-navy tracking-wide leading-tight my-2">
            {couple.partner1} <br className="sm:hidden" />
            <span className="text-gold text-5xl sm:text-6xl mx-2">&</span> <br className="sm:hidden" />
            {couple.partner2}
          </h1>

          {/* Gold Decorative Separator */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-[1px] w-16 bg-gold/40" />
            <Sparkles className="w-4 h-4 text-gold fill-gold/30" />
            <div className="h-[1px] w-16 bg-gold/40" />
          </div>

          {/* Logistics Date & Venue */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm font-medium text-navy/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>{formatDate(couple.weddingDate)}</span>
            </div>
            <div className="hidden sm:block text-gold">•</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald" />
              <span>{couple.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Our Story ────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            A Journey of Love
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-1">
            Our Story
          </h2>
          <div className="w-12 h-1 bg-gold mx-auto my-3 rounded-full" />
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gold/30 shadow-md relative">
          {couple.photo && (
            <div className="mb-8 rounded-2xl overflow-hidden max-h-80 shadow-md">
              <img
                src={couple.photo}
                alt={coupleNameFormatted}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-base sm:text-lg text-navy/75 leading-relaxed font-body text-center max-w-2xl mx-auto">
            "{couple.description}"
          </p>

          <div className="mt-8 pt-6 border-t border-navy/5 flex items-center justify-center gap-2 text-xs text-navy/50">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-200" />
            <span>Thank you for celebrating with us and supporting our future</span>
          </div>
        </div>
      </section>

      {/* ── Section 3: Wedding Wishlist Goals ───────────────── */}
      <section id="wishlist" className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-b border-gold/20">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-semibold uppercase tracking-wider mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span>Wedding Registry</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
              Help Make Our Dreams Come True
            </h2>
            <p className="text-sm sm:text-base text-navy/65 mt-3 leading-relaxed">
              Your presence at our wedding is the greatest gift of all. If you wish to bless us with a
              token of love, we invite you to contribute toward our shared goals below.
            </p>
          </div>

          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((item) => {
              const isFunded = item.currentAmount >= item.targetAmount;

              return (
                <Card
                  key={item.id}
                  hover
                  padding="none"
                  className={`flex flex-col justify-between border ${
                    isFunded ? 'border-emerald/40 bg-emerald/5' : 'border-navy/10 bg-white'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={isFunded ? 'emerald' : 'gold'} size="sm">
                        {item.category}
                      </Badge>
                      {isFunded && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Fully Funded!</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-xl font-bold text-navy mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy/65 leading-relaxed line-clamp-3 min-h-[48px]">
                      {item.description}
                    </p>
                  </div>

                  {/* Progress & Target Section */}
                  <div className="p-6 pt-0 space-y-5">
                    <div className="p-4 rounded-xl bg-ivory border border-gold/20">
                      <ProgressBar
                        current={item.currentAmount}
                        target={item.targetAmount}
                        showAmount={true}
                        size="md"
                      />
                    </div>

                    <Button
                      variant={isFunded ? 'outline' : 'emerald'}
                      size="md"
                      fullWidth
                      icon={Heart}
                      onClick={() => setSelectedItem(item)}
                    >
                      {isFunded ? 'Contribute More' : 'Contribute to Goal'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: Guestbook Blessings ─────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">
            Guest Blessings
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-navy mt-1">
            Leave Your Wedding Wishes
          </h2>
          <p className="text-sm text-navy/60 mt-2 max-w-md mx-auto">
            Share warm words, marriage advice, or joyous memories with the couple.
          </p>
        </div>

        {/* Wish Submission Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-navy/10 shadow-sm mb-12">
          {wishSubmitted && (
            <div className="mb-4 p-3.5 bg-emerald/10 border border-emerald/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your wedding wish has been placed in their guestbook.</span>
            </div>
          )}

          <form onSubmit={handleSendWish} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya & Karthik"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  className="w-full text-sm bg-white border border-navy/15 rounded-lg p-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Write a sweet message for the couple..."
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  required
                  className="w-full text-sm bg-white border border-navy/15 rounded-lg p-2.5 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                loading={isSendingWish}
                icon={Send}
              >
                Post Wedding Wish
              </Button>
            </div>
          </form>
        </div>

        {/* Existing Wishes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guestWishes.map((w) => (
            <div
              key={w.id}
              className="bg-white p-6 rounded-2xl border border-gold/30 shadow-sm relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-xs flex items-center justify-center">
                      {(w.guestName || 'G')[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-navy">
                        {w.guestName}
                      </h4>
                      <p className="text-[10px] text-navy/40">
                        {formatRelativeTime(w.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Heart className="w-4 h-4 text-gold fill-gold/20" />
                </div>

                <p className="text-xs sm:text-sm text-navy/75 italic leading-relaxed">
                  "{w.message}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Public Page Footer ──────────────────────────────── */}
      <footer className="mt-auto py-10 bg-navy text-white text-center text-xs border-t border-gold/30">
        <p className="font-heading text-base font-bold text-white mb-1">
          {coupleNameFormatted}
        </p>
        <p className="text-gold/80 font-script text-2xl mb-4">
          With Love and Gratitude
        </p>
        <p className="text-white/40">
          Powered by{' '}
          <Link to="/" className="text-gold hover:underline font-semibold">
            WeddWish
          </Link>{' '}
          • Digital Wedding Registry Platform
        </p>
      </footer>

      {/* ── Contribution Modal ──────────────────────────────── */}
      {selectedItem && (
        <ContributionModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          coupleName={coupleNameFormatted}
        />
      )}
    </div>
  );
}
