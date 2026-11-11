import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Bookmark,
  Check,
  MapPin,
  Sun,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Home,
  CloudSun,
  MessageSquare,
  Leaf,
  Compass,
  Star,
} from 'lucide-react';
import {
  CIRCUITS_DATA,
  HOMESTAYS_DATA,
  INITIAL_INQUIRIES,
  INITIAL_ECO_GUIDELINES,
  REGIONAL_SUSTAINABILITY_STATS,
  DEMO_USERS,
  UserProfile,
  HomestayProperty,
  BookingInquiry,
  EcoGuideline,
} from './data/uttarakhandData';
import { AIYatriDrawer } from './components/AIYatriDrawer';
import { RoleAuthModal } from './components/RoleAuthModal';
import { RoleDashboards } from './components/RoleDashboards';
import { Himalayan3DScene } from './components/Himalayan3DScene';
import { CircuitPlanner } from './components/CircuitPlanner';
import { BookingModal } from './components/BookingModal';

export default function App() {
  // Active Authenticated User Profile (default to Traveler so role workspace is immediately demonstrable)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_USERS.traveler);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Mobile Hamburger Menu Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // AI Yatri RAG Drawer State
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [pendingAIQuery, setPendingAIQuery] = useState<string | null>(null);

  // Filter States for Public Discovery
  const [circuitDivisionFilter, setCircuitDivisionFilter] = useState<'All' | 'Garhwal' | 'Kumaon'>(
    'All'
  );
  const [homestayFilter, setHomestayFilter] = useState<
    'All' | 'Garhwal' | 'Kumaon' | 'Solar-Powered' | 'Organic Farm-to-Table'
  >('All');
  const [savedCircuitIds, setSavedCircuitIds] = useState<string[]>(['cir-munsiyari', 'cir-chopta']);

  // Live Stateful Data shared with Role Dashboards & Booking Modal
  const [homestays, setHomestays] = useState<HomestayProperty[]>(HOMESTAYS_DATA);
  const [inquiries, setInquiries] = useState<BookingInquiry[]>(INITIAL_INQUIRIES);
  const [ecoGuidelines, setEcoGuidelines] = useState<EcoGuideline[]>(INITIAL_ECO_GUIDELINES);

  // Active Homestay for "Request Booking" Modal
  const [bookingModalHomestay, setBookingModalHomestay] = useState<HomestayProperty | null>(null);

  // Quick Weather Search Input in Hero
  const [heroPlaceSearch, setHeroPlaceSearch] = useState('');

  // Subtle Parallax Scroll Offset for Hero & Banner Visuals
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenAIWithPrompt = (prompt: string) => {
    setPendingAIQuery(prompt);
    setIsAIDrawerOpen(true);
  };

  const handleToggleSaveCircuit = (id: string) => {
    setSavedCircuitIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleUpdateHomestayPrice = (id: string, newPrice: number, newRooms: number) => {
    setHomestays(prev =>
      prev.map(h =>
        h.id === id ? { ...h, pricePerNightInr: newPrice, roomsAvailable: newRooms } : h
      )
    );
  };

  const handleUpdateInquiryStatus = (id: string, status: 'Confirmed' | 'Declined') => {
    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
  };

  const handleCreateInquiry = (newInq: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => {
    const created: BookingInquiry = {
      ...newInq,
      id: `INQ-${Math.floor(9000 + Math.random() * 900)}`,
      status: 'Pending',
      createdAt: 'Just now',
    };
    setInquiries(prev => [created, ...prev]);
  };

  const handleToggleGuidelineActive = (id: string) => {
    setEcoGuidelines(prev =>
      prev.map(g => (g.id === id ? { ...g, active: !g.active } : g))
    );
  };

  const handleAddGuideline = (newRule: Omit<EcoGuideline, 'id' | 'lastUpdated'>) => {
    const rule: EcoGuideline = {
      ...newRule,
      id: `eco-0${ecoGuidelines.length + 1}`,
      lastUpdated: 'Nov 2026',
    };
    setEcoGuidelines(prev => [rule, ...prev]);
  };

  const handleQuickRoleSwitch = (roleKey: 'traveler' | 'homestay_owner' | 'eco_board') => {
    setCurrentUser(DEMO_USERS[roleKey]);
  };

  const filteredCircuits =
    circuitDivisionFilter === 'All'
      ? CIRCUITS_DATA
      : CIRCUITS_DATA.filter(c => c.region === circuitDivisionFilter);

  const filteredHomestays = homestays.filter(stay => {
    if (homestayFilter === 'All') return true;
    if (homestayFilter === 'Garhwal' || homestayFilter === 'Kumaon') {
      return stay.region === homestayFilter;
    }
    if (homestayFilter === 'Solar-Powered') return stay.solarPowered;
    if (homestayFilter === 'Organic Farm-to-Table') return stay.organicFarmToTable;
    return true;
  });

  const parallaxOffset = Math.min(48, scrollY * 0.12);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-900 selection:bg-emerald-900 selection:text-white">
      {/* =================================================================
          TOP NAVIGATION BAR (Mountain Leaf Logo + Core Links + AI Yatri + Role Auth)
         ================================================================= */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Brand Wordmark with Mountain Leaf Icon */}
          <a
            href="#"
            className="flex items-center gap-1.5 sm:gap-2 font-serif-display text-base sm:text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-900 shrink-0" />
            <span>Explore Uttarakhand</span>
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
            aria-label="Primary Navigation"
          >
            <a
              href="#circuits"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Circuits
            </a>
            <a
              href="#homestays"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Homestays
            </a>
            <a
              href="#circuit-planner"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Circuit Planner
            </a>
            <a
              href="#impact-vision"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Impact Vision
            </a>
            <a
              href="#role-workspace"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Role Dashboard
            </a>
            <button
              type="button"
              onClick={() => setIsAIDrawerOpen(true)}
              className="text-emerald-900 font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Yatri</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action (Role Login / Switcher + Mobile Menu Button) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="min-h-[44px] px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#143328] hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {currentUser
                ? `Role: ${
                    currentUser.role === 'traveler'
                      ? 'Traveler'
                      : currentUser.role === 'homestay_owner'
                      ? 'Homestay Host'
                      : 'Eco-Board'
                  }`
                : 'Sign In / Select Role'}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-stone-300 text-slate-800 hover:bg-stone-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-[#FAF9F5] px-4 py-4 space-y-2 shadow-lg">
            <a
              href="#circuits"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              Garhwal & Kumaon Circuits
            </a>
            <a
              href="#homestays"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              Community Homestays
            </a>
            <a
              href="#circuit-planner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              Interactive Circuit Planner
            </a>
            <a
              href="#himalayan-3d"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              3D Himalayan Sanctuary Explorer
            </a>
            <a
              href="#impact-vision"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              Impact Vision & Eco-Charter
            </a>
            <a
              href="#role-workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-stone-200/60"
            >
              Role-Based Workspace
            </a>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAIDrawerOpen(true);
              }}
              className="w-full min-h-[44px] px-3 py-2.5 rounded-lg text-left text-sm font-semibold text-emerald-900 bg-emerald-900/10 flex items-center justify-between"
            >
              <span>Launch AI Yatri RAG Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* =================================================================
            HERO SECTION (2-Column Editorial Split + Parallax Visual + Dual CTAs)
           ================================================================= */}
        <section className="py-10 sm:py-16 border-b border-stone-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Column: Editorial Narrative, Dual CTAs & Dynamic RAG Quick-Query */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-medium text-emerald-900 tracking-wide">
                    Uttarakhand Eco-Tourism Development Board · Garhwal & Kumaon Biosphere
                  </div>

                  <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[52px] font-semibold text-slate-900 leading-[1.1] tracking-tight">
                    Discover the Soul of the Himalayas through Sustainable Community Tourism.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    Traverse ancient Garhwal and Kumaon forest corridors, stay in earthquake-resilient Koti Banal village homestays, and query real-time weather and permits across all 13 districts of Devbhoomi Uttarakhand.
                  </p>

                  {/* Dual Primary & Secondary CTAs + Role Switcher */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="#circuits"
                      className="min-h-[44px] px-5 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <Compass className="w-4 h-4 text-amber-300" />
                      <span>Explore Circuits</span>
                    </a>
                    <a
                      href="#circuit-planner"
                      className="min-h-[44px] px-5 py-2.5 bg-white hover:bg-stone-100 text-slate-900 border border-stone-300 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <span>Plan Your Journey</span>
                      <ArrowRight className="w-4 h-4 text-emerald-900" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="min-h-[44px] px-4 py-2.5 bg-stone-200/80 hover:bg-stone-300/70 text-slate-900 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-900" />
                      <span>Switch Role</span>
                    </button>
                  </div>
                </div>

                {/* Live AI Yatri Weather & Village Lookup Bar */}
                <div className="bg-white border border-stone-300 rounded-2xl p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-2.5">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <CloudSun className="w-4 h-4 text-emerald-800" />
                      AI Yatri Dynamic RAG Lookup (Any Village, Weather, Etiquette, or Permit)
                    </span>
                    <span className="font-mono-tabular text-emerald-800">13 Districts Live</span>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!heroPlaceSearch.trim()) {
                        setIsAIDrawerOpen(true);
                        return;
                      }
                      handleOpenAIWithPrompt(heroPlaceSearch.trim());
                      setHeroPlaceSearch('');
                    }}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <label htmlFor="hero-rag-search" className="sr-only">
                      Ask AI Yatri about weather or permits in any Uttarakhand location
                    </label>
                    <input
                      id="hero-rag-search"
                      type="text"
                      value={heroPlaceSearch}
                      onChange={e => setHeroPlaceSearch(e.target.value)}
                      placeholder="Try 'weather in Munsiyari', 'weather in Pithoragarh', 'Chopta permits'..."
                      className="flex-1 min-h-[44px] px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="min-h-[44px] px-5 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Ask AI Yatri</span>
                    </button>
                  </form>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Instant checks:</span>
                    {[
                      'Munsiyari',
                      'Chopta',
                      'Nainital',
                      'Pithoragarh',
                      'Kausani',
                      'Abbott Mount',
                      'Tehri',
                    ].map(place => (
                      <button
                        key={place}
                        type="button"
                        onClick={() => handleOpenAIWithPrompt(`Weather in ${place}`)}
                        className="text-emerald-900 hover:text-emerald-700 font-medium underline underline-offset-2 cursor-pointer"
                      >
                        {place}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Parallax High-Impact Himalayan Visual Carrier */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-stone-200 bg-slate-900 min-h-[340px] sm:min-h-[420px]">
                <img
                  src="/src/assets/images/hero_uttarakhand_peaks_1794422448719.jpg"
                  alt="Golden hour sunrise over Nanda Devi and Panchachuli Himalayan peaks in Uttarakhand"
                  referrerPolicy="no-referrer"
                  style={{
                    transform: `translate3d(0, ${parallaxOffset * 0.5}px, 0) scale(1.08)`,
                  }}
                  className="w-full h-full object-cover transition-transform duration-150 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs text-amber-300 font-medium mb-1">
                    Nanda Devi & Panchachuli Sanctuary Corridor · 2,200m – 4,329m
                  </div>
                  <p className="font-serif-display text-lg sm:text-xl font-medium leading-snug">
                    "Preserving fragile bugyal alpine meadows while channeling 88% of tourism revenue directly to village communities."
                  </p>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative Proof Strip Below Hero */}
            <div className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-slate-900">
                  13 Districts
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Dynamic AI Yatri RAG coverage across every village in Garhwal & Kumaon
                </div>
              </div>
              <div>
                <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-emerald-900">
                  88% Retained
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Tariff revenue retained directly by local Koti Banal homestay hosts & women collectives
                </div>
              </div>
              <div>
                <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-slate-900">
                  12,470 kg
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Single-use plastic diverted via QR-tagged deposit stations across 7 circuits
                </div>
              </div>
              <div>
                <div className="font-mono-tabular text-2xl sm:text-3xl font-bold text-slate-900">
                  3 Role Portals
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Unified live workspace for Travelers, Homestay Owners, and Eco-Tourism Board officers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            ROLE-BASED INTERACTIVE DASHBOARD WORKSPACE
           ================================================================= */}
        {currentUser ? (
          <RoleDashboards
            user={currentUser}
            savedCircuitIds={savedCircuitIds}
            circuits={CIRCUITS_DATA}
            onToggleSaveCircuit={handleToggleSaveCircuit}
            homestays={homestays}
            onUpdateHomestayPrice={handleUpdateHomestayPrice}
            inquiries={inquiries}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onCreateInquiry={handleCreateInquiry}
            ecoGuidelines={ecoGuidelines}
            onToggleGuidelineActive={handleToggleGuidelineActive}
            onAddGuideline={handleAddGuideline}
            regionalStats={REGIONAL_SUSTAINABILITY_STATS}
            onSwitchRoleQuick={handleQuickRoleSwitch}
            onOpenAIAssistantWithPrompt={handleOpenAIWithPrompt}
          />
        ) : (
          <section id="role-workspace" className="py-10 bg-stone-100 border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-display text-xl font-semibold text-slate-900">
                  Viewing as Public Guest
                </h2>
                <p className="text-sm text-slate-600">
                  Sign in to test the Traveler Itinerary Console, Homestay Owner Property Manager, or Eco-Tourism Board Dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="min-h-[44px] px-5 py-2.5 bg-[#143328] text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Open Role Selection Modal
              </button>
            </div>
          </section>
        )}

        {/* =================================================================
            SECTION 01: INTERACTIVE CIRCUITS SECTION (GARHWAL & KUMAON)
           ================================================================= */}
        <section id="circuits" className="py-14 sm:py-20 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="text-xs font-medium text-emerald-900 mb-1">
                  01. Garhwal (Chopta, Tehri, Haridwar) & Kumaon (Munsiyari, Kausani, Abbott Mount)
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900">
                  Interactive Himalayan Eco-Circuits
                </h2>
              </div>

              {/* Interactive Division Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl border border-stone-300/80 self-start">
                {(['All', 'Garhwal', 'Kumaon'] as const).map(region => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setCircuitDivisionFilter(region)}
                    className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      circuitDivisionFilter === region
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {region === 'All'
                      ? `All Circuits (${CIRCUITS_DATA.length})`
                      : `${region} Division`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredCircuits.map(circuit => {
                const isSaved = savedCircuitIds.includes(circuit.id);
                return (
                  <article
                    key={circuit.id}
                    className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="aspect-4/3 bg-slate-900 relative overflow-hidden">
                        <img
                          src={circuit.imageUrl}
                          alt={circuit.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-4 text-white">
                          <span className="text-xs font-mono-tabular">
                            {circuit.region} · {circuit.district}
                          </span>
                          <span className="text-xs font-mono-tabular text-amber-300">
                            {circuit.altitude}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="text-xs text-slate-500 mb-2">
                          <span>{circuit.duration}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{circuit.difficulty}</span>
                          <span aria-hidden="true"> · </span>
                          <span className="font-mono-tabular text-emerald-800 font-medium">
                            {circuit.carbonFootprintKg} kg CO₂ (-{circuit.carbonSavedPercent}%)
                          </span>
                        </div>

                        <h3 className="font-serif-display text-xl font-semibold text-slate-900 mb-2">
                          {circuit.title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                          {circuit.summary}
                        </p>

                        <div className="text-xs text-emerald-950 bg-stone-100 p-2.5 rounded-lg mb-3">
                          <strong className="font-semibold">Cultural Heritage:</strong>{' '}
                          {circuit.culturalHighlights}
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-stone-200/80 text-xs text-slate-700">
                          {circuit.highlights.map(hl => (
                            <div key={hl} className="flex items-center gap-2">
                              <span className="text-emerald-800 font-bold">·</span>
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500 block">
                          Eco-Tariff · {circuit.ecoCapacityRemaining} slots left
                        </span>
                        <span className="font-mono-tabular text-base font-bold text-slate-900">
                          ₹{circuit.basePriceInr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenAIWithPrompt(
                              `Current weather in ${circuit.title.split(',')[0]} circuit and permit rules?`
                            )
                          }
                          className="min-h-[44px] px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-900/10 hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer"
                        >
                          Weather & Permit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSaveCircuit(circuit.id)}
                          className={`min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-[#143328] text-white'
                              : 'bg-white border border-stone-300 text-slate-800 hover:bg-stone-100'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Saved
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" /> Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            INTERACTIVE 3D ELEMENT: HIMALAYAN SANCTUARY & KOTI ARCHITECTURE
           ================================================================= */}
        <Himalayan3DScene onAskAI={handleOpenAIWithPrompt} />

        {/* =================================================================
            SECTION 02: COMMUNITY HOMESTAYS GRID WITH BOOKING MODAL TRIGGER
           ================================================================= */}
        <section id="homestays" className="py-14 sm:py-20 border-b border-stone-200 bg-stone-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="text-xs font-medium text-emerald-900 mb-1">
                  02. Vernacular Seismic-Resilient Architecture & Local Families
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900">
                  Community-Owned Heritage Homestays
                </h2>
              </div>

              {/* Filterable Homestay Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl border border-stone-300/80 self-start">
                {(
                  [
                    'All',
                    'Garhwal',
                    'Kumaon',
                    'Solar-Powered',
                    'Organic Farm-to-Table',
                  ] as const
                ).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setHomestayFilter(tab)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      homestayFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {filteredHomestays.map(stay => (
                <article
                  key={stay.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                >
                  <div>
                    <div className="aspect-16/10 bg-slate-900 relative overflow-hidden">
                      <img
                        src={stay.imageUrl}
                        alt={stay.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4 text-white">
                        <span className="text-xs font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-300" />
                          {stay.village}, {stay.district} ({stay.region})
                        </span>
                        <span className="font-mono-tabular text-xs text-amber-300 font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                          {stay.rating} · {stay.communityImpactScore}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-xs text-slate-500 mb-1.5">
                        <span>Host Family: {stay.hostName}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="text-emerald-900 font-semibold">
                          {stay.communitySharePercent}% Retained by Village
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{stay.ecoBadges.join(' · ')}</span>
                      </div>

                      <h3 className="font-serif-display text-xl font-semibold text-slate-900 mb-1.5">
                        {stay.name}
                      </h3>

                      <p className="text-xs text-emerald-900 font-medium mb-3">
                        {stay.architectureStyle}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-3 border-t border-stone-200/80 text-xs text-slate-600">
                        {stay.amenities.map(am => (
                          <div key={am} className="flex items-center gap-2">
                            <Sun className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-mono-tabular text-lg font-bold text-slate-900">
                        ₹{stay.pricePerNightInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500"> / night</span>
                      <div className="text-[11px] text-emerald-800 font-mono-tabular">
                        {stay.roomsAvailable} of {stay.totalRooms} rooms open
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenAIWithPrompt(
                            `Local customs for homestay etiquette and availability at ${stay.name} in ${stay.village}`
                          )
                        }
                        className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Etiquette
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingModalHomestay(stay)}
                        className="min-h-[44px] px-4 py-2 bg-[#143328] hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Home className="w-3.5 h-3.5" /> Request Booking
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 03: INTERACTIVE CIRCUIT PLANNER TOOL
           ================================================================= */}
        <CircuitPlanner
          circuits={CIRCUITS_DATA}
          savedCircuitIds={savedCircuitIds}
          onToggleSaveCircuit={handleToggleSaveCircuit}
          onAskAIWithPrompt={handleOpenAIWithPrompt}
        />

        {/* =================================================================
            SECTION 04: IMPACT VISION & MANDATORY ECO-TOURISM CHARTER
           ================================================================= */}
        <section id="impact-vision" className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="text-xs font-medium text-emerald-900 mb-1">
                  04. Impact Vision · Biosphere Protection & Community Revenue Model
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold text-slate-900">
                  Uttarakhand Sustainable Impact Vision & Eco-Charter
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleQuickRoleSwitch('eco_board');
                  document.getElementById('role-workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-emerald-950 bg-stone-200 hover:bg-stone-300 rounded-lg flex items-center gap-2 self-start cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-900" />
                <span>Manage Directives in Eco-Board Console</span>
              </button>
            </div>

            {/* Community Impact Revenue Breakdown Strip */}
            <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#143328] text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-mono-tabular text-amber-300 uppercase tracking-wider">
                  Reverse-Migration & Women’s Collective Economics
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold">
                  How Every ₹1,000 Spent on Explore Uttarakhand Sustains the Himalayas
                </h3>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  Unlike commercial hill-station hotels where 70% of expenditure leaks out of mountain districts, our direct community homestay ledger retains 88% inside the host village while funding forest checkpost waste recovery.
                </p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800">
                  <div className="font-mono-tabular text-2xl font-bold text-amber-300">88%</div>
                  <div className="text-[11px] text-emerald-100 mt-1">
                    Host Family & Women’s Guild
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800">
                  <div className="font-mono-tabular text-2xl font-bold text-emerald-300">8%</div>
                  <div className="text-[11px] text-emerald-100 mt-1">
                    Bugyal & Trail Waste Recovery
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800">
                  <div className="font-mono-tabular text-2xl font-bold text-white">4%</div>
                  <div className="text-[11px] text-emerald-100 mt-1">
                    SDRF Weather & Rescue Grid
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ecoGuidelines
                .filter(g => g.active)
                .map(rule => (
                  <div
                    key={rule.id}
                    className="p-6 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-mono-tabular text-slate-500 mb-2">
                        {rule.code} · {rule.regionScope} · {rule.category}
                      </div>
                      <h3 className="font-serif-display text-lg font-semibold text-slate-900 mb-2">
                        {rule.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-900 font-medium">
                      <span>Status: Actively Enforced at Forest Checkposts</span>
                      <span>Updated {rule.lastUpdated}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          FLOATING AI YATRI RAG DRAWER LAUNCHER BUTTON
         ================================================================= */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsAIDrawerOpen(true)}
          className="min-h-[48px] px-5 py-3 bg-[#143328] hover:bg-emerald-900 text-white rounded-full shadow-xl border border-emerald-700 flex items-center gap-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] cursor-pointer"
          aria-label="Open AI Yatri RAG Assistant Drawer"
        >
          <MessageSquare className="w-4 h-4 text-amber-300" />
          <span>AI Yatri RAG Bot</span>
        </button>
      </div>

      {/* =================================================================
          QUIET EDITORIAL FOOTER
         ================================================================= */}
      <footer className="bg-[#143328] text-stone-300 py-12 border-t border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-serif-display text-xl font-semibold text-white flex items-center gap-2">
              <Leaf className="w-5 h-5 text-amber-300" />
              <span>Explore Uttarakhand</span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Sustainable Himalayan Yatri Portal · Garhwal & Kumaon Eco-Tourism Initiative
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#role-workspace" className="hover:text-white transition-colors">
              Multi-Role Dashboards
            </a>
            <a href="#circuits" className="hover:text-white transition-colors">
              Alpine Circuits
            </a>
            <a href="#himalayan-3d" className="hover:text-white transition-colors">
              3D Sanctuary
            </a>
            <a href="#circuit-planner" className="hover:text-white transition-colors">
              Circuit Planner
            </a>
            <button
              type="button"
              onClick={() => setIsAIDrawerOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              AI Yatri RAG Concierge
            </button>
          </div>
        </div>
      </footer>

      {/* =================================================================
          SLIDE-OUT AI YATRI RAG DRAWER, MULTI-ROLE AUTH & BOOKING MODAL
         ================================================================= */}
      <AIYatriDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        userRole={currentUser?.role || 'guest'}
        initialQuery={pendingAIQuery}
        onClearInitialQuery={() => setPendingAIQuery(null)}
      />

      <RoleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={currentUser?.role || 'guest'}
        onSelectRole={profile => setCurrentUser(profile)}
        onLogout={() => setCurrentUser(null)}
      />

      <BookingModal
        homestay={bookingModalHomestay}
        onClose={() => setBookingModalHomestay(null)}
        defaultGuestName={currentUser?.name || 'Aarav Rawat'}
        defaultGuestEmail={currentUser?.email || 'aarav.yatri@uttarakhand.org'}
        onSubmitBooking={handleCreateInquiry}
      />
    </div>
  );
}
