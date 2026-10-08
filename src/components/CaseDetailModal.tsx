import React, { useState } from 'react';
import { MedicalCase, DonationRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { StatusBadge } from './StatusBadge';
import { FinancialBreakdownCard } from './FinancialBreakdownCard';
import { VerificationTimeline } from './VerificationTimeline';
import { WhoVerifiedCard } from './WhoVerifiedCard';
import { WhereMoneyGoesCard } from './WhereMoneyGoesCard';
import { PrivacyNoticeCard } from './PrivacyNoticeCard';
import { DecisionStatusTrio } from './DecisionStatusTrio';
import { HumanDecisionControl } from './HumanDecisionControl';
import { DonateModal } from './DonateModal';
import {
  X,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Heart,
  Share2,
} from 'lucide-react';

interface CaseDetailModalProps {
  caseItem?: MedicalCase;
  medicalCase?: MedicalCase;
  isOpen?: boolean;
  onClose: () => void;
  onDonateClick?: () => void;
  onDonateSuccess?: (donation: DonationRecord) => void;
  onUpdateCase?: (updatedCase: MedicalCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseItem: propCaseItem,
  medicalCase: propMedicalCase,
  isOpen = true,
  onClose,
  onDonateClick,
  onDonateSuccess = () => {},
  onUpdateCase,
}) => {
  const caseItem = propCaseItem || propMedicalCase;
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'verification' | 'documents' | 'decision'>('overview');

  if (!isOpen || !caseItem) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
          {/* Top Sticky Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded text-neutral-800">
                {caseItem.id}
              </span>
              <span className="text-sm font-semibold text-neutral-900 truncate">
                {caseItem.treatment}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Case link copied to clipboard.');
                }}
                className="cf-btn-secondary h-9 px-3 text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Rule 7: Clear Summary at the Top */}
            <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
              <h2 className="cf-card-heading text-neutral-900 text-lg mb-3">Case Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Case ID */}
                <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <span className="cf-secondary text-xs text-neutral-500 block mb-0.5">Case ID</span>
                  <span className="font-mono font-bold text-xs text-neutral-900">{caseItem.id}</span>
                </div>

                {/* Treatment */}
                <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <span className="cf-secondary text-xs text-neutral-500 block mb-0.5">Treatment</span>
                  <span className="font-semibold text-xs text-neutral-900 truncate block" title={caseItem.treatment}>
                    {caseItem.treatment}
                  </span>
                </div>

                {/* Hospital */}
                <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <span className="cf-secondary text-xs text-neutral-500 block mb-0.5">Hospital</span>
                  <span className="font-semibold text-xs text-neutral-900 truncate block" title={caseItem.hospital}>
                    {caseItem.hospital}
                  </span>
                </div>

                {/* Verified Treatment Cost */}
                <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                  <span className="cf-secondary text-xs text-neutral-500 block mb-0.5">Verified Cost</span>
                  <span className="font-bold text-xs text-neutral-900 tabular-nums">
                    {formatINR(caseItem.totalTreatmentCost)}
                  </span>
                </div>

                {/* Amount Still Needed */}
                <div className="p-2.5 bg-red-50/80 rounded-lg border border-red-200">
                  <span className="cf-secondary text-xs text-red-600 block mb-0.5">Still Needed</span>
                  <span className="font-bold text-xs text-red-700 tabular-nums">
                    {formatINR(caseItem.stillNeeded)}
                  </span>
                </div>

                {/* Verification Status */}
                <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex flex-col justify-center">
                  <span className="cf-secondary text-[11px] text-neutral-500 block mb-0.5">Status</span>
                  <StatusBadge status={caseItem.status} size="sm" />
                </div>
              </div>

              {/* Rule 13: Decision Status Trio (AI Screening | Human Review | Final Decision) */}
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <DecisionStatusTrio
                  aiScreening={caseItem.aiScreeningState}
                  humanReview={caseItem.humanReviewState}
                  finalDecision={caseItem.finalDecisionState}
                />
              </div>
            </div>

            {/* Navigation Tabs Inside Case */}
            <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Overview & Story
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('financials')}
                className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'financials'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Financial Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'verification'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                4-Step Review System
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'documents'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Document Check ({caseItem.documentChecks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('decision' as any)}
                className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === ('decision' as any)
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Human Decision Control
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Story Card */}
                  <div className="cf-card">
                    <h3 className="cf-card-heading text-neutral-900 mb-2">Patient Diagnosis & Situation</h3>
                    <p className="cf-body text-neutral-700 leading-relaxed mb-4">
                      {caseItem.diagnosisSummary}
                    </p>
                    <p className="cf-body text-neutral-600 leading-relaxed">
                      {caseItem.patientStory}
                    </p>

                    <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span>Age: {caseItem.patientAge} years ({caseItem.patientGender})</span>
                      <span>Location: {caseItem.city}</span>
                      <span>Hospital Partner: {caseItem.hospital}</span>
                    </div>
                  </div>

                  {/* Where money goes */}
                  <WhereMoneyGoesCard hospitalName={caseItem.hospital} />
                </div>

                <div className="space-y-6">
                  {/* Who Verified This */}
                  <WhoVerifiedCard
                    verifiedByTitle={caseItem.verifiedByTitle}
                    verifierName={caseItem.verifierName}
                    verificationDate={caseItem.verificationDate}
                    verificationReference={caseItem.verificationReference}
                    hospital={caseItem.hospital}
                  />

                  {/* Privacy Notice */}
                  <PrivacyNoticeCard />
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <FinancialBreakdownCard
                    totalTreatmentCost={caseItem.totalTreatmentCost}
                    insuranceConfirmed={caseItem.insuranceConfirmed}
                    governmentSupportConfirmed={caseItem.governmentSupportConfirmed}
                    hospitalAssistance={caseItem.hospitalAssistance}
                    familyContribution={caseItem.familyContribution}
                    existingDonations={caseItem.existingDonations}
                    alreadyRaised={caseItem.alreadyRaised}
                  />
                </div>
                <div className="space-y-4">
                  {/* Final Fund Check info card (Rule 4) */}
                  <div className="cf-card bg-neutral-50">
                    <h4 className="cf-card-heading text-neutral-900 mb-1">Final Fund Check</h4>
                    <p className="cf-secondary text-xs mb-3">
                      We compare the amount received with the verified medical expenses before direct settlement.
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-white rounded border border-neutral-200">
                        <span className="text-neutral-500 block">Designated Hospital Escrow</span>
                        <span className="font-semibold text-neutral-800">{caseItem.hospitalAccountReference}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded border border-neutral-200">
                        <span className="text-neutral-500 block">Settlement Mechanism</span>
                        <span className="font-semibold text-neutral-800">Direct RTGS/NEFT to Hospital</span>
                      </div>
                      <div className="p-2.5 bg-white rounded border border-neutral-200">
                        <span className="text-neutral-500 block">Cash Payout to Patient</span>
                        <span className="font-semibold text-emerald-700">₹0 (Strict zero cash policy)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <VerificationTimeline timeline={caseItem.timeline} />
                </div>
                <div className="space-y-4">
                  <WhoVerifiedCard
                    verifiedByTitle={caseItem.verifiedByTitle}
                    verifierName={caseItem.verifierName}
                    verificationDate={caseItem.verificationDate}
                    verificationReference={caseItem.verificationReference}
                    hospital={caseItem.hospital}
                  />
                  <div className="cf-card bg-neutral-50">
                    <h4 className="cf-card-heading text-neutral-900 mb-1">AI Screening Policy</h4>
                    <p className="cf-secondary text-xs leading-relaxed">
                      <strong>AI assists. Humans decide.</strong> CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="cf-card">
                  <div className="border-b border-neutral-100 pb-3 mb-4">
                    <h3 className="cf-card-heading text-neutral-900">Document Check</h3>
                    <p className="cf-secondary mt-0.5">
                      We checked the document for completeness and consistency. Clinical documents are verified directly with the hospital administration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {caseItem.documentChecks.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded bg-white border border-neutral-300 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-neutral-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 text-sm">{doc.name}</p>
                            <p className="cf-secondary text-xs text-neutral-600 mt-0.5">{doc.note}</p>
                          </div>
                        </div>

                        <span
                          className={`cf-status-text text-xs px-2.5 py-1 rounded border shrink-0 ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 p-3 rounded-lg bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
                    <span>
                      Original scanned diagnostic files are archived safely in the hospital desk repository to protect patient confidentiality.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'decision' && (
              <HumanDecisionControl
                caseItem={caseItem}
                onDecisionSubmit={(dec, updated) => {
                  if (onUpdateCase) {
                    onUpdateCase(updated);
                  }
                }}
              />
            )}
          </div>

          {/* Modal Sticky Bottom Action Bar */}
          <div className="p-4 px-6 border-t border-neutral-200 bg-white flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10">
            <div>
              <p className="cf-secondary text-xs text-neutral-500">Amount Still Needed</p>
              <p className="cf-financial-number text-xl text-red-600">
                {formatINR(caseItem.stillNeeded)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="cf-btn-secondary"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={() => setShowDonateModal(true)}
                disabled={caseItem.stillNeeded <= 0}
                className="cf-btn-primary"
              >
                <Heart className="w-4 h-4 fill-white" />
                {caseItem.stillNeeded <= 0 ? 'Fully Funded' : 'Donate Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      <DonateModal
        caseItem={caseItem}
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        onDonateSuccess={(rec: DonationRecord) => {
          onDonateSuccess(rec);
          setShowDonateModal(false);
        }}
      />
    </>
  );
};
