import React, { useState } from 'react';
import { Heart, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import ProgressBar from '../common/ProgressBar';
import { formatCurrency } from '../../utils/formatCurrency';
import { useWedding } from '../../context/WeddingContext';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function ContributionModal({
  isOpen,
  onClose,
  item,
  coupleName = 'Arjun & Priya',
}) {
  const { addContribution } = useWedding();

  const [amount, setAmount] = useState('');
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState(0);

  if (!item) return null;

  const remaining = Math.max(0, (item.targetAmount || 0) - (item.currentAmount || 0));

  const handleQuickAmount = (val) => {
    setAmount(String(val));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid contribution amount.');
      return;
    }

    if (remaining > 0 && numericAmount > remaining) {
      // allow small overflow but give gentle note or cap
      // we can let them contribute up to or beyond if it's a gift
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addContribution({
        wishlistItemId: item.id,
        guestName: guestName.trim() || 'A Warm Well-Wisher',
        amount: numericAmount,
        message: message.trim() || 'Wishing you both eternal love and joy!',
      });
      setConfirmedAmount(numericAmount);
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to record contribution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setAmount('');
    setGuestName('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Thank You!' : `Contribute toward ${item.title}`}
      subtitle={isSuccess ? undefined : `A wedding gift for ${coupleName}`}
      size="md"
    >
      {isSuccess ? (
        /* Success Screen */
        <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald/15 border-2 border-emerald mx-auto flex items-center justify-center text-emerald">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="font-heading text-2xl font-bold text-navy mb-1">
              Your Gift Has Been Recorded!
            </h3>
            <p className="font-script text-3xl text-gold mt-1">
              {coupleName}
            </p>
            <p className="text-xs text-navy/60 mt-2 max-w-sm mx-auto leading-relaxed">
              Your contribution of{' '}
              <strong className="text-emerald font-bold text-sm">
                {formatCurrency(confirmedAmount)}
              </strong>{' '}
              toward <strong>{item.title}</strong> has been sent along with your heartfelt wishes.
            </p>
          </div>

          {/* Academic Prototype Notice */}
          <div className="p-3.5 bg-ivory rounded-xl border border-gold/30 text-xs text-navy/70 text-left flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy">Demonstration Completed</p>
              <p className="text-[11px] text-navy/60 mt-0.5">
                This was a mock transaction for academic milestone demonstration. No real bank accounts or credit cards were charged.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleClose}
            >
              Return to Wedding Registry
            </Button>
          </div>
        </div>
      ) : (
        /* Contribution Input Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Target Summary */}
          <div className="p-4 rounded-xl bg-ivory/60 border border-gold/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-navy">Goal Progress</span>
              <span className="text-navy/60">
                Remaining: <strong className="text-navy font-bold">{formatCurrency(remaining)}</strong>
              </span>
            </div>
            <ProgressBar
              current={item.currentAmount}
              target={item.targetAmount}
              showAmount={true}
              size="sm"
            />
          </div>

          {/* Quick Amount Pills */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-2">
              Select Quick Amount
            </label>
            <div className="grid grid-cols-5 gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    amount === String(val)
                      ? 'bg-navy text-gold border-gold shadow-sm font-bold'
                      : 'bg-white text-navy border-navy/15 hover:border-gold hover:bg-gold/5'
                  }`}
                >
                  ₹{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <Input
            label="Or Enter Custom Amount (₹ INR)"
            name="amount"
            type="number"
            placeholder="e.g. 5000"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            error={error}
            icon={IndianRupee}
            required
          />

          {/* Guest Name */}
          <Input
            label="Your Name (Optional)"
            name="guestName"
            placeholder="e.g. Rahul Verma or Sharma Family"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          {/* Personal Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
              Personal Message / Blessing (Optional)
            </label>
            <textarea
              name="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a warm note to celebrate their new chapter together..."
              className="w-full text-sm bg-white border border-navy/15 rounded-lg p-3 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all leading-relaxed"
            />
          </div>

          {/* Demo Payment Notice */}
          <div className="flex items-center gap-2 text-[11px] text-navy/50 bg-navy/5 p-2.5 rounded-lg border border-navy/5">
            <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />
            <span>Demonstration only • No actual payment or credit card required.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              loading={isSubmitting}
              icon={Heart}
            >
              Confirm Gift {amount ? `(${formatCurrency(amount)})` : ''}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
