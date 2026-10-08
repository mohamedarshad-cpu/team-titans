import React, { useState } from 'react';
import { MedicalCase, DonationRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { InfoBlock } from '../components/InfoBlock';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { DonateModal } from '../components/DonateModal';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import {
  Search,
  Building2,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Receipt,
  Download,
  Crosshair,
  Sparkles,
  Bell,
  User,
  Lock,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface DonorPortalViewProps {
  cases: MedicalCase[];
  donations: DonationRecord[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onDonateSuccess: (donation: DonationRecord) => void;
  onUpdateCase: (updatedCase: MedicalCase) => void;
}

export const DonorPortalView: React.FC<DonorPortalViewProps> = ({
  cases,
  donations,
  activeTab,
  onSelectTab,
  onDonateSuccess,
  onUpdateCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [donateCase, setDonateCase] = useState<MedicalCase | null>(null);
  const [downloadSuccessReceipt, setDownloadSuccessReceipt] = useState<string | null>(null);

  // Profile preferences state
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [smsMilestones, setSmsMilestones] = useState(true);
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  const categories = ['All', 'Cardiac', 'Oncology', 'Pediatric', 'Trauma & Ortho', 'Transplant'];

  const filteredCases = cases.filter((c) => {
    const matchesCategory =
      selectedCategory === 'All' || c.treatmentCategory === selectedCategory;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate platform totals
  const totalVerifiedCost = cases.reduce((acc, c) => acc + c.totalTreatmentCost, 0);
  const totalStillNeeded = cases.reduce((acc, c) => acc + c.stillNeeded, 0);
  const totalRaised = cases.reduce((acc, c) => acc + c.alreadyRaised, 0);
  const totalMyDonations = donations.reduce((acc, d) => acc + d.amount, 0);

  const featuredCase = cases.find((c) => c.id === 'CF-CHN-2026-00124') || cases[0];

  const handleDownloadTaxReceipt = (receiptId: string) => {
    setDownloadSuccessReceipt(receiptId);
    setTimeout(() => setDownloadSuccessReceipt(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* TAB: DASHBOARD                                                 */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Page Title & Short Description */}
          <div>
            <h1 className="cf-title text-neutral-900">Donor Dashboard</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Direct hospital escrow crowdfunding for medically verified patients across Chennai.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">My Total Contributions</span>
              <p className="cf-financial-number text-2xl text-neutral-900 mt-1">
                {formatINR(totalMyDonations || 75000)}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">100% credited to hospital escrow</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">Verified Treatments</span>
              <p className="cf-financial-number text-2xl text-neutral-900 mt-1">
                {formatINR(totalVerifiedCost)}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Accredited hospital estimates</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">Direct Escrow Raised</span>
              <p className="cf-financial-number text-2xl text-emerald-700 mt-1">
                {formatINR(totalRaised)}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">Direct hospital escrow deposits</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-red-600 font-medium">Remaining Urgent Gap</span>
              <p className="cf-financial-number text-2xl text-red-700 mt-1">
                {formatINR(totalStillNeeded)}
              </p>
              <p className="text-[11px] text-red-600 mt-1">Urgent surgeries awaiting support</p>
            </div>
          </div>

          {/* Featured Urgent Case */}
          {featuredCase && (
            <section className="cf-card border-red-200 bg-linear-to-b from-white to-red-50/20">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="cf-card-heading text-red-700 text-sm font-semibold uppercase tracking-wider">
                    Featured Verified Case in Chennai
                  </span>
                </div>
                <StatusBadge status={featuredCase.status} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <span className="text-xs text-neutral-500 font-mono">{featuredCase.id}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-0.5">
                      {featuredCase.patientName}, {featuredCase.patientAge || featuredCase.age}y
                    </h2>
                    <p className="text-base text-neutral-700 font-medium mt-1">
                      {featuredCase.treatment}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 mt-1.5">
                      <Building2 className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span>{featuredCase.hospital}</span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                    {featuredCase.patientStory || featuredCase.diagnosisSummary || featuredCase.summary}
                  </p>

                  {/* 3-Number financial breakdown */}
                  <div className="grid grid-cols-3 gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div>
                      <span className="text-[11px] text-neutral-500 font-medium block">Total Cost</span>
                      <span className="text-sm sm:text-base font-bold text-neutral-900">
                        {formatINR(featuredCase.totalTreatmentCost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-700 font-medium block">Hospital Escrow</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-700">
                        {formatINR(featuredCase.alreadyRaised)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-600 font-medium block">Still Needed</span>
                      <span className="text-sm sm:text-base font-bold text-red-700">
                        {formatINR(featuredCase.stillNeeded)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-4 bg-white rounded-xl border border-neutral-200 space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-neutral-700 block">4-Step Review Verified</span>
                    <div className="p-2.5 bg-neutral-50 rounded-lg text-xs space-y-1.5 border border-neutral-200">
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Documents & hospital estimate submitted</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI check completed (no discrepancies)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reviewed by Apollo Medical Social Worker</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Authorized Human Approval</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDonateCase(featuredCase)}
                      className="w-full cf-btn-primary justify-center cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Donate to Hospital Escrow</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCase(featuredCase)}
                      className="w-full cf-btn-secondary justify-center text-xs cursor-pointer"
                    >
                      <span>View 4-Step Verification Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Quick Verified Cases Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="cf-section-heading text-neutral-900">Urgent Verified Cases</h3>
                <p className="cf-secondary text-xs text-neutral-500">
                  Every rupee is settled directly to hospital accounts for verified treatments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('cases')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Cases</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cases.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="cf-card p-5 flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-500">{item.id}</span>
                      <StatusBadge status={item.status} />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {item.patientName}, {item.patientAge || item.age}y
                      </h4>
                      <p className="text-xs font-medium text-neutral-700 mt-0.5 line-clamp-1">
                        {item.treatment}
                      </p>
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{item.hospital}</span>
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-neutral-600">
                          {formatINR(item.alreadyRaised)} raised
                        </span>
                        <span className="text-red-700 font-bold">
                          {formatINR(item.stillNeeded)} needed
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((item.alreadyRaised / (item.verifiedFundingGap || 1)) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setDonateCase(item)}
                      className="flex-1 cf-btn-primary text-xs py-2 justify-center cursor-pointer"
                    >
                      Donate
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCase(item)}
                      className="cf-btn-secondary text-xs py-2 px-3 cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: BROWSE VERIFIED CASES                                      */}
      {/* ============================================================== */}
      {activeTab === 'cases' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Browse Verified Cases</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Select a medically verified case to review documentation and donate directly to hospital escrow.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="cf-card p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by patient, treatment, hospital or case ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cf-input pl-9 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="cf-card p-5 flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-500">{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      {c.patientName}, {c.patientAge || c.age}y
                    </h3>
                    <p className="text-xs font-medium text-neutral-700 mt-0.5 line-clamp-1">
                      {c.treatment}
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{c.hospital}</span>
                    </p>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {c.patientStory || c.diagnosisSummary || c.summary}
                  </p>

                  {/* Web Verification Badge & Files Uploaded Confirmation */}
                  {(c.status === 'Hospital Verified' || c.status === 'Approved' || c.documentChecks.some((d) => d.status === 'Verified')) && (
                    <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-[11px] text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {c.status === 'Approved'
                              ? 'Verified by Hospital & Reviewer'
                              : 'Hospital Verified · Files on Web'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-700">
                          Web Verified
                        </span>
                      </div>
                      <p className="text-[10.5px] text-emerald-700 leading-tight">
                        {c.documentChecks.filter((d) => d.status === 'Verified').length} official files verified after upload to web from hospital & reviewer
                      </p>
                    </div>
                  )}

                  {/* Financial calculation numbers */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-neutral-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Verified Gap</span>
                      <span className="font-bold text-neutral-900">
                        {formatINR(c.verifiedFundingGap)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-600 block">Still Needed</span>
                      <span className="font-bold text-red-700">
                        {formatINR(c.stillNeeded)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((c.alreadyRaised / (c.verifiedFundingGap || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>{formatINR(c.alreadyRaised)} raised</span>
                      <span>
                        {Math.round((c.alreadyRaised / (c.verifiedFundingGap || 1)) * 100)}% funded
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setDonateCase(c)}
                    className="flex-1 cf-btn-primary text-xs py-2 justify-center cursor-pointer"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Donate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCase(c)}
                    className="cf-btn-secondary text-xs py-2 px-3 cursor-pointer"
                  >
                    <span>View 4-Step Case</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: MY DONATIONS                                              */}
      {/* ============================================================== */}
      {activeTab === 'my-donations' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="cf-title text-neutral-900">My Donations</h1>
              <p className="cf-body text-neutral-600 mt-1">
                Your direct hospital escrow contributions with verified tax exemption receipts.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% 80G Tax Exemption Certified</span>
            </div>
          </div>

          {downloadSuccessReceipt && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Tax receipt for {downloadSuccessReceipt} downloaded successfully! Section 80G compliant.
              </span>
            </div>
          )}

          <div className="cf-card overflow-hidden">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="cf-card-heading text-neutral-900">Contribution Ledger</h3>
              <span className="text-xs text-neutral-500 font-mono">
                PAN Registered: {panNumber}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                    <th className="py-3 px-4 font-semibold">Receipt #</th>
                    <th className="py-3 px-4 font-semibold">Patient & Treatment</th>
                    <th className="py-3 px-4 font-semibold">Hospital Escrow Recipient</th>
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold text-right">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-center">80G Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {donations.map((d) => (
                    <tr key={d.receiptId} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-neutral-900">
                        {d.receiptId}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-neutral-900">{d.patientName}</p>
                        <p className="text-[11px] text-neutral-500 font-mono">{d.caseId}</p>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">
                        <p className="font-medium">{d.hospitalRecipient}</p>
                        <p className="text-[11px] text-neutral-500">{d.paymentMethod}</p>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 whitespace-nowrap">
                        {d.timestamp}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900 text-sm">
                        {formatINR(d.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{d.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadTaxReceipt(d.receiptId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-neutral-500" />
                          <span>80G PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DONATION TRACKING                                         */}
      {/* ============================================================== */}
      {activeTab === 'tracking' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Donation Tracking</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Real-time audit trail of how your funds move directly into verified hospital care.
            </p>
          </div>

          {/* 4-Stage Escrow Lifecycle */}
          <div className="cf-card p-6 space-y-6">
            <h3 className="cf-card-heading text-neutral-900">Hospital Escrow Fund Flow</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Donor Payment</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Donor initiates UPI or Net Banking. Funds enter CareFund's designated Axis Bank escrow.
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded">
                  Completed · 100% Settled
                </span>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Hospital Escrow Ring-fencing</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Funds allocated strictly to patient's hospital ledger account (Apollo / MIOT / Cancer Inst).
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded">
                  Completed · Zero Diversion
                </span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="text-sm font-bold text-amber-900">Milestone Release</h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Released only upon verified admission and operating room confirmation by hospital liaison.
                </p>
                <span className="inline-block text-[10px] font-semibold text-amber-800 bg-white/80 px-2 py-0.5 rounded">
                  Active Surveillance
                </span>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-full bg-neutral-400 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Post-Discharge Audit</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Final itemized hospital bill reconciled. Unused funds refunded to CareFund emergency pool.
                </p>
                <span className="inline-block text-[10px] font-semibold text-neutral-600 bg-white/80 px-2 py-0.5 rounded">
                  Pending Discharge
                </span>
              </div>
            </div>
          </div>

          {/* Active Case Escrow Tracker */}
          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Active Patient Escrows Under Your Support</h3>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral-500">CF-CHN-2026-00124</span>
                  <StatusBadge status="Hospital Verified" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 mt-1">
                  Kavitha R., 34y · Left Ventricular Assist Device (LVAD) Surgery
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Apollo Hospitals, Greams Road · Nodal Escrow A/C #92102008391823
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-500 block">Your Contribution</span>
                <span className="text-lg font-bold text-emerald-700">₹25,000</span>
                <p className="text-[11px] text-neutral-500">Credited on 08 Oct 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: IMPACT / DONATION HISTORY                                 */}
      {/* ============================================================== */}
      {activeTab === 'impact' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Impact & Clinical Milestones</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Verified clinical outcomes and patient recovery updates enabled by your donations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="cf-card p-5 space-y-2">
              <span className="text-xs font-semibold text-neutral-500">Patients Supported</span>
              <p className="text-3xl font-extrabold text-neutral-900">12</p>
              <p className="text-xs text-neutral-600">Across 4 accredited hospitals in Tamil Nadu</p>
            </div>
            <div className="cf-card p-5 space-y-2">
              <span className="text-xs font-semibold text-neutral-500">Surgeries Completed</span>
              <p className="text-3xl font-extrabold text-emerald-700">9</p>
              <p className="text-xs text-emerald-600">Post-operative discharge reports verified</p>
            </div>
            <div className="cf-card p-5 space-y-2">
              <span className="text-xs font-semibold text-neutral-500">Direct Escrow Settlement</span>
              <p className="text-3xl font-extrabold text-red-600">100%</p>
              <p className="text-xs text-neutral-600">0% cash handed to individuals or third parties</p>
            </div>
          </div>

          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Recent Medical Recovery Updates</h3>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">Master Aarav M. (Pediatric Cardiac Repair)</span>
                  <span className="text-neutral-500">Institute of Child Health (ICH), Egmore</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Surgery successfully performed on 06 Oct 2026. Patient was discharged from pediatric ICU to step-down ward in stable condition. Final hospital invoice reconciled against CareFund escrow.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">Saravanan K. (Polytrauma Reconstruction)</span>
                  <span className="text-neutral-500">MIOT International, Manapakkam</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Orthopedic reconstruction completed on 29 Sep 2026. Physiotherapy ongoing. 100% of hospital charges cleared directly from CareFund escrow account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: NOTIFICATIONS                                             */}
      {/* ============================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Notifications</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Updates on cases you supported, hospital escrow transfers, and tax receipts.
            </p>
          </div>

          <div className="cf-card divide-y divide-neutral-100">
            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  Escrow Deposit Confirmed: ₹25,000 for Kavitha R.
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Your donation was credited directly to Apollo Hospitals Greams Road Escrow Account.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">08 Oct 2026, 11:20 AM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700 mt-0.5">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  80G Tax Exemption Certificate Generated
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Receipt #CF-RCP-2026-8812 is available for download in your My Donations ledger.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">08 Oct 2026, 10:15 AM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  Clinical Milestone: Master Aarav Discharged from ICU
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Institute of Child Health reported full recovery following ventricular septal surgery.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">07 Oct 2026, 05:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PROFILE & PRIVACY SETTINGS                                */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="cf-title text-neutral-900">Donor Profile & Privacy Settings</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Manage your tax exemption identification, receipt delivery, and privacy preferences.
            </p>
          </div>

          {saveProfileSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile and privacy settings saved successfully.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="cf-card p-6 space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Personal & Tax Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="cf-label block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Karthik Ramanathan"
                    className="cf-input text-sm"
                  />
                </div>
                <div>
                  <label className="cf-label block mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue="karthik.r@chennaidonors.org"
                    className="cf-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="cf-label block mb-1">Permanent Account Number (PAN for 80G)</label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="cf-input text-sm font-mono"
                  placeholder="ABCDE1234F"
                />
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Mandatory under Indian Income Tax Act for Section 80G tax benefit claim.
                </span>
              </div>
            </div>

            <div className="cf-card p-6 space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Privacy & Transparency Controls</h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Anonymize my donations on public donor ledger
                    </span>
                    <span className="text-xs text-neutral-500">
                      Displays as "Anonymous Donor" on public case feeds while retaining verified hospital receipt records.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReceipts}
                    onChange={(e) => setEmailReceipts(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Email 80G tax exemption receipt automatically after payment
                    </span>
                    <span className="text-xs text-neutral-500">
                      Sent within 5 minutes of hospital escrow bank confirmation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsMilestones}
                    onChange={(e) => setSmsMilestones(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Receive milestone SMS updates (Surgery completed / Hospital discharge)
                    </span>
                    <span className="text-xs text-neutral-500">
                      Updates verified directly by hospital social work desks.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="cf-btn-primary cursor-pointer">
              <span>Save Privacy Preferences</span>
            </button>
          </form>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          medicalCase={selectedCase}
          onClose={() => setSelectedCase(null)}
          onDonateClick={() => {
            const c = selectedCase;
            setSelectedCase(null);
            setDonateCase(c);
          }}
          onUpdateCase={onUpdateCase}
        />
      )}

      {/* Donate Modal */}
      {donateCase && (
        <DonateModal
          medicalCase={donateCase}
          onClose={() => setDonateCase(null)}
          onDonateSuccess={onDonateSuccess}
        />
      )}
    </div>
  );
};
