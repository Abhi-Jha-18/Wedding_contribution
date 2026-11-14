import React from 'react';
import { PackageX, HeartHandshake, Users, Palette, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

export default function WhyChooseUs() {
  const benefits = [
    {
      title: 'Zero Duplicate Physical Gifts',
      description:
        'Eliminate the awkwardness of receiving four identical blenders or unwanted glassware. Every single rupee goes directly toward items you picked.',
      icon: PackageX,
      highlight: 'Say goodbye to clutter',
    },
    {
      title: 'Meaningful, Lasting Memories',
      description:
        'Instead of generic gift items, guests fund real memories — scuba diving on your honeymoon, quiet coffee mornings on your dream couch.',
      icon: HeartHandshake,
      highlight: 'Dreams over stuff',
    },
    {
      title: 'Effortless Group Contributions',
      description:
        'Big ticket items like ₹1.5L honeymoon flights are easily funded when college friends or cousins pool in ₹2,000 to ₹10,000 each.',
      icon: Users,
      highlight: 'Flexible amounts',
    },
    {
      title: 'Bespoke Wedding Invitation',
      description:
        'Every couple receives a stunning public landing page with custom typography, your story, photos, and a guestbook for warm blessings.',
      icon: Palette,
      highlight: 'Midnight Elegance theme',
    },
  ];

  return (
    <section id="why-us" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-gold font-bold">
              The Modern Solution
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-navy tracking-tight mt-2 mb-6 leading-tight">
              Why Couples Love <br />
              <span className="text-gold">WeddWish</span>
            </h2>
            <p className="text-navy/70 text-base leading-relaxed mb-8">
              Traditional Indian weddings often involve heavy physical gifts that are hard to transport,
              duplicate, or unneeded. We built a dignified, beautifully designed alternative that honors both
              the couple's ambitions and the guests' generosity.
            </p>

            {/* Checklist */}
            <div className="space-y-3 max-w-md mx-auto lg:mx-0 text-left">
              {[
                'Transparent goal tracking with zero hidden charges',
                'Guests contribute in seconds without registration required',
                'Personalized blessings collected into a digital keepsake',
                'Works seamlessly on mobile, tablet, and desktop',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-navy/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <Card
                  key={idx}
                  hover
                  className="p-6 bg-ivory/50 border border-navy/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20">
                        {b.highlight}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-navy mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-navy/65 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
