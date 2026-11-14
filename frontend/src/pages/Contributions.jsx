import React, { useState } from 'react';
import { Coins, Heart, MessageSquare, User, Search } from 'lucide-react';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { useWedding } from '../context/WeddingContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeTime } from '../utils/helpers';

export default function Contributions() {
  const { contributions, wishlistItems, guestWishes } = useWedding();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('contributions'); // 'contributions' | 'wishes'

  const totalAmount = contributions.reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const totalCount = contributions.length;
  const avgAmount = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

  // Filtered contributions
  const filteredContributions = contributions.filter((c) => {
    const nameMatch = (c.guestName || 'Anonymous').toLowerCase().includes(searchTerm.toLowerCase());
    const msgMatch = (c.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || msgMatch;
  });

  // Helper to get item title
  const getItemTitle = (wishlistItemId) => {
    const item = wishlistItems.find((i) => i.id === wishlistItemId);
    return item ? item.title : 'General Wedding Fund';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
          Contributions & Guest Blessings
        </h2>
        <p className="text-sm text-navy/60 font-body">
          Review gifts, guestbook wishes, and financial support sent by your loved ones.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalAmount)}
          subtitle="Direct demonstration gifts"
          icon={Coins}
        />
        <StatCard
          title="Total Contributions"
          value={totalCount}
          subtitle="From family & friends"
          icon={User}
        />
        <StatCard
          title="Average Gift"
          value={formatCurrency(avgAmount)}
          subtitle="Per contributor"
          icon={Heart}
        />
      </div>

      {/* Main Content Tabs & Table */}
      <Card padding="none" className="border border-navy/10 overflow-hidden">
        {/* Tab Selector & Search bar */}
        <div className="p-4 sm:p-6 border-b border-navy/10 bg-ivory/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('contributions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'contributions'
                  ? 'bg-navy text-gold shadow-sm'
                  : 'text-navy/60 hover:text-navy hover:bg-navy/5'
              }`}
            >
              Contributions ({contributions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wishes')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'wishes'
                  ? 'bg-navy text-gold shadow-sm'
                  : 'text-navy/60 hover:text-navy hover:bg-navy/5'
              }`}
            >
              Guestbook Wishes ({guestWishes.length})
            </button>
          </div>

          {activeTab === 'contributions' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
              <input
                type="text"
                placeholder="Search guest or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-white border border-navy/15 rounded-xl pl-9 pr-3 py-2 text-navy placeholder:text-navy/40 focus:outline-none focus:border-gold"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Contributions List */}
        {activeTab === 'contributions' && (
          <div>
            {filteredContributions.length === 0 ? (
              <EmptyState
                icon={Coins}
                title="No Contributions Found"
                description={
                  searchTerm
                    ? 'No gifts matched your search filter.'
                    : 'Contributions sent by guests on your public page will appear here.'
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-navy">
                  <thead className="bg-navy/5 text-[11px] uppercase tracking-wider text-navy/60 font-semibold border-b border-navy/5">
                    <tr>
                      <th className="py-3 px-6">Guest</th>
                      <th className="py-3 px-6">Goal</th>
                      <th className="py-3 px-6">Amount</th>
                      <th className="py-3 px-6">Message</th>
                      <th className="py-3 px-6 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/5">
                    {filteredContributions.map((c) => (
                      <tr key={c.id} className="hover:bg-ivory/40 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-navy text-gold font-bold text-xs flex items-center justify-center shrink-0">
                              {(c.guestName || 'A')[0]}
                            </div>
                            <span>{c.guestName || 'Anonymous Guest'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/70">
                          <Badge variant="default" size="sm">
                            {getItemTitle(c.wishlistItemId)}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 font-bold text-emerald text-sm">
                          {formatCurrency(c.amount)}
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/70 italic max-w-xs truncate">
                          "{c.message || 'Best wishes to both of you!'}"
                        </td>
                        <td className="py-4 px-6 text-xs text-navy/50 text-right whitespace-nowrap">
                          {formatRelativeTime(c.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Guestbook Wishes List */}
        {activeTab === 'wishes' && (
          <div className="p-6">
            {guestWishes.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No Guest Wishes Yet"
                description="When guests leave messages on your public wedding page, they will show up here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guestWishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="p-5 rounded-xl border border-navy/10 bg-ivory/40 relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gold/20 text-navy font-bold text-xs flex items-center justify-center">
                            {(wish.guestName || 'G')[0]}
                          </div>
                          <h4 className="font-semibold text-sm text-navy">
                            {wish.guestName}
                          </h4>
                        </div>
                        <span className="text-[10px] text-navy/40">
                          {formatRelativeTime(wish.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-navy/75 leading-relaxed italic">
                        "{wish.message}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-navy/5 flex items-center gap-1.5 text-[11px] text-gold font-medium">
                      <Heart className="w-3.5 h-3.5 fill-gold/30" />
                      <span>Guestbook Memory</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
