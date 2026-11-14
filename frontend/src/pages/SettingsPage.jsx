import React, { useState } from 'react';
import { Shield, RefreshCw, CheckCircle, User, Mail, Database } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset demo data back to initial sample state? This will clear locally added goals and contributions.')) {
      localStorage.removeItem('weddwish_wishlist_items');
      localStorage.removeItem('weddwish_contributions');
      localStorage.removeItem('weddwish_guest_wishes');
      localStorage.removeItem('weddwish_activities');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
          Platform Settings
        </h2>
        <p className="text-sm text-navy/60 font-body">
          Manage your account preferences and demonstration configuration.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-4 bg-emerald/10 border border-emerald/30 rounded-2xl flex items-center gap-3 text-sm text-emerald font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Demo storage reset! Reloading default sample data...</span>
        </div>
      )}

      {/* Account Info */}
      <Card className="border border-navy/10 space-y-4">
        <h3 className="font-heading font-bold text-navy text-lg flex items-center gap-2">
          <User className="w-4 h-4 text-gold" />
          <span>Account Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Account Name"
            value={user?.name || 'Arjun Mehta'}
            disabled
          />
          <Input
            label="Registered Email"
            value={user?.email || 'demo@weddwish.com'}
            disabled
            icon={Mail}
          />
        </div>
        <p className="text-[11px] text-navy/40">
          This account is operating under demonstration mode. Full profile editing with password change will be supported via FastAPI in Milestone 2.
        </p>
      </Card>

      {/* Demo Data Management */}
      <Card className="border border-navy/10 space-y-4">
        <h3 className="font-heading font-bold text-navy text-lg flex items-center gap-2">
          <Database className="w-4 h-4 text-gold" />
          <span>Local Storage Demonstration Data</span>
        </h3>
        <p className="text-xs text-navy/60 leading-relaxed">
          Wishlist items, custom goals, guest messages, and financial contributions are saved to your browser's local storage. You can restore original sample data at any time.
        </p>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={handleResetData}
          >
            Reset Demo Data to Initial Sample State
          </Button>
        </div>
      </Card>

      {/* Future Backend Compatibility Note */}
      <div className="p-5 rounded-2xl bg-ivory border border-gold/30 text-xs text-navy/70 space-y-2">
        <div className="flex items-center gap-2 font-bold text-navy uppercase tracking-wider text-[11px]">
          <Shield className="w-4 h-4 text-gold" />
          <span>Academic Prototype Notice</span>
        </div>
        <p className="leading-relaxed">
          In this Milestone 1, authentication and wishlist management run directly on client state and localStorage. The service functions in <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-navy/10">src/services/</code> have been prepared to connect seamlessly with the upcoming Python FastAPI and PostgreSQL backend in Milestone 2.
        </p>
      </div>
    </div>
  );
}
