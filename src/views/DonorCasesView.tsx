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
  Sparkles,
} from 'lucide-react';

interface DonorCasesViewProps {
  cases: MedicalCase[];
  onDonateSuccess: (donation: DonationRecord) => void;
  onRequestAssistanceClick: () => void;
  onUpdateCase?: (updatedCase: MedicalCase) => void;
}

export const DonorCasesView: React.FC<DonorCasesViewProps> = ({
  cases,
  onDonateSuccess,
  onRequestAssistanceClick,
  onUpdateCase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCase, setSelectedCase] = useState<MedicalCase | null>(null);
  const [donateCase, setDonateCase] = useState<MedicalCase | null>(null);

  const categories = ['All', 'Cardiac', 'Pediatric', 'Trauma & Ortho', 'Transplant'];

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

  // Focus on flagship case CF-CHN-2026-00124
  const featuredCase = cases.find((c) => c.id === 'CF-CHN-2026-00124') || cases[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-semibold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Hospital Escrow Verified Crowdfunding</span>
              </div>
              <h1 className="cf-title text-neutral-900 tracking-tight">
                Support Verified Medical Care in Chennai
              </h1>
              <p className="cf-body text-neutral-600 mt-3 text-base sm:text-lg max-w-2xl leading-relaxed">
                Every rupee is verified directly with accredited hospitals and ring-fenced for approved surgeries and treatments. Zero cash handed to intermediaries.
              </p>
            </div>

            {/* Quick 3-part platform metrics (Rule 5) */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
              <div>
                <p className="cf-secondary text-xs text-neutral-500 font-medium">Verified Treatments</p>
                <p className="cf-financial-number text-lg sm:text-2xl text-neutral-900 mt-0.5">
                  {formatINR(totalVerifiedCost)}
                </p>
                <p className="cf-secondary text-[11px] text-neutral-500 mt-0.5">Accredited hospital estimates</p>
              </div>

              <div>
                <p className="cf-secondary text-xs text-neutral-500 font-medium">Direct Escrow Raised</p>
                <p className="cf-financial-number text-lg sm:text-2xl text-neutral-900 mt-0.5">
                  {formatINR(totalRaised)}
                </p>
                <p className="cf-secondary text-[11px] text-neutral-500 mt-0.5">Credited to hospital A/C</p>
              </div>

              <div>
                <p className="cf-secondary text-xs text-red-600 font-medium">Amount Still Needed</p>
                <p className="cf-financial-number text-lg sm:text-2xl text-red-700 mt-0.5">
                  {formatINR(totalStillNeeded)}
                </p>
                <p className="cf-secondary text-[11px] text-red-600/90 mt-0.5">Remaining urgent gap</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById('browse-cases');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="cf-btn-primary"
              >
                <HeartHandshake className="w-4 h-4" />
                Browse Verified Cases
              </button>
              <button
                type="button"
                onClick={onRequestAssistanceClick}
                className="cf-btn-secondary"
              >
                Submit Assistance Request
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-neutral-100">
            <img
              src="/src/assets/images/hero_medical_carefund_1791485592434.jpg"
              alt="Medical consultation at verified hospital in Chennai"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
              <p className="font-semibold text-sm">Direct Clinical Oversight</p>
              <p className="text-xs text-white/80">Apollo Hospitals & Cancer Institute (WIA), Chennai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Urgent Case Card (CF-CHN-2026-00124) */}
      {featuredCase && (
        <section className="cf-card border-red-200 bg-linear-to-b from-white to-red-50/20">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="cf-card-heading text-red-700 text-sm font-semibold uppercase tracking-wider">
                Featured Urgent Case in Chennai
              </span>
            </div>
            <StatusBadge status={featuredCase.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono mb-1">
                  <span>Case ID: <strong>{featuredCase.id}</strong></span>
                  <span>·</span>
                  <span>{featuredCase.city}</span>
                </div>
                <h2 className="cf-section-heading text-neutral-900">
                  {featuredCase.treatment} for {featuredCase.patientName}
                </h2>
                <p className="cf-body text-neutral-600 mt-2 leading-relaxed">
                  {featuredCase.diagnosisSummary} {featuredCase.patientStory}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white p-3 rounded-lg border border-neutral-200">
                <Building2 className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>
                  <strong>Designated Hospital:</strong> {featuredCase.hospital} ({featuredCase.hospitalAddress})
                </span>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="p-4 bg-white rounded-xl border border-neutral-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="cf-secondary text-xs">Total Treatment Cost</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {formatINR(featuredCase.totalTreatmentCost)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="cf-secondary text-xs">Confirmed Aid & Savings</span>
                  <span className="tabular-nums text-neutral-700">
                    − {formatINR(
                      featuredCase.insuranceConfirmed +
                        featuredCase.governmentSupportConfirmed +
                        featuredCase.hospitalAssistance +
                        featuredCase.familyContribution +
                        featuredCase.existingDonations
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-100">
                  <span className="cf-secondary text-xs text-neutral-700 font-medium">Already Raised</span>
                  <span className="font-semibold text-neutral-900 tabular-nums">
                    {formatINR(featuredCase.alreadyRaised)}
                  </span>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="cf-secondary text-xs text-red-700 font-medium block">
                    Amount Still Needed
                  </span>
                  <span className="cf-financial-number text-2xl text-red-700 mt-0.5 block">
                    {formatINR(featuredCase.stillNeeded)}
                  </span>
                  <span className="cf-secondary text-[11px] text-red-600 mt-1 block">
                    Remaining amount required after confirmed support.
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(featuredCase)}
                  className="cf-btn-secondary flex-1 text-xs"
                >
                  View Case
                </button>
                <button
                  type="button"
                  onClick={() => setDonateCase(featuredCase)}
                  className="cf-btn-primary flex-1 text-xs"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rule 7: Every Screen Must Explain Itself */}
      <section className="cf-card bg-neutral-50/80 border-neutral-200">
        <h3 className="cf-card-heading text-neutral-900 text-sm font-semibold uppercase tracking-wider mb-3">
          How Giving Works on CareFund
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What is this?
            </span>
            <p className="font-semibold text-neutral-900">Verified Medical Cases</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Accredited hospital patient cases in Chennai undergoing urgent clinical treatments.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              Why does it matter?
            </span>
            <p className="font-semibold text-neutral-900">Direct Hospital Escrow</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              100% of donations settle verified hospital bills. Zero cash is handed to intermediaries.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What do I need to do?
            </span>
            <p className="font-semibold text-neutral-900">Choose a Case to Support</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Review the transparent funding gap breakdown and contribute using UPI or Net Banking.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What happens next?
            </span>
            <p className="font-semibold text-neutral-900">80G Receipt & Settlement</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              You receive a formal tax receipt and funds are reconciled with final hospital discharge bills.
            </p>
          </div>
        </div>
      </section>

      {/* Case Directory Section */}
      <section id="browse-cases" className="space-y-6 pt-2">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="cf-section-heading text-neutral-900">Browse Verified Medical Cases</h2>
            <p className="cf-body text-neutral-600 mt-1">
              Select an approved case to inspect verified hospital estimates, clinical checks, and direct escrow details.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ID, hospital, treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="cf-secondary text-xs text-neutral-500 ml-auto whitespace-nowrap hidden sm:inline">
            Showing {filteredCases.length} verified cases
          </span>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => {
            const isFullyFunded = caseItem.stillNeeded <= 0;

            return (
              <div
                key={caseItem.id}
                className="cf-card flex flex-col justify-between hover:border-neutral-300 transition-all group"
              >
                <div>
                  {/* Card Header: Case ID and Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                      {caseItem.id}
                    </span>
                    <StatusBadge status={caseItem.status} size="sm" />
                  </div>

                  {/* Treatment & Hospital */}
                  <div className="mt-4 space-y-1">
                    <h3 className="cf-card-heading text-neutral-900 group-hover:text-red-700 transition-colors">
                      {caseItem.treatment}
                    </h3>
                    <p className="cf-secondary text-xs flex items-center gap-1.5 text-neutral-600">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{caseItem.hospital}</span>
                    </p>
                  </div>

                  {/* Diagnosis summary */}
                  <p className="cf-body text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
                    {caseItem.diagnosisSummary}
                  </p>

                  {/* Financial Metrics in 3-part style */}
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="cf-secondary text-neutral-500">Total Treatment Cost</span>
                      <span className="font-semibold text-neutral-800 tabular-nums">
                        {formatINR(caseItem.totalTreatmentCost)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="cf-secondary text-neutral-500">Already Raised</span>
                      <span className="tabular-nums text-neutral-800">
                        {formatINR(caseItem.alreadyRaised)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-center">
                      <span className="font-medium text-red-700">Amount Still Needed</span>
                      <span className="cf-financial-number text-base text-red-700">
                        {formatINR(caseItem.stillNeeded)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCase(caseItem)}
                    className="cf-btn-secondary flex-1 h-10 text-xs"
                  >
                    View Case
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonateCase(caseItem)}
                    disabled={isFullyFunded}
                    className="cf-btn-primary flex-1 h-10 text-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    {isFullyFunded ? 'Fully Funded' : 'Donate Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="cf-card text-center py-12">
            <p className="cf-card-heading text-neutral-800 mb-1">No verified cases match your search</p>
            <p className="cf-secondary text-sm">Try clearing your search query or selecting a different medical category.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="cf-btn-secondary mt-4 text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          onDonateSuccess={onDonateSuccess}
          onUpdateCase={onUpdateCase}
        />
      )}

      {/* Direct Donate Modal */}
      {donateCase && (
        <DonateModal
          caseItem={donateCase}
          isOpen={!!donateCase}
          onClose={() => setDonateCase(null)}
          onDonateSuccess={(rec) => {
            onDonateSuccess(rec);
            setDonateCase(null);
          }}
        />
      )}
    </div>
  );
};
