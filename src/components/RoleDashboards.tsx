import React, { useState } from 'react';
import {
  Compass,
  Home,
  ShieldCheck,
  Check,
  X,
  Plus,
  Bookmark,
  Trash2,
  Sun,
  IndianRupee,
  TrendingUp,
  Users,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  UserProfile,
  CircuitItem,
  HomestayProperty,
  BookingInquiry,
  EcoGuideline,
  RegionalStat,
} from '../data/uttarakhandData';

interface RoleDashboardsProps {
  user: UserProfile;
  savedCircuitIds: string[];
  circuits: CircuitItem[];
  onToggleSaveCircuit: (id: string) => void;
  homestays: HomestayProperty[];
  onUpdateHomestayPrice: (id: string, newPrice: number, newRooms: number) => void;
  inquiries: BookingInquiry[];
  onUpdateInquiryStatus: (id: string, status: 'Confirmed' | 'Declined') => void;
  onCreateInquiry: (inquiry: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => void;
  ecoGuidelines: EcoGuideline[];
  onToggleGuidelineActive: (id: string) => void;
  onAddGuideline: (guideline: Omit<EcoGuideline, 'id' | 'lastUpdated'>) => void;
  regionalStats: RegionalStat[];
  onSwitchRoleQuick: (roleKey: 'traveler' | 'homestay_owner' | 'eco_board') => void;
  onOpenAIAssistantWithPrompt: (prompt: string) => void;
}

export const RoleDashboards: React.FC<RoleDashboardsProps> = ({
  user,
  savedCircuitIds,
  circuits,
  onToggleSaveCircuit,
  homestays,
  onUpdateHomestayPrice,
  inquiries,
  onUpdateInquiryStatus,
  onCreateInquiry,
  ecoGuidelines,
  onToggleGuidelineActive,
  onAddGuideline,
  regionalStats,
  onSwitchRoleQuick,
  onOpenAIAssistantWithPrompt,
}) => {
  // Traveler booking form state
  const [selectedHomestayId, setSelectedHomestayId] = useState(homestays[0]?.id || 'hs-sarmoli-01');
  const [checkInDate, setCheckInDate] = useState('2026-12-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-12-14');
  const [guestCount, setGuestCount] = useState(2);
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Homestay Owner rate editor state
  const ownerProperty = homestays[0];
  const [tariffInput, setTariffInput] = useState(ownerProperty.pricePerNightInr.toString());
  const [roomsInput, setRoomsInput] = useState(ownerProperty.roomsAvailable.toString());
  const [ownerSavedMsg, setOwnerSavedMsg] = useState('');

  // Eco-Board new guideline form state
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleScope, setNewRuleScope] = useState<EcoGuideline['regionScope']>('All Uttarakhand');
  const [newRuleCategory, setNewRuleCategory] = useState<EcoGuideline['category']>('Waste & Plastic');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [regionFilter, setRegionFilter] = useState<'All' | 'Garhwal' | 'Kumaon'>('All');

