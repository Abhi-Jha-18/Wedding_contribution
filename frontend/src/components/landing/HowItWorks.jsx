import React from 'react';
import { Heart, Gift, Share2, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description:
        'Share your love story, wedding date, venue, and a personal welcome note for your guests in seconds.',
      icon: Heart,
      tag: '5 Minutes',
    },
    {
      step: '02',
      title: 'Add Your Dreams',
      description:
        'Add items you truly desire — honeymoon funds, home furniture, travel experiences, or kitchen essentials.',
      icon: Gift,
      tag: 'Any Goal',
    },
    {
      step: '03',
      title: 'Share With Guests',
      description:
        'Include your stylish custom link or QR code directly on wedding invitations, digital invites, or WhatsApp.',
      icon: Share2,
      tag: '1-Click Share',
    },
    {
      step: '04',
      title: 'Receive With Joy',
      description:
        'Guests contribute their chosen amount with personalized blessing messages. Track progress live on your dashboard.',
      icon: Sparkles,
      tag: 'No Hassle',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <p className="text-xs uppercase tracking-widest text-gold font-bold mb-2">
            Seamless & Elegant
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            How WeddWish Works
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-navy/70 font-body">
            Four simple steps to transform awkward gift boxes into cherished memories and lifelong dreams.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-7 border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-3xl font-extrabold text-gold/30 group-hover:text-gold transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/10 text-[#916d28] border border-gold/20">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-xl bg-ivory border border-gold/20 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-gold transition-all duration-300 mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="font-heading text-xl font-bold text-navy mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-navy/65 leading-relaxed font-body">
                    {item.description}
                  </p>
                </div>

                {/* Bottom decorative accent */}
                <div className="mt-6 pt-4 border-t border-navy/5 flex items-center text-xs font-semibold text-gold group-hover:text-navy transition-colors">
                  <span>Step {item.step} of 04</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
