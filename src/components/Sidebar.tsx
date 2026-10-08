import React from 'react';
import { CareFundLogo } from './CareFundLogo';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LayoutDashboard,
  HeartHandshake,
  Receipt,
  Crosshair,
  Sparkles,
  Bell,
  User,
  FilePlus2,
  FolderHeart,
  FileText,
  CheckCircle2,
  Calculator,
  ClipboardList,
  CreditCard,
  Scale,
  ListFilter,
  UserCheck,
  CheckCheck,
  History,
  LogOut,
  X,
  Search,
  Building2,
} from 'lucide-react';

export type UserRole = 'donor' | 'patient' | 'hospital' | 'reviewer';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSignOut: () => void;
  unreadNotificationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onSignOut,
  unreadNotificationsCount = 2,
}) => {
  const { t } = useLanguage();

  // Role identity subtitles as required in Rule 11
  const rolePortals: Record<UserRole, { title: string; subtitle: string; userName: string; userRoleText: string }> = {
    donor: {
      title: 'Donor Portal',
      subtitle: 'Verified Escrow Crowdfunding',
      userName: 'Karthik Ramanathan',
      userRoleText: 'Verified Donor (Chennai)',
    },
    patient: {
      title: 'Patient Portal',
      subtitle: 'Medical Assistance Hub',
      userName: 'Revathi S. (Mother of Aarav)',
      userRoleText: 'Patient / Family Applicant',
    },
    hospital: {
      title: 'Hospital Portal',
      subtitle: 'Clinical Partner Desk',
      userName: 'Dr. C. Balasubramanian',
      userRoleText: 'Apollo Hospitals Clinical Desk',
    },
    reviewer: {
      title: 'Reviewer Portal',
      subtitle: 'Authorized Clinical Audit',
      userName: 'Dr. K. Swaminathan, MD',
      userRoleText: 'Authorized Medical Auditor',
    },
  };

  const portalInfo = rolePortals[role];

  // Specific menu items strictly adhering to Section 6
  const getMenuItems = (): SidebarItem[] => {
    switch (role) {
      case 'donor':
        return [
          { id: 'dashboard', label: 'Donor Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'find-patients', label: 'Find Patients', icon: <Search className="w-4 h-4" /> },
          { id: 'cases', label: 'Verified Cases', icon: <HeartHandshake className="w-4 h-4" /> },
          { id: 'my-donations', label: 'My Donations', icon: <Receipt className="w-4 h-4" /> },
          { id: 'donation-history', label: 'Donation History', icon: <History className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'patient':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'my-cases', label: 'My Case', icon: <FolderHeart className="w-4 h-4" /> },
          { id: 'medical', label: 'Medical Information', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'hospital-details', label: 'Hospital Details', icon: <Building2 className="w-4 h-4" /> },
          { id: 'funding-gap', label: 'Funding Requirement', icon: <Calculator className="w-4 h-4" /> },
          { id: 'government', label: 'Government Scheme', icon: <Scale className="w-4 h-4" /> },
          { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
          { id: 'verification', label: 'Hospital Verification', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'status', label: 'Case Status', icon: <CheckCheck className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'hospital':
        return [
          { id: 'dashboard', label: 'Hospital Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'assigned-patients', label: 'Assigned Patients', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'pending-verification', label: 'Pending Verification', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
          { id: 'hospital-letters', label: 'Hospital Letters', icon: <Receipt className="w-4 h-4" /> },
          { id: 'verified-cases', label: 'Verified Cases', icon: <CheckCheck className="w-4 h-4" /> },
          { id: 'rejected-cases', label: 'Rejected Cases', icon: <X className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ];
      case 'reviewer':
        return [
          { id: 'dashboard', label: 'Reviewer Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'all-cases', label: 'All Cases', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'pending-review', label: 'Pending Review', icon: <ListFilter className="w-4 h-4" /> },
          { id: 'document-review', label: 'Document Review', icon: <Search className="w-4 h-4" /> },
          { id: 'hospital-verification', label: 'Hospital Verification', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'approved-cases', label: 'Approved Cases', icon: <CheckCheck className="w-4 h-4" /> },
          { id: 'rejected-cases', label: 'Rejected Cases', icon: <X className="w-4 h-4" /> },
          { id: 'more-information', label: 'More Information', icon: <Bell className="w-4 h-4" /> },
          { id: 'audit-trail', label: 'Audit History', icon: <History className="w-4 h-4" /> },
          { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
        ];
    }
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200">
      {/* Brand & Role Header */}
      <div className="p-5 border-b border-neutral-100 flex items-start justify-between">
        <div>
          <CareFundLogo size="md" />
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-800 tracking-tight">
              {portalInfo.title}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
          </div>
          <p className="text-[11px] text-neutral-500 font-normal">
            {portalInfo.subtitle}
          </p>
        </div>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-red-600' : 'text-neutral-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust Principle statement as mandated in prompt: "AI assists. Humans decide." */}
      <div className="p-3 mx-3 mb-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-[11px] font-semibold text-neutral-900 leading-tight">
          AI assists. Humans decide.
        </p>
        <p className="text-[10px] text-neutral-500 mt-1 leading-snug">
          Zero automated approvals or rejections. Every final decision is made by authorized clinical reviewers.
        </p>
      </div>

      {/* User profile & Sign Out at bottom */}
      <div className="p-3 border-t border-neutral-100 bg-white">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-semibold text-xs shrink-0">
              {portalInfo.userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-neutral-900 truncate">
                {portalInfo.userName}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {portalInfo.userRoleText}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out of portal"
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