  const handleTravelerBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStay = homestays.find(h => h.id === selectedHomestayId) || homestays[0];
    const nights = 3;
    onCreateInquiry({
      homestayId: targetStay.id,
      homestayName: targetStay.name,
      guestName: user.name,
      guestEmail: user.email,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
      totalAmountInr: targetStay.pricePerNightInr * nights,
      notes: bookingNotes.trim() || 'Standard Himalayan Yatri Eco-Stay Request',
    });
    setBookingNotes('');
    setBookingSuccessMsg(`Booking inquiry sent to ${targetStay.hostName} at ${targetStay.name}!`);
    setTimeout(() => setBookingSuccessMsg(''), 4000);
  };

  const handleOwnerUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = Math.max(800, parseInt(tariffInput, 10) || 2400);
    const parsedRooms = Math.min(ownerProperty.totalRooms, Math.max(0, parseInt(roomsInput, 10) || 0));
    onUpdateHomestayPrice(ownerProperty.id, parsedPrice, parsedRooms);
    setOwnerSavedMsg('Property room tariff and live availability updated across Uttarakhand portal.');
    setTimeout(() => setOwnerSavedMsg(''), 3500);
  };

  const handleCreateGuidelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) return;
    onAddGuideline({
      code: `UETDB-2026-0${ecoGuidelines.length + 1}`,
      title: newRuleTitle.trim(),
      regionScope: newRuleScope,
      category: newRuleCategory,
      description: newRuleDesc.trim(),
      mandatory: true,
      active: true,
    });
    setNewRuleTitle('');
    setNewRuleDesc('');
  };

  const savedCircuitsList = circuits.filter(c => savedCircuitIds.includes(c.id));
  const confirmedRevenue = inquiries
    .filter(inq => inq.status === 'Confirmed')
    .reduce((acc, item) => acc + item.totalAmountInr, 0);
  const communityFundShare = Math.round(confirmedRevenue * (ownerProperty.communitySharePercent / 100));

  const filteredStats =
    regionFilter === 'All'
      ? regionalStats
      : regionalStats.filter(s => s.region === regionFilter);

  return (
    <section
      id="role-workspace"
      aria-labelledby="role-workspace-heading"
      className="py-12 border-b border-stone-200 bg-stone-100/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Role Switcher Toolbar & Active User Banner */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
            <div>
              <div className="text-xs font-medium text-emerald-900 mb-1">
                Active Role-Based Portal Workspace · Instant Role Switcher
              </div>
              <h2
                id="role-workspace-heading"
                className="font-serif-display text-2xl sm:text-3xl font-semibold text-slate-900"
              >
                {user.role === 'traveler' && 'Yatri Personal Itinerary & Booking Console'}
                {user.role === 'homestay_owner' && 'Koti Banal Homestay Host Property Console'}
                {user.role === 'eco_board' && 'Uttarakhand Eco-Tourism Board Governance Console'}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Signed in as <strong className="text-slate-900">{user.name}</strong> · {user.title} ·{' '}
                {user.region}
              </p>
            </div>

            {/* Interactive Segmented Role Switcher so presenter can test all 3 roles seamlessly */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => onSwitchRoleQuick('traveler')}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  user.role === 'traveler'
                    ? 'bg-[#143328] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>1. Traveler View</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchRoleQuick('homestay_owner')}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  user.role === 'homestay_owner'
                    ? 'bg-[#143328] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>2. Homestay Owner</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchRoleQuick('eco_board')}
                className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  user.role === 'eco_board'
                    ? 'bg-[#143328] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Eco-Tourism Board</span>
              </button>
            </div>
          </div>

          {/* =========================================================
              1. TRAVELER / SIMPLE PEOPLE DASHBOARD
             ========================================================= */}
          {user.role === 'traveler' && (
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Saved Itineraries */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900">
                    Saved Himalayan Circuits ({savedCircuitsList.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAIAssistantWithPrompt(
                        'Recommend a 5-day eco-itinerary in Munsiyari and Sarmoli with weather'
                      )
                    }
                    className="text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
                  >
                    Ask AI Yatri to optimize itinerary →
                  </button>
                </div>

                {savedCircuitsList.length === 0 ? (
                  <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center">
                    <Bookmark className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">
                      No circuits saved yet. Click "Save to Itinerary" on any Garhwal or Kumaon circuit below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedCircuitsList.map(c => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="text-xs text-slate-500">
                            {c.region} Division · {c.district} · {c.altitude} · {c.duration}
                          </div>
                          <h4 className="font-serif-display text-base font-semibold text-slate-900 mt-0.5">
                            {c.title}
                          </h4>
                          <p className="text-xs text-emerald-900 mt-1">
                            Permit: {c.permitRequired}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenAIAssistantWithPrompt(`Weather in ${c.title.split(' ')[0]}`)
                            }
                            className="min-h-[40px] px-3 py-1.5 text-xs font-medium bg-white border border-stone-300 rounded-lg text-slate-800 hover:bg-stone-100 cursor-pointer"
                          >
                            Live Weather
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleSaveCircuit(c.id)}
                            className="min-w-[40px] min-h-[40px] p-2 text-slate-500 hover:text-rose-700 rounded-lg border border-stone-200 hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label={`Remove ${c.title} from saved itinerary`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* My Submitted Booking Requests */}
                <div className="pt-4">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-3">
                    My Homestay Booking Inquiries ({inquiries.length})
                  </h3>
                  <div className="space-y-2.5">
                    {inquiries.map(inq => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-mono-tabular font-semibold text-slate-800">
                            {inq.id}
                          </span>{' '}
                          · <strong className="text-slate-900">{inq.homestayName}</strong>
                          <div className="text-slate-500 mt-0.5">
                            Check-in: {inq.checkIn} to {inq.checkOut} · {inq.guests} Guests ·{' '}
                            <span className="font-mono-tabular font-semibold text-slate-800">
                              ₹{inq.totalAmountInr.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-semibold ${
                            inq.status === 'Confirmed'
                              ? 'text-emerald-800'
                              : inq.status === 'Declined'
                              ? 'text-rose-700'
                              : 'text-amber-700'
                          }`}
                        >
                          Status: {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request New Village Homestay Booking */}
              <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5">
                <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-1">
                  Request Community Homestay Booking
                </h3>
                <p className="text-xs text-slate-600 mb-4">
                  Direct zero-commission booking inquiry sent to verified village hosts.
                </p>

                {bookingSuccessMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/30 text-xs text-emerald-950 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span>{bookingSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleTravelerBookingSubmit} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="traveler-homestay-select"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Select Heritage Property
                    </label>
                    <select
                      id="traveler-homestay-select"
                      value={selectedHomestayId}
                      onChange={e => setSelectedHomestayId(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                    >
                      {homestays.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.village} · ₹{h.pricePerNightInr}/night)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="traveler-checkin"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Check-In Date
                      </label>
                      <input
                        id="traveler-checkin"
                        type="date"
                        value={checkInDate}
                        onChange={e => setCheckInDate(e.target.value)}
                        className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="traveler-guests"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Yatris / Guests
                      </label>
                      <input
                        id="traveler-guests"
                        type="number"
                        min={1}
                        max={8}
                        value={guestCount}
                        onChange={e => setGuestCount(parseInt(e.target.value, 10) || 1)}
                        className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 font-mono-tabular"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="traveler-notes"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Dietary or Trek Guide Preferences
                    </label>
                    <input
                      id="traveler-notes"
                      type="text"
                      value={bookingNotes}
                      onChange={e => setBookingNotes(e.target.value)}
                      placeholder="e.g. Organic Mandua dinner, Khaliya Top local guide..."
                      className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] px-4 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Direct Homestay Inquiry
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================
              2. LOCAL HOMESTAY OWNER DASHBOARD
             ========================================================= */}
          {user.role === 'homestay_owner' && (
            <div className="pt-6 space-y-6">
              {/* Top KPI Strip for Homestay Host */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Confirmed Earnings (Nov–Dec)</span>
                    <IndianRupee className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div className="font-mono-tabular text-2xl font-bold text-slate-900 mt-1">
                    ₹{confirmedRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-emerald-800 mt-1">
                    100% Direct Bank Settlement
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Sarmoli Women Collective Share</span>
                    <Users className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div className="font-mono-tabular text-2xl font-bold text-emerald-900 mt-1">
                    ₹{communityFundShare.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      ({ownerProperty.communitySharePercent}%)
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Supports 14 local weaving & guide families
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Current Room Tariff</span>
                    <TrendingUp className="w-4 h-4 text-amber-700" />
                  </div>
                  <div className="font-mono-tabular text-2xl font-bold text-slate-900 mt-1">
                    ₹{ownerProperty.pricePerNightInr.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500"> / night</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {ownerProperty.roomsAvailable} of {ownerProperty.totalRooms} Koti rooms open
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>Solar & Passive Heating Offset</span>
                    <Sun className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="font-mono-tabular text-2xl font-bold text-slate-900 mt-1">
                    310 kg CO₂
                  </div>
                  <div className="text-xs text-emerald-800 mt-1">
                    Gold Certified Koti Banal Eco-Home
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Incoming Booking Inquiries Queue */}
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900">
                    Incoming Traveler Booking Inquiries ({inquiries.length})
                  </h3>
                  {inquiries.map(inq => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-tabular font-semibold text-slate-800">
                            {inq.id}
                          </span>
                          <span>·</span>
                          <span>{inq.createdAt}</span>
                          <span>·</span>
                          <span
                            className={`font-semibold ${
                              inq.status === 'Confirmed'
                                ? 'text-emerald-800'
                                : inq.status === 'Declined'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <h4 className="font-serif-display text-base font-semibold text-slate-900">
                          {inq.guestName} ({inq.guests} Guests)
                        </h4>
                        <div className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {inq.checkIn} → {inq.checkOut} · Total:{' '}
                            <strong className="font-mono-tabular text-slate-900">
                              ₹{inq.totalAmountInr.toLocaleString('en-IN')}
                            </strong>
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">"{inq.notes}"</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateInquiryStatus(inq.id, 'Confirmed')}
                          disabled={inq.status === 'Confirmed'}
                          className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#143328] hover:bg-emerald-900 disabled:opacity-40 text-white flex items-center gap-1 transition-colors cursor-pointer"
                          aria-label={`Approve booking ${inq.id}`}
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateInquiryStatus(inq.id, 'Declined')}
                          disabled={inq.status === 'Declined'}
                          className="min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-stone-300 hover:bg-rose-50 hover:text-rose-800 disabled:opacity-40 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                          aria-label={`Decline booking ${inq.id}`}
                        >
                          <X className="w-3.5 h-3.5" /> Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Property Tariff & Inventory Control */}
                <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-1">
                    Manage Homestay Pricing & Rooms
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    {ownerProperty.name} · {ownerProperty.village}, {ownerProperty.district}
                  </p>

                  {ownerSavedMsg && (
                    <div className="mb-4 p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/30 text-xs text-emerald-950 font-medium">
                      {ownerSavedMsg}
                    </div>
                  )}

                  <form onSubmit={handleOwnerUpdateSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="owner-tariff-input"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Nightly Room Tariff (INR)
                      </label>
                      <input
                        id="owner-tariff-input"
                        type="number"
                        min={1000}
                        max={15000}
                        step={100}
                        value={tariffInput}
                        onChange={e => setTariffInput(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 font-mono-tabular"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="owner-rooms-input"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Available Rooms Today (Max {ownerProperty.totalRooms})
                      </label>
                      <input
                        id="owner-rooms-input"
                        type="number"
                        min={0}
                        max={ownerProperty.totalRooms}
                        value={roomsInput}
                        onChange={e => setRoomsInput(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900 font-mono-tabular"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[44px] px-4 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Update Live Homestay Tariff & Inventory
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              3. ORGANIZATION / ECO-TOURISM BOARD DASHBOARD
             ========================================================= */}
          {user.role === 'eco_board' && (
            <div className="pt-6 space-y-8">
              {/* Regional Filter & Sustainability Metrics Table */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif-display text-lg font-semibold text-slate-900">
                      Garhwal & Kumaon Circuit Carrying Capacity & Sustainability Ledger
                    </h3>
                    <p className="text-xs text-slate-600">
                      Live telemetry across forest checkposts, QR plastic recovery stations, and village homestay clusters.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 self-start">
                    {(['All', 'Garhwal', 'Kumaon'] as const).map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setRegionFilter(tab)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          regionFilter === tab
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab} Circuits
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto border border-stone-200 rounded-xl bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-[11px] font-semibold text-slate-600">
                        <th className="py-3 px-4">Circuit Corridor</th>
                        <th className="py-3 px-4">Division</th>
                        <th className="py-3 px-4 text-right">Monthly Yatris</th>
                        <th className="py-3 px-4 text-right">Daily Cap</th>
                        <th className="py-3 px-4 text-right">Plastic Diverted</th>
                        <th className="py-3 px-4 text-right">Village Revenue</th>
                        <th className="py-3 px-4 text-right">Compliance</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-xs">
                      {filteredStats.map(row => (
                        <tr key={row.circuitName} className="hover:bg-stone-50/80">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {row.circuitName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{row.region}</td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-slate-800">
                            {row.monthlyVisitors.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-slate-600">
                            {row.dailyCapLimit} / day
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-emerald-800 font-medium">
                            {row.wasteDivertedKg.toLocaleString('en-IN')} kg
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-slate-900 font-medium">
                            ₹{row.homestayRevenueLakhs.toFixed(1)}L
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-emerald-900">
                            {row.complianceScore}%
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 font-medium ${
                                row.status === 'Nominal'
                                  ? 'text-emerald-800'
                                  : 'text-amber-700'
                              }`}
                            >
                              {row.status === 'Nominal' ? (
                                <Leaf className="w-3.5 h-3.5" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              )}
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manage & Publish Eco-Guidelines */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-3">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900">
                    Active Regional Eco-Guidelines ({ecoGuidelines.filter(g => g.active).length} Enforced)
                  </h3>
                  {ecoGuidelines.map(rule => (
                    <div
                      key={rule.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        rule.active
                          ? 'bg-stone-50 border-stone-200'
                          : 'bg-stone-100/50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs text-slate-500 font-mono-tabular">
                            {rule.code} · {rule.regionScope} · {rule.category}
                          </div>
                          <h4 className="font-serif-display text-base font-semibold text-slate-900 mt-0.5">
                            {rule.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {rule.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onToggleGuidelineActive(rule.id)}
                          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                            rule.active
                              ? 'bg-emerald-900 text-white hover:bg-emerald-800'
                              : 'bg-stone-200 text-slate-700 hover:bg-stone-300'
                          }`}
                        >
                          {rule.active ? 'Enforced' : 'Suspended'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Publish New Directive Form */}
                <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xl p-5">
                  <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-1">
                    Publish New Eco-Tourism Directive
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    Directives immediately sync with the AI Yatri RAG Concierge and forest checkposts.
                  </p>

                  <form onSubmit={handleCreateGuidelineSubmit} className="space-y-3.5">
                    <div>
                      <label
                        htmlFor="eco-rule-title"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Directive Title
                      </label>
                      <input
                        id="eco-rule-title"
                        type="text"
                        required
                        value={newRuleTitle}
                        onChange={e => setNewRuleTitle(e.target.value)}
                        placeholder="e.g. Mandatory Mule Welfare & Load Limit on Kedarnath Trail"
                        className="w-full min-h-[44px] px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="eco-rule-scope"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Jurisdiction Scope
                        </label>
                        <select
                          id="eco-rule-scope"
                          value={newRuleScope}
                          onChange={e =>
                            setNewRuleScope(e.target.value as EcoGuideline['regionScope'])
                          }
                          className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-white border border-stone-300 rounded-lg text-slate-900"
                        >
                          <option value="All Uttarakhand">All Uttarakhand</option>
                          <option value="Garhwal High-Altitude">Garhwal High-Altitude</option>
                          <option value="Kumaon Biosphere">Kumaon Biosphere</option>
                          <option value="Bugyal Meadows">Bugyal Meadows</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="eco-rule-cat"
                          className="block text-xs font-semibold text-slate-700 mb-1"
                        >
                          Category
                        </label>
                        <select
                          id="eco-rule-cat"
                          value={newRuleCategory}
                          onChange={e =>
                            setNewRuleCategory(e.target.value as EcoGuideline['category'])
                          }
                          className="w-full min-h-[44px] px-2.5 py-2 text-xs bg-white border border-stone-300 rounded-lg text-slate-900"
                        >
                          <option value="Waste & Plastic">Waste & Plastic</option>
                          <option value="Alpine Camping">Alpine Camping</option>
                          <option value="Permit & Carrying Capacity">Permit & Carrying Capacity</option>
                          <option value="Wildlife & Flora">Wildlife & Flora</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="eco-rule-desc"
                        className="block text-xs font-semibold text-slate-700 mb-1"
                      >
                        Protocol Details
                      </label>
                      <textarea
                        id="eco-rule-desc"
                        rows={3}
                        required
                        value={newRuleDesc}
                        onChange={e => setNewRuleDesc(e.target.value)}
                        placeholder="Specify checkpost enforcement rules and fine/deposit parameters..."
                        className="w-full p-3 text-sm bg-white border border-stone-300 rounded-lg text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full min-h-[44px] px-4 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Publish Directive to Checkposts
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
