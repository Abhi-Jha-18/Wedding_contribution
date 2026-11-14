import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Heart } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useWedding } from '../context/WeddingContext';

export default function QRCodePage() {
  const { weddingProfile } = useWedding();
  const [copied, setCopied] = useState(false);

  const slug = weddingProfile?.slug || 'arjun-and-priya';
  const fullUrl = `${window.location.origin}/wedding/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
          Shareable QR Code & Links
        </h2>
        <p className="text-sm text-navy/60 font-body">
          Print this QR code on your physical wedding cards or copy the direct link for WhatsApp and email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: The Printable Invitation Card with SVG QR code */}
        <div className="md:col-span-6">
          <div className="relative p-1 bg-gradient-to-tr from-gold/50 via-gold/20 to-navy rounded-3xl shadow-xl">
            <div className="bg-white rounded-[22px] p-6 text-center border border-gold/30">
              <div className="w-10 h-10 rounded-full bg-navy text-gold mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-gold/40" />
              </div>

              <p className="text-[10px] uppercase font-bold tracking-widest text-gold">
                Scan to Contribute & Wish
              </p>

              <h3 className="font-script text-3xl text-navy mt-1 mb-1">
                {weddingProfile?.partner1 || 'Arjun'} & {weddingProfile?.partner2 || 'Priya'}
              </h3>

              <p className="text-[11px] text-navy/50 mb-5">
                Our Wedding Registry & Guestbook
              </p>

              {/* Styled Vector QR Code Representation */}
              <div className="p-4 bg-ivory rounded-2xl border border-gold/40 inline-block shadow-inner mb-4">
                <svg
                  className="w-44 h-44 text-navy mx-auto"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#101C35" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#F8F5ED" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#C9A45C" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#101C35" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#F8F5ED" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#C9A45C" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#101C35" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#F8F5ED" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#C9A45C" />

                  {/* Simulated QR data grid */}
                  <rect x="36" y="8" width="8" height="8" rx="1" />
                  <rect x="48" y="14" width="8" height="8" rx="1" />
                  <rect x="36" y="24" width="8" height="8" rx="1" fill="#C9A45C" />
                  <rect x="48" y="28" width="12" height="6" rx="1" />

                  <rect x="8" y="38" width="8" height="8" rx="1" fill="#C9A45C" />
                  <rect x="20" y="44" width="14" height="6" rx="1" />
                  <rect x="38" y="40" width="8" height="8" rx="1" />
                  <rect x="50" y="44" width="10" height="10" rx="2" fill="#101C35" />
                  <rect x="66" y="38" width="8" height="8" rx="1" />
                  <rect x="78" y="44" width="14" height="6" rx="1" fill="#C9A45C" />

                  <rect x="36" y="68" width="10" height="6" rx="1" />
                  <rect x="52" y="72" width="6" height="10" rx="1" fill="#C9A45C" />
                  <rect x="68" y="66" width="14" height="8" rx="1" />
                  <rect x="72" y="78" width="18" height="12" rx="2" fill="#101C35" />
                </svg>
              </div>

              <p className="text-[10px] text-navy/40 truncate max-w-xs mx-auto">
                {fullUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Copy Link & Share Actions */}
        <div className="md:col-span-6 space-y-6">
          <Card className="border border-navy/10 space-y-4">
            <h3 className="font-heading font-bold text-navy text-lg">
              Your Public Wedding URL
            </h3>
            <p className="text-xs text-navy/60 leading-relaxed">
              Anyone with this link can view your registry, leave their blessings, and contribute
              toward your dream goals.
            </p>

            <div className="flex items-center gap-2 p-2.5 bg-ivory rounded-xl border border-navy/10">
              <span className="text-xs text-navy font-mono truncate flex-1 pl-1">
                {fullUrl}
              </span>
              <Button
                variant={copied ? 'emerald' : 'secondary'}
                size="sm"
                icon={copied ? Check : Copy}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="pt-4 border-t border-navy/5 flex flex-col gap-2">
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="outline"
                  fullWidth
                  icon={ExternalLink}
                  iconPosition="right"
                >
                  Open Wedding Page in New Tab
                </Button>
              </a>
            </div>
          </Card>

          {/* Tips for Invitations */}
          <div className="p-4 bg-white rounded-2xl border border-navy/10 text-xs text-navy/70 space-y-2">
            <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Invitation Suggestions</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-navy/60">
              <li>Include this QR on the back of printed wedding cards.</li>
              <li>Paste the link into your WhatsApp wedding broadcasts.</li>
              <li>Mention that gifts will fund experiences rather than physical clutter.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
