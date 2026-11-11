import React, { useState } from 'react';
import { X, Home, MapPin, Calendar, Users, CheckCircle2, ShieldCheck } from 'lucide-react';
import { HomestayProperty, BookingInquiry } from '../data/uttarakhandData';

interface BookingModalProps {
  homestay: HomestayProperty | null;
  onClose: () => void;
  defaultGuestName: string;
  defaultGuestEmail: string;
  onSubmitBooking: (inquiry: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  homestay,
  onClose,
  defaultGuestName,
  defaultGuestEmail,
  onSubmitBooking,
}) => {
  const [guestName, setGuestName] = useState(defaultGuestName || 'Aarav Rawat');
  const [guestEmail, setGuestEmail] = useState(defaultGuestEmail || 'aarav.yatri@uttarakhand.org');
  const [checkIn, setCheckIn] = useState('2026-12-12');
  const [checkOut, setCheckOut] = useState('2026-12-15');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [agreedEcoPledge, setAgreedEcoPledge] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!homestay) return null;

  const nights = 3;
  const totalAmountInr = homestay.pricePerNightInr * nights;
  const villageShareInr = Math.round(totalAmountInr * (homestay.communitySharePercent / 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBooking({
      homestayId: homestay.id,
      homestayName: homestay.name,
      guestName: guestName.trim() || 'Himalayan Yatri',
      guestEmail: guestEmail.trim() || 'yatri@uttarakhand.org',
      checkIn,
      checkOut,
      guests,
      totalAmountInr,
      notes:
        notes.trim() ||
        `Direct Village Stay Request (${homestay.village}) · Agreed to Zero-Plastic Pahadi Etiquette`,
    });
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="bg-[#143328] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>Zero-Commission Community Homestay Booking</span>
            </div>
            <h2 id="booking-modal-title" className="font-serif-display text-xl font-semibold mt-0.5">
              {homestay.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-stone-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-900/15 text-emerald-900 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-2xl font-semibold text-slate-900">
              Booking Inquiry Dispatched to {homestay.hostName}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your request for <strong>{homestay.name}</strong> ({homestay.village}) has been logged.{' '}
              <span className="font-mono-tabular font-semibold text-emerald-900">
                ₹{villageShareInr.toLocaleString('en-IN')} ({homestay.communitySharePercent}%)
              </span>{' '}
              of your stay directly funds the village conservation collective.
            </p>
            <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-slate-700">
              Tip for Class Presentation: Switch to the <strong>2. Homestay Owner</strong> role in the dashboard to approve or decline this live inquiry!
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="w-full min-h-[44px] px-5 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Property Summary Strip */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  {homestay.village}, {homestay.district} ({homestay.altitude})
                </div>
                <div className="text-slate-500 mt-0.5">
                  Host: {homestay.hostName} · {homestay.communitySharePercent}% Village Collective Share
                </div>
              </div>
              <div className="text-right font-mono-tabular">
                <div className="text-sm font-bold text-slate-900">
                  ₹{homestay.pricePerNightInr.toLocaleString('en-IN')}/night
                </div>
                <div className="text-[11px] text-emerald-800">
                  3 Nights Est: ₹{totalAmountInr.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yatri Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email for Permit & Host Sync
                </label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-white border border-stone-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-white border border-stone-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  <Users className="w-3 h-3 inline mr-1" />
                  Guests
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value) || 1)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 font-mono-tabular"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organic Pahadi Meal or Local Guide Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g., Traditional Mandua roti dinner, early morning birding walk..."
                className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-900/5 border border-emerald-900/20 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedEcoPledge}
                onChange={e => setAgreedEcoPledge(e.target.checked)}
                required
                className="mt-0.5 accent-[#143328]"
              />
              <span>
                <strong className="text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  Pahadi Homestay Eco-Pledge:
                </strong>{' '}
                I agree to carry back all non-biodegradable waste, respect village quiet hours after 19:30 hrs, and remove footwear before entering the Koti hearth floor.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-slate-700 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#143328] hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Confirm Booking Request (₹{totalAmountInr.toLocaleString('en-IN')})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
