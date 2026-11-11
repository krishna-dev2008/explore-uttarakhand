import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Bookmark,
  Check,
  Calendar,
  Leaf,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { CircuitItem, InterestTag } from '../data/uttarakhandData';
import { recommendCircuitsForPlanner, PlannerCriteria } from '../utils/ragEngine';

interface CircuitPlannerProps {
  circuits: CircuitItem[];
  savedCircuitIds: string[];
  onToggleSaveCircuit: (id: string) => void;
  onAskAIWithPrompt: (prompt: string) => void;
}

const INTEREST_OPTIONS: { id: InterestTag; label: string; desc: string }[] = [
  { id: 'trekking', label: 'Alpine Trekking', desc: 'Bugyals, glaciers & summit ridges' },
  { id: 'wildlife', label: 'Wildlife & Birding', desc: 'Monal, musk deer & biosphere trails' },
  { id: 'wellness', label: 'Forest Wellness', desc: 'Tea estates, meditation & silent zones' },
  { id: 'heritage', label: 'Koti & Temple Craft', desc: 'Katyuri shrines & Shauka weaving' },
];

export const CircuitPlanner: React.FC<CircuitPlannerProps> = ({
  circuits,
  savedCircuitIds,
  onToggleSaveCircuit,
  onAskAIWithPrompt,
}) => {
  const [durationBucket, setDurationBucket] = useState<PlannerCriteria['durationBucket']>('short');
  const [selectedInterests, setSelectedInterests] = useState<InterestTag[]>([
    'trekking',
    'heritage',
  ]);
  const [maxBudgetInr, setMaxBudgetInr] = useState<number>(13500);
  const [regionFilter, setRegionFilter] = useState<PlannerCriteria['region']>('All');

  const toggleInterest = (tag: InterestTag) => {
    setSelectedInterests(prev => {
      if (prev.includes(tag)) {
        return prev.length > 1 ? prev.filter(item => item !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  const recommendation = useMemo(
    () =>
      recommendCircuitsForPlanner(circuits, {
        durationBucket,
        interests: selectedInterests,
        maxBudgetInr,
        region: regionFilter,
      }),
    [circuits, durationBucket, selectedInterests, maxBudgetInr, regionFilter]
  );

  const { primaryCircuit, alternativeCircuits, matchScorePercent, carbonSavedKg } = recommendation;
  const isSaved = savedCircuitIds.includes(primaryCircuit.id);

  return (
    <section
      id="circuit-planner"
      aria-labelledby="circuit-planner-heading"
      className="py-14 sm:py-20 border-b border-stone-200 bg-[#F4F1EA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-medium text-emerald-900 mb-1">
              03. Interactive Bespoke Route Generator
            </div>
            <h2
              id="circuit-planner-heading"
              className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900"
            >
              Interactive Himalayan Circuit Planner
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Select your trip duration, preferred interests, and budget range to synthesize a low-impact route paired with community homestays.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Step Filter Controls */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-xs">
            {/* Step 1: Division Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                1. Select Himalayan Division
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['All', 'Garhwal', 'Kumaon'] as const).map(reg => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setRegionFilter(reg)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      regionFilter === reg
                        ? 'bg-[#143328] text-white border-[#143328]'
                        : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {reg === 'All' ? 'All Divisions' : reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Trip Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                2. Trip Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short', label: '3–4 Days', sub: 'Weekend Escape' },
                  { id: 'medium', label: '5 Days', sub: 'Alpine Circuit' },
                  { id: 'long', label: '6+ Days', sub: 'Deep Expedition' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setDurationBucket(opt.id as PlannerCriteria['durationBucket'])
                    }
                    className={`min-h-[48px] p-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                      durationBucket === opt.id
                        ? 'bg-[#143328] text-white border-[#143328]'
                        : 'bg-stone-50 text-slate-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div
                      className={`text-[11px] ${
                        durationBucket === opt.id ? 'text-emerald-200' : 'text-slate-500'
                      }`}
                    >
                      {opt.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Traveler Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                3. Preferred Interests (Select 1 or More)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {INTEREST_OPTIONS.map(item => {
                  const active = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`min-h-[48px] p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-950 text-white border-emerald-900'
                          : 'bg-stone-50 text-slate-800 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>{item.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-amber-300" />}
                      </div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          active ? 'text-stone-300' : 'text-slate-500'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Budget Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="planner-budget-range"
                  className="text-xs font-semibold text-slate-800 uppercase tracking-wider"
                >
                  4. Budget Range per Yatri
                </label>
                <span className="font-mono-tabular text-sm font-bold text-emerald-900">
                  Up to ₹{maxBudgetInr.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                id="planner-budget-range"
                type="range"
                min={8500}
                max={18000}
                step={500}
                value={maxBudgetInr}
                onChange={e => setMaxBudgetInr(Number(e.target.value))}
                className="w-full accent-[#143328] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono-tabular mt-1">
                <span>₹8,500 (Economy)</span>
                <span>₹13,000 (Balanced)</span>
                <span>₹18,000+ (All-Inclusive)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamically Generated Route Blueprint */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Top Banner with Image & Match Score */}
            <div className="relative h-56 sm:h-64 bg-slate-900 overflow-hidden">
              <img
                src={primaryCircuit.imageUrl}
                alt={primaryCircuit.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono-tabular text-amber-300 font-semibold">
                    {matchScorePercent}% Route Match · {primaryCircuit.region} Division ({primaryCircuit.district})
                  </span>
                  <span className="text-xs font-mono-tabular text-emerald-300">
                    {primaryCircuit.altitude} · {primaryCircuit.duration}
                  </span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold">
                  {primaryCircuit.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Estimated Circuit Tariff</span>
                  <span className="font-mono-tabular text-base font-bold text-slate-900">
                    ₹{primaryCircuit.basePriceInr.toLocaleString('en-IN')} / yatri
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Carbon Offset vs Hotel</span>
                  <span className="font-mono-tabular text-base font-bold text-emerald-900 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" /> -{carbonSavedKg} kg CO₂ ({primaryCircuit.carbonSavedPercent}% lower)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Permit Protocol</span>
                  <span className="font-medium text-slate-800 line-clamp-1">
                    {primaryCircuit.permitRequired}
                  </span>
                </div>
              </div>

              {/* Day-by-Day Generated Itinerary */}
              <div>
                <h4 className="font-serif-display text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-900" />
                  <span>Recommended Day-by-Day Low-Impact Route</span>
                </h4>
                <div className="space-y-2.5">
                  {primaryCircuit.dayByDayPlan.map(step => (
                    <div
                      key={step.day}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          <span className="font-mono-tabular text-emerald-900 mr-1.5">
                            Day 0{step.day}:
                          </span>
                          {step.title}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{step.activity}</p>
                      </div>
                      <div className="text-[11px] font-medium text-emerald-950 bg-stone-200/70 px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 self-start sm:self-center">
                        <MapPin className="w-3 h-3 text-emerald-800" />
                        <span>{step.stayVillage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Also matched:{' '}
                  {alternativeCircuits.map((alt, i) => (
                    <span key={alt.id} className="font-medium text-slate-700">
                      {i > 0 ? ' · ' : ''}
                      {alt.title.split('&')[0].trim()}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      onAskAIWithPrompt(
                        `Check live weather, permits, and homestay availability for my planned ${primaryCircuit.duration} trip to ${primaryCircuit.title.split(',')[0]}`
                      )
                    }
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-900/10 hover:bg-emerald-900/20 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Verify Route Weather in AI Yatri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSaveCircuit(primaryCircuit.id)}
                    className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-[#143328] text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Saved to My Itinerary
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" /> Save Route to Itinerary
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
