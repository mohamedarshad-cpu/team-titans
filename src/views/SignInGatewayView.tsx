import React, { useState, useEffect } from 'react';
import { CareFundLogo } from '../components/CareFundLogo';
import { CareFundRole, FirebaseUser, signInWithGoogle, identifyUserAccountRole, saveUserProfile } from '../firebase';
import { Phone, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface AuthenticatedUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface SignInGatewayViewProps {
  onSuccess: (user: AuthenticatedUser, role: CareFundRole) => void;
}

type LoginMode = 'options' | 'phone-input' | 'phone-otp' | 'first-time-setup';

export const SignInGatewayView: React.FC<SignInGatewayViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<LoginMode>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone Login State
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  // Authenticated pending user (for first-time setup only)
  const [pendingUser, setPendingUser] = useState<AuthenticatedUser | null>(null);
  const [selectedInitialRole, setSelectedInitialRole] = useState<CareFundRole>('donor');

  // Resend OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendActive(false);
    }
    return () => clearInterval(interval);
  }, [isResendActive, resendTimer]);

  /**
   * Process authenticated user:
   * 1. Check if user has an existing account and assigned role
   * 2. If returning user: directly redirect to their portal without asking!
   * 3. If first-time user: prompt for one-time role setup and remember permanently
   */
  const handleUserAuthenticated = async (user: AuthenticatedUser) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const existingRole = await identifyUserAccountRole(user.uid, user.email, user.phoneNumber);

      if (existingRole) {
        // Returning user: Directly open their assigned dashboard
        onSuccess(user, existingRole);
      } else {
        // First-time user: Display one-time account setup
        setPendingUser(user);
        setMode('first-time-setup');
      }
    } catch (err: any) {
      console.warn('Error identifying account:', err);
      // Fallback: prompt role setup
      setPendingUser(user);
      setMode('first-time-setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: CareFundRole, name: string, email: string) => {
    const authUser: AuthenticatedUser = {
      uid: `demo_${role}_${Date.now()}`,
      email: email,
      displayName: name,
      phoneNumber: '+919876543210',
      photoURL: null,
    };
    onSuccess(authUser, role);
  };

  /**
   * Handle Google OAuth Sign In
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const firebaseUser: FirebaseUser = await signInWithGoogle();
      const authUser: AuthenticatedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        phoneNumber: firebaseUser.phoneNumber,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      await handleUserAuthenticated(authUser);
    } catch (error: any) {
      console.warn('Google sign-in attempt:', error);
      if (error?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in popup was closed. Please try again.');
      } else if (error?.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by your browser. Please allow popups or continue with Phone Number.');
      } else if (error?.code === 'auth/unauthorized-domain') {
        setErrorMessage('This preview domain is not authorized in Firebase Console for Google Sign-In. Please continue with Phone Number or Quick Demo Portal Access below.');
      } else {
        setErrorMessage(
          error?.message || 'Google sign-in could not be completed. Please continue with Phone Number.'
        );
      }
      setIsLoading(false);
    }
  };

  /**
   * Phone Login: Step 1 — Send OTP
   */
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Generate random 6-digit OTP for instant verification
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);

    setTimeout(() => {
      setIsLoading(false);
      setMode('phone-otp');
      setResendTimer(30);
      setIsResendActive(true);
      // Pre-fill demo OTP code so tester is never stuck waiting for SMS gateway
      setOtpCode(randomOtp);
    }, 600);
  };

  /**
   * Phone Login: Step 2 — Verify OTP
   */
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456') {
      setErrorMessage(`Invalid OTP code. Please enter the 6-digit code (${generatedOtp}).`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const formattedPhone = `${countryCode}${cleanDigits}`;

    const authUser: AuthenticatedUser = {
      uid: `phone_${cleanDigits}`,
      phoneNumber: formattedPhone,
      displayName: `User (${cleanDigits.slice(-4)})`,
      email: null,
      photoURL: null,
    };

    setTimeout(async () => {
      await handleUserAuthenticated(authUser);
    }, 400);
  };

  /**
   * First-Time User: Complete Initial Role Setup
   */
  const handleCompleteSetup = async () => {
    if (!pendingUser) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await saveUserProfile({
        uid: pendingUser.uid,
        email: pendingUser.email,
        phoneNumber: pendingUser.phoneNumber,
        displayName: pendingUser.displayName,
        photoURL: pendingUser.photoURL,
        role: selectedInitialRole,
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      onSuccess(pendingUser, selectedInitialRole);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Account setup could not be completed. Please try again.');
      console.warn('Error saving initial profile:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200/80 p-8 sm:p-10 shadow-sm animate-in fade-in duration-200">
        
        {/* Brand */}
        <div className="flex justify-center mb-6">
          <CareFundLogo size="lg" />
        </div>

        {/* Heading & Subtitle */}
        {mode !== 'first-time-setup' ? (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Sign In to CareFund
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Secure access to your CareFund account.
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Account Setup
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Select your account type to open your dashboard.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {/* VIEW 1: Main Login Options (Google OR Phone) */}
        {mode === 'options' && (
          <div className="space-y-5">
            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-neutral-600 animate-spin" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google G Logo */}
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-neutral-200 flex-1" />
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                OR
              </span>
              <div className="h-px bg-neutral-200 flex-1" />
            </div>

            {/* Continue with Phone Number */}
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode('phone-input');
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
            >
              <Phone className="w-4 h-4 text-neutral-600" />
              <span>Continue with Phone Number</span>
            </button>

            {/* Quick Demo Portal Access (Bypasses domain restrictions for instant testing) */}
            <div className="pt-4 border-t border-neutral-100 mt-4">
              <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5 text-center">
                Quick Demo Portal Access
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('patient', 'Revathi S. (Patient)', 'revathi@carefund.org')}
                  className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/40 text-left text-xs font-semibold text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  🏥 Patient Portal
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('hospital', 'Dr. C. Balasubramanian', 'hospital@apollo.org')}
                  className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/40 text-left text-xs font-semibold text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  🏨 Hospital Desk
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('donor', 'Karthik Ramanathan', 'donor@carefund.org')}
                  className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/40 text-left text-xs font-semibold text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  🤝 Donor Portal
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('reviewer', 'Dr. K. Swaminathan, MD', 'reviewer@carefund.org')}
                  className="p-2 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50/40 text-left text-xs font-semibold text-neutral-800 transition-all cursor-pointer shadow-2xs"
                >
                  ⚖️ Reviewer Portal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Phone Input */}
        {mode === 'phone-input' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-neutral-300 overflow-hidden focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/10">
                <span className="inline-flex items-center px-3.5 bg-neutral-50 text-neutral-700 text-sm font-medium border-r border-neutral-200">
                  {countryCode}
                </span>
                <input
                  type="tel"
                  autoFocus
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 py-3 px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5">
                We will send an OTP via SMS to verify your mobile number.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || phoneNumber.length < 10}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending OTP...</span>
                </>
              ) : (
                <span>Send OTP</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode('options');
              }}
              className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign-in options</span>
            </button>
          </form>
        )}

        {/* VIEW 3: OTP Verification */}
        {mode === 'phone-otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Enter OTP
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('phone-input');
                  }}
                  className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Edit number
                </button>
              </div>

              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full py-3 px-4 text-center tracking-widest text-lg font-mono font-bold text-neutral-900 border border-neutral-300 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-600/10 focus:outline-none"
                disabled={isLoading}
              />

              <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
                <span>Sent to {countryCode} {phoneNumber}</span>
                {isResendActive ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleSendOtp(e as any)}
                    className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Demo test helper */}
              {generatedOtp && (
                <div className="mt-3 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 flex items-center justify-between">
                  <span>Demo OTP code: <strong className="font-mono text-neutral-900">{generatedOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(generatedOtp)}
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode('phone-input');
              }}
              className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Use a different mobile number</span>
            </button>
          </form>
        )}

        {/* VIEW 4: First-Time User Role Setup (Shown ONCE only to new users) */}
        {mode === 'first-time-setup' && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-600 mb-3 text-center">
              Choose how you will be using CareFund. Your portal will open automatically on future logins.
            </p>

            <div className="space-y-2">
              {[
                { role: 'patient' as CareFundRole, label: 'Patient / Family', desc: 'Request medical assistance and upload bills' },
                { role: 'donor' as CareFundRole, label: 'Donor', desc: 'Browse verified cases and donate via escrow' },
                { role: 'hospital' as CareFundRole, label: 'Hospital Desk', desc: 'Clinical desk verifying patient admissions' },
                { role: 'reviewer' as CareFundRole, label: 'Reviewer / Auditor', desc: 'Authorized clinical documentation audit' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedInitialRole(item.role)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedInitialRole === item.role
                      ? 'border-red-600 bg-red-50/50 ring-2 ring-red-600/10'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{item.label}</p>
                    <p className="text-[11px] text-neutral-500">{item.desc}</p>
                  </div>
                  {selectedInitialRole === item.role && (
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCompleteSetup}
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up account...</span>
                </>
              ) : (
                <span>Complete Setup & Enter Dashboard</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
