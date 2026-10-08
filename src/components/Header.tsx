import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';
import { CareFundLogo } from './CareFundLogo';
import { UserRole } from './Sidebar';
import {
  Menu,
  Globe,
  Bell,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  role: UserRole;
  currentSectionTitle: string;
  onOpenMobileSidebar: () => void;
  onSignOut: () => void;
  unreadCount?: number;
  firebaseConnected?: boolean;
  currentUser?: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  currentSectionTitle,
  onOpenMobileSidebar,
  onSignOut,
  unreadCount = 2,
  firebaseConnected = true,
  currentUser,
}) => {
  const { language, setLanguage, languagesList, t } = useLanguage();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleNames: Record<UserRole, { title: string; user: string; email: string }> = {
    donor: {
      title: 'Donor Portal',
      user: 'Karthik Ramanathan',
      email: 'karthik.r@chennaidonors.org',
    },
    patient: {
      title: 'Patient Portal',
      user: 'Revathi S.',
      email: 'revathi.aarav@patient.carefund.org',
    },
    hospital: {
      title: 'Hospital Portal',
      user: 'Dr. C. Balasubramanian',
      email: 'clinical.desk@apollo.carefund.org',
    },
    reviewer: {
      title: 'Reviewer Portal',
      user: 'Dr. K. Swaminathan, MD',
      email: 'k.swaminathan@audit.carefund.org',
    },
  };

  const currentRoleInfo = roleNames[role];
  const displayName = currentUser?.displayName || currentRoleInfo.user;
  const displayEmail = currentUser?.email || currentRoleInfo.email;
  const photoURL = currentUser?.photoURL;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu toggle + Mobile brand OR Desktop section title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer"
              aria-label="Open portal navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Mark */}
            <div className="lg:hidden">
              <CareFundLogo size="sm" subtitle={currentRoleInfo.title} />
            </div>

            {/* Desktop section breadcrumb / title */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {currentRoleInfo.title}
              </span>
              <span className="text-neutral-300">/</span>
              <span className="text-sm font-semibold text-neutral-900">
                {currentSectionTitle}
              </span>
            </div>
          </div>

          {/* Right: Language Switcher, Firebase Badge & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Live Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
              <span className={`w-1.5 h-1.5 rounded-full ${firebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
              <span>{firebaseConnected ? 'Firebase Live' : 'Firebase Offline'}</span>
            </div>

            {/* Language Dropdown: Clean, prominent, easy to change */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs text-neutral-700 font-medium">
                <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-xs text-neutral-800 font-medium cursor-pointer focus:outline-none pr-1"
                  aria-label="Select language"
                >
                  {languagesList.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeLabel} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* User Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700 cursor-pointer"
                aria-label="User profile and settings"
              >
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border border-neutral-300 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-800 font-semibold text-xs border border-neutral-300">
                    {displayName.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline-block text-xs font-medium text-neutral-800 max-w-[120px] truncate">
                  {displayName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {displayEmail}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">
                        {currentRoleInfo.title}
                      </span>
                      {currentUser && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Google
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
