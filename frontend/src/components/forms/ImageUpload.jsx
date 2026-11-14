import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import Button from '../common/Button';

export default function ImageUpload({
  label = 'Couple Photo / Cover Image',
  value,
  onChange,
  className = '',
  helperText = 'Upload a high-resolution photo (PNG, JPG up to 5MB)',
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(objectUrl);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange?.(null);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1.5">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-gold/40 group max-h-64 shadow-md bg-navy/5">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="secondary"
              icon={Upload}
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              size="sm"
              variant="danger"
              icon={Trash2}
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-navy/20 hover:border-gold rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-white/60 hover:bg-white transition-all duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-ivory border border-gold/20 flex items-center justify-center text-gold mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-navy">
            Click or drag photo to upload
          </p>
          <p className="text-xs text-navy/50 mt-1">{helperText}</p>
        </div>
      )}
    </div>
  );
}
