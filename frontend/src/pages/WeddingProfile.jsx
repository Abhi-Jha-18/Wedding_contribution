import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, MapPin, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ImageUpload from '../components/forms/ImageUpload';
import { useWedding } from '../context/WeddingContext';
import { generateSlug } from '../utils/helpers';
import { validateRequired } from '../utils/validators';

export default function WeddingProfile() {
  const { weddingProfile, saveProfile } = useWedding();

  const [formData, setFormData] = useState({
    partner1: '',
    partner2: '',
    weddingDate: '',
    location: '',
    description: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Populate existing data
  useEffect(() => {
    if (weddingProfile) {
      setFormData({
        partner1: weddingProfile.partner1 || '',
        partner2: weddingProfile.partner2 || '',
        weddingDate: weddingProfile.weddingDate || '',
        location: weddingProfile.location || '',
        description: weddingProfile.description || '',
        photo: weddingProfile.photo || null,
      });
    }
  }, [weddingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
  };

  const handlePhotoChange = (photoUrl) => {
    setFormData((prev) => ({ ...prev, photo: photoUrl }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    const p1 = validateRequired(formData.partner1, 'Partner 1 name');
    if (!p1.valid) newErrors.partner1 = p1.message;

    const p2 = validateRequired(formData.partner2, 'Partner 2 name');
    if (!p2.valid) newErrors.partner2 = p2.message;

    const dt = validateRequired(formData.weddingDate, 'Wedding date');
    if (!dt.valid) newErrors.weddingDate = dt.message;

    const loc = validateRequired(formData.location, 'Wedding venue/location');
    if (!loc.valid) newErrors.location = loc.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setSuccessMessage('');

    try {
      const slug = generateSlug(`${formData.partner1}-and-${formData.partner2}`);
      await saveProfile({
        ...formData,
        slug: slug || 'our-wedding',
      });
      setSuccessMessage('Wedding profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const coupleSlug = weddingProfile?.slug || generateSlug(`${formData.partner1}-and-${formData.partner2}`) || 'arjun-and-priya';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy">
            Wedding Profile
          </h2>
          <p className="text-sm text-navy/60 font-body">
            Customize the details that guests will see on your digital invitation & registry.
          </p>
        </div>

        <Link
          to={`/wedding/${coupleSlug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            size="sm"
            icon={ExternalLink}
            iconPosition="right"
          >
            Preview Live Page
          </Button>
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald/10 border border-emerald/30 rounded-2xl flex items-center gap-3 text-sm text-emerald font-semibold animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <Card className="border border-navy/10 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Couple Names */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
              <span>Couple Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Partner 1 Name"
                name="partner1"
                placeholder="e.g. Arjun Mehta"
                value={formData.partner1}
                onChange={handleChange}
                error={errors.partner1}
                required
              />

              <Input
                label="Partner 2 Name"
                name="partner2"
                placeholder="e.g. Priya Sharma"
                value={formData.partner2}
                onChange={handleChange}
                error={errors.partner2}
                required
              />
            </div>
          </div>

          {/* Date & Location */}
          <div className="pt-4 border-t border-navy/5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-gold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>Event Logistics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Wedding Date"
                name="weddingDate"
                type="date"
                value={formData.weddingDate}
                onChange={handleChange}
                error={errors.weddingDate}
                required
              />

              <Input
                label="Location / Venue"
                name="location"
                placeholder="e.g. Udaipur, Rajasthan"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                icon={MapPin}
                required
              />
            </div>
          </div>

          {/* Love Story / Description */}
          <div className="pt-4 border-t border-navy/5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
              Our Story / Note to Guests
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell your guests how you met, your journey, and why their presence means so much to you..."
              className="w-full text-sm bg-white border border-navy/15 rounded-lg p-3 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-navy/50 mt-1">
              This message appears prominently on your public invitation page.
            </p>
          </div>

          {/* Photo Upload */}
          <div className="pt-4 border-t border-navy/5">
            <ImageUpload
              label="Couple Portrait / Cover Photo"
              value={formData.photo}
              onChange={handlePhotoChange}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-navy/10 flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSaving}
              icon={Sparkles}
            >
              Save Wedding Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
