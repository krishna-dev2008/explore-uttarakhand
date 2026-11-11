import React, { useState } from 'react';
import {
  X,
  Compass,
  Home,
  ShieldCheck,
  Check,
  ArrowRight,
  Lock,
  UserCheck,
} from 'lucide-react';
import { DEMO_USERS, UserProfile, UserRole } from '../data/uttarakhandData';

interface RoleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (user: UserProfile) => void;
  onLogout: () => void;
}

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onLogout,
}) => {
  const [selectedRoleKey, setSelectedRoleKey] = useState<Exclude<UserRole, 'guest'>>(
    currentRole === 'guest' ? 'traveler' : currentRole
  );
  const [customEmail, setCustomEmail] = useState(DEMO_USERS[selectedRoleKey].email);
  const [customPasscode, setCustomPasscode] = useState('••••••••••••');

  if (!isOpen) return null;

  const roleCards: Array<{
    key: Exclude<UserRole, 'guest'>;
    label: string;
    subtitle: string;
    icon: React.ElementType;
    capabilities: string[];
    demoUser: UserProfile;
  }> = [
    {
      key: 'traveler',
      label: 'Traveler / Yatri',
      subtitle: 'Explore circuits, save itineraries & request homestay bookings',
      icon: Compass,
      capabilities: [
        'Save custom Garhwal & Kumaon trekking circuits to personal itinerary',
        'Submit direct booking inquiries to village homestay hosts',
        'Access personalized high-altitude weather & permit alerts',
      ],
      demoUser: DEMO_USERS.traveler,
    },
    {
      key: 'homestay_owner',
      label: 'Local Homestay Owner',
      subtitle: 'Manage heritage property, room tariffs, inquiries & community impact',
      icon: Home,
      capabilities: [
        'Update nightly room tariffs (INR) and live room availability',
        'Accept or decline incoming traveler booking inquiries in real time',
        'Track 88% village women-collective impact share & solar savings',
      ],
      demoUser: DEMO_USERS.homestay_owner,
    },
    {
      key: 'eco_board',
      label: 'Organization / Eco-Tourism Board',
      subtitle: 'Regional sustainability metrics, visitor caps & eco-guideline governance',
      icon: ShieldCheck,
      capabilities: [
        'Monitor live carrying capacity across Garhwal & Kumaon circuits',
        'Publish & toggle mandatory high-altitude eco-guidelines (UETDB)',
        'Audit plastic QR-deposit recovery & village homestay revenue',
      ],
      demoUser: DEMO_USERS.eco_board,
    },
  ];

  const handleRoleChange = (key: Exclude<UserRole, 'guest'>) => {
    setSelectedRoleKey(key);
    setCustomEmail(DEMO_USERS[key].email);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenProfile = {
      ...DEMO_USERS[selectedRoleKey],
      email: customEmail.trim() || DEMO_USERS[selectedRoleKey].email,
    };
    onSelectRole(chosenProfile);
    onClose();
  };

  const handleInstantSwitch = (key: Exclude<UserRole, 'guest'>) => {
    onSelectRole(DEMO_USERS[key]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-auth-modal-title"
    >
      <div className="w-full max-w-4xl bg-[#FAF9F5] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#143328] text-white flex items-center justify-between border-b border-emerald-900">
          <div>
            <p className="text-xs text-amber-300/90 font-medium mb-0.5">
              Uttarakhand Unified Yatri & Governance Portal
            </p>
            <h2 id="role-auth-modal-title" className="font-serif-display text-xl sm:text-2xl font-semibold text-white">
              Multi-Role Portal Authentication
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-emerald-100 hover:bg-emerald-800/60 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3 Role Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-semibold text-slate-500 mb-2">
              1. Select Portal Profile Role (Click to preview or instant-switch)
            </div>

            {roleCards.map(card => {
              const Icon = card.icon;
              const isSelected = selectedRoleKey === card.key;
              const isCurrentActive = currentRole === card.key;

              return (
                <div
                  key={card.key}
                  onClick={() => handleRoleChange(card.key)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRoleChange(card.key);
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-emerald-800 ring-2 ring-emerald-800/20 shadow-sm'
                      : 'bg-stone-100/70 border-stone-200 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#143328] text-amber-300'
                            : 'bg-stone-200 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif-display text-base font-semibold text-slate-900">
                            {card.label}
                          </h3>
                          {isCurrentActive && (
                            <span className="text-xs font-medium text-emerald-800">
                              · Active Session
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{card.subtitle}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleInstantSwitch(card.key);
                      }}
                      className="min-h-[38px] px-3 py-1.5 text-xs font-semibold bg-emerald-900/10 hover:bg-[#143328] text-emerald-950 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Quick Demo Login
                    </button>
                  </div>

                  <ul className="mt-3 pt-2.5 border-t border-stone-200/80 space-y-1">
                    {card.capabilities.map((cap, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Right Column: Credentials Form & Role Summary */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <span className="text-xs text-slate-500">Selected Profile</span>
                <h4 className="font-serif-display text-lg font-semibold text-slate-900">
                  {DEMO_USERS[selectedRoleKey].name}
                </h4>
              </div>
              <Lock className="w-4 h-4 text-emerald-800" />
            </div>

            <div className="text-xs text-slate-600 space-y-1 mb-5 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
              <div>
                <span className="font-semibold text-slate-800">Designation:</span>{' '}
                {DEMO_USERS[selectedRoleKey].title}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Jurisdiction:</span>{' '}
                {DEMO_USERS[selectedRoleKey].region}
              </div>
              {DEMO_USERS[selectedRoleKey].organizationOrProperty && (
                <div>
                  <span className="font-semibold text-slate-800">Entity:</span>{' '}
                  {DEMO_USERS[selectedRoleKey].organizationOrProperty}
                </div>
              )}
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="auth-email-input"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Portal Email / Yatri ID
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-passcode-input"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Passkey / OTP Token
                </label>
                <input
                  id="auth-passcode-input"
                  type="password"
                  required
                  value={customPasscode}
                  onChange={e => setCustomPasscode(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] px-4 py-2.5 bg-[#143328] hover:bg-emerald-900 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  Sign In as{' '}
                  {selectedRoleKey === 'traveler'
                    ? 'Traveler'
                    : selectedRoleKey === 'homestay_owner'
                    ? 'Homestay Owner'
                    : 'Eco-Tourism Board'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {currentRole !== 'guest' && (
              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">Currently signed in</span>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                >
                  Sign Out to Public Guest View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
