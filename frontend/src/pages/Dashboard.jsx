import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coins,
  Gift,
  Users,
  TrendingUp,
  Heart,
  Plus,
  Calendar,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, formatRelativeTime } from '../utils/helpers';

export default function Dashboard() {
  const { user } = useAuth();
  const { weddingProfile, wishlistItems, contributions, activities } = useWedding();
  const navigate = useNavigate();

  // Financial calculations
  const totalContributed = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const totalTarget = wishlistItems.reduce((sum, i) => sum + Number(i.targetAmount || 0), 0);
  const uniqueContributors = new Set(contributions.map((c) => c.guestName || 'Anonymous')).size;
  const overallPercentage = totalTarget > 0 ? Math.round((totalContributed / totalTarget) * 100) : 0;

  const coupleSlug = weddingProfile?.slug || 'arjun-and-priya';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="bg-gradient-to-r from-navy via-[#16274a] to-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-gold/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 fill-gold/20" />
              <span>Couple Management Dashboard</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user?.name || 'Arjun'}!
            </h2>
            <p className="text-white/70 text-sm mt-1 max-w-xl font-body">
              Here is what has happened with your wedding registry. Guests are helping bring your
              dream celebration and honeymoon to life.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => navigate('/dashboard/wishlist')}
            >
              Add Wishlist Item
            </Button>
            <Link to={`/wedding/${coupleSlug}`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outlineGold"
                size="sm"
                icon={ExternalLink}
                iconPosition="right"
              >
                View Public Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 Key Performance Stat Cards ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Contributions"
          value={formatCurrency(totalContributed)}
          subtitle={`Target: ${formatCurrency(totalTarget)}`}
          icon={Coins}
          trend={{ value: '18%', isPositive: true }}
        />
        <StatCard
          title="Wishlist Goals"
          value={wishlistItems.length}
          subtitle={`${wishlistItems.filter((i) => i.currentAmount >= i.targetAmount).length} fully funded`}
          icon={Gift}
        />
        <StatCard
          title="Generous Guests"
          value={uniqueContributors}
          subtitle="Family & friends joined"
          icon={Users}
        />
        <StatCard
          title="Overall Progress"
          value={`${overallPercentage}%`}
          subtitle="Of total registry funded"
          icon={TrendingUp}
          trend={{ value: '12%', isPositive: true }}
        />
      </div>

      {/* ── Middle Grid: Wedding Summary + Top Wishlist ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Wedding Profile Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-navy/10 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-navy/5 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
                <h3 className="font-heading text-lg font-bold text-navy">
                  Wedding Summary
                </h3>
              </div>
              <Link to="/dashboard/wedding">
                <Button variant="ghost" size="sm">
                  Edit Details
                </Button>
              </Link>
            </div>

            {/* Couple names in script font */}
            <div className="text-center py-4 bg-ivory/60 rounded-xl border border-gold/20 mb-5">
              <p className="text-xs uppercase tracking-widest text-navy/50 font-semibold">
                Celebrating Love
              </p>
              <h4 className="font-script text-3xl sm:text-4xl text-navy mt-1">
                {weddingProfile?.partner1 || 'Partner 1'} &{' '}
                {weddingProfile?.partner2 || 'Partner 2'}
              </h4>
            </div>

            <div className="space-y-3.5 text-sm text-navy/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy/60 shrink-0">
                  <Calendar className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-[11px] text-navy/50 font-semibold uppercase">Date</p>
                  <p className="font-medium text-navy">
                    {weddingProfile?.weddingDate
                      ? formatDate(weddingProfile.weddingDate)
                      : 'Date not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy/60 shrink-0">
                  <MapPin className="w-4 h-4 text-emerald" />
                </div>
                <div>
                  <p className="text-[11px] text-navy/50 font-semibold uppercase">Venue</p>
                  <p className="font-medium text-navy">
                    {weddingProfile?.location || 'Location not specified'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-navy/50 font-semibold uppercase mb-1">Our Story</p>
                <p className="text-xs text-navy/70 line-clamp-3 leading-relaxed">
                  {weddingProfile?.description || 'Add your romantic story for guests to read.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-navy/5 flex items-center justify-between">
              <Link to={`/wedding/${coupleSlug}`} className="text-xs text-gold font-semibold hover:underline flex items-center gap-1">
                <span>View Public Page</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link to="/dashboard/qr-code">
                <Button variant="outline" size="sm" icon={Share2}>
                  Share QR
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Right: Wishlist Goals Showcase (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="border border-navy/10">
            <div className="flex items-center justify-between pb-4 border-b border-navy/5 mb-5">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-gold" />
                <h3 className="font-heading text-lg font-bold text-navy">
                  Top Wishlist Dreams
                </h3>
              </div>
              <Link to="/dashboard/wishlist">
                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  Manage All ({wishlistItems.length})
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {wishlistItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-navy/5 bg-ivory/30 hover:bg-ivory/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-navy text-sm">
                          {item.title}
                        </h4>
                        <Badge variant="gold" size="sm">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-navy/60 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald">
                        {formatCurrency(item.currentAmount)}
                      </span>
                      <span className="text-[11px] text-navy/40 block">
                        of {formatCurrency(item.targetAmount)}
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    current={item.currentAmount}
                    target={item.targetAmount}
                    showAmount={false}
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-navy/5 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => navigate('/dashboard/wishlist')}
              >
                Create New Goal
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Bottom Section: Recent Activity Feed ───────────── */}
      <Card className="border border-navy/10">
        <div className="flex items-center justify-between pb-4 border-b border-navy/5 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-navy/60" />
            <h3 className="font-heading text-lg font-bold text-navy">
              Recent Activity & Guest Gifts
            </h3>
          </div>
          <Link to="/dashboard/contributions">
            <Button variant="ghost" size="sm">
              All Contributions
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-navy/5">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ivory border border-gold/30 flex items-center justify-center text-navy font-bold text-xs shrink-0">
                  {act.type === 'contribution' ? (
                    <Coins className="w-4 h-4 text-emerald" />
                  ) : act.type === 'wish' ? (
                    <Heart className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-gold" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-navy">
                    {act.description}
                  </p>
                  <p className="text-[11px] text-navy/40">
                    {formatRelativeTime(act.timestamp)}
                  </p>
                </div>
              </div>

              {act.amount && (
                <span className="text-xs sm:text-sm font-bold text-emerald shrink-0">
                  +{formatCurrency(act.amount)}
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
