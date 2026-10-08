import React, { useState, useEffect } from 'react';
import { MedicalCase, DonationRecord } from './types/carefund';
import { INITIAL_CASES, INITIAL_DONATIONS } from './data/mockCases';
import { Sidebar, UserRole } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SignInGatewayView, AuthenticatedUser } from './views/SignInGatewayView';
import { DonorPortalView } from './views/DonorPortalView';
import { PatientPortalView } from './views/PatientPortalView';
import { HospitalPortalView } from './views/HospitalPortalView';
import { ReviewerPortalView } from './views/ReviewerPortalView';
import { useLanguage } from './i18n/LanguageContext';

import {
  subscribeToCases,
  subscribeToDonations,
  saveCaseToFirestore,
  saveDonationToFirestore,
  testFirestoreConnection,
  subscribeToAuthState,
  FirebaseUser,
  logOutFromFirebase,
  identifyUserAccountRole,
} from './firebase';

export default function App() {
  const { t } = useLanguage();

  const normalizeRole = (r: string | null): UserRole | null => {
    if (!r) return null;
    if (r === 'hospital_desk' || r === 'hospital') return 'hospital';
    if (r === 'auditor' || r === 'reviewer') return 'reviewer';
    if (r === 'donor') return 'donor';
    if (r === 'patient') return 'patient';
    return null;
  };

  const getRoleRoute = (role: UserRole): string => {
    switch (role) {
      case 'patient': return '/patient';
      case 'hospital': return '/hospital';
      case 'donor': return '/donor';
      case 'reviewer': return '/reviewer';
      default: return '/patient';
    }
  };

  // Current authenticated user (persisted in session)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    const saved = localStorage.getItem('carefund_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Role state: automatically restored only if user is logged in
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const savedUser = localStorage.getItem('carefund_auth_user');
    if (!savedUser) return null; // Default to null so clean Login page is displayed
    const savedRole = localStorage.getItem('carefund_user_role');
    return normalizeRole(savedRole);
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cases, setCases] = useState<MedicalCase[]>(INITIAL_CASES);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Sync role to localStorage and enforce strict URL portal routes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('carefund_user_role', userRole);
      const path = window.location.pathname;
      const expectedRoute = getRoleRoute(userRole);
      if (path !== expectedRoute && path !== '/') {
        window.history.replaceState({}, '', expectedRoute);
      } else if (path === '/' || path === '') {
        window.history.replaceState({}, '', expectedRoute);
      }
    } else {
      localStorage.removeItem('carefund_user_role');
    }
  }, [userRole]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((user: FirebaseUser | null) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Connect to Firebase Firestore real-time streams
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setFirebaseConnected(connected);
    });

    const unsubCases = subscribeToCases(
      (remoteCases) => {
        if (remoteCases && remoteCases.length > 0) {
          setCases(remoteCases);
        }
      },
      () => setFirebaseConnected(false)
    );

    const unsubDonations = subscribeToDonations(
      (remoteDonations) => {
        if (remoteDonations && remoteDonations.length > 0) {
          setDonations(remoteDonations);
        }
      },
      () => setFirebaseConnected(false)
    );

    return () => {
      unsubCases();
      unsubDonations();
    };
  }, []);

  // Handle successful donation: update case state and add to donation ledger in Firebase
  const handleDonateSuccess = (donation: DonationRecord) => {
    setDonations((prev) => [donation, ...prev]);

    let targetUpdatedCase: MedicalCase | undefined;

    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === donation.caseId) {
          const newRaised = c.alreadyRaised + donation.amount;
          const newStillNeeded = Math.max(0, c.verifiedFundingGap - newRaised);
          const isFunded = newStillNeeded <= 0;

          const updated: MedicalCase = {
            ...c,
            alreadyRaised: newRaised,
            stillNeeded: newStillNeeded,
            status: isFunded ? 'Fully Funded' : c.status,
          };
          targetUpdatedCase = updated;
          return updated;
        }
        return c;
      })
    );

    // Persist donation and case to Firebase Firestore
    saveDonationToFirestore(donation, targetUpdatedCase);
  };

  // Handle new assistance request submitted: save to state and Firebase
  const handleNewCaseSubmit = (newCase: MedicalCase) => {
    setCases((prev) => [newCase, ...prev]);
    saveCaseToFirestore(newCase);
  };

  // Handle case updates from Hospital Desk or Reviewer Auditor: sync to state and Firebase
  const handleUpdateCase = (updatedCase: MedicalCase) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    saveCaseToFirestore(updatedCase);
  };

  const handleSignOut = async () => {
    try {
      await logOutFromFirebase();
    } catch (e) {
      console.warn('Firebase sign out notice:', e);
    }
    localStorage.removeItem('carefund_auth_user');
    localStorage.removeItem('carefund_user_role');
    setCurrentUser(null);
    setUserRole(null);
    setActiveTab('dashboard');
    window.history.replaceState({}, '', '/');
  };

  const handleLoginSuccess = (user: AuthenticatedUser, role: string) => {
    const norm = normalizeRole(role) || 'donor';
    setCurrentUser(user);
    setUserRole(norm);
    localStorage.setItem('carefund_auth_user', JSON.stringify(user));
    localStorage.setItem('carefund_user_role', norm);
    const targetRoute = getRoleRoute(norm);
    window.history.pushState({}, '', targetRoute);
    setActiveTab('dashboard');
  };

  // If user is not logged in or role not determined, display clean single-portal login page
  if (!userRole || !currentUser) {
    return <SignInGatewayView onSuccess={handleLoginSuccess} />;
  }

  // Helper for top header breadcrumb title
  const getSectionTitle = (tab: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      cases: 'Verified Cases',
      'my-donations': 'My Donations',
      tracking: 'Donation Tracking',
      impact: 'Impact & Outcomes',
      notifications: 'Notifications',
      profile: 'Profile & Settings',
      create: 'Create Request',
      'my-cases': 'My Cases',
      documents: 'Documents',
      verification: 'Verification Status',
      'funding-gap': 'Funding Gap',
      costs: 'Treatment Costs',
      payments: 'Escrow Payments',
      reconciliation: 'Reconciliation',
      'cases-to-review': 'Cases to Review',
      'ai-screening': 'AI Screening Results',
      'human-review': 'Human Review Desk',
      'final-decisions': 'Final Decision Console',
      'audit-trail': 'Audit Trail',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] text-neutral-900 selection:bg-red-500 selection:text-white font-sans">
      {/* 1. Left Sidebar: Role-Specific, NO other roles, NO Switch Role */}
      <Sidebar
        role={userRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* 2. Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimal Header (NO black bar, NO switch role buttons) */}
        <Header
          role={userRole}
          currentSectionTitle={getSectionTitle(activeTab)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSignOut={handleSignOut}
          firebaseConnected={firebaseConnected}
          currentUser={currentUser}
        />

        {/* Main Role-Specific View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* DONOR PORTAL */}
          {userRole === 'donor' && (
            <DonorPortalView
              cases={cases}
              donations={donations}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onDonateSuccess={handleDonateSuccess}
              onUpdateCase={handleUpdateCase}
            />
          )}

          {/* PATIENT / FAMILY PORTAL */}
          {userRole === 'patient' && (
            <PatientPortalView
              cases={cases}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onSubmitNewCase={handleNewCaseSubmit}
              onUpdateCase={handleUpdateCase}
              currentUser={currentUser}
            />
          )}

          {/* HOSPITAL PORTAL */}
          {userRole === 'hospital' && (
            <HospitalPortalView
              cases={cases}
              donations={donations}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onUpdateCase={handleUpdateCase}
              onDonateSuccess={handleDonateSuccess}
            />
          )}

          {/* REVIEWER & AUDIT PORTAL */}
          {userRole === 'reviewer' && (
            <ReviewerPortalView
              cases={cases}
              donations={donations}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onUpdateCase={handleUpdateCase}
              onDonateSuccess={handleDonateSuccess}
            />
          )}
        </main>

        {/* Universal Minimal Footer with CareFund + */}
        <Footer />
      </div>
    </div>
  );
}
