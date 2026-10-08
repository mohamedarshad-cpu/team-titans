import React, { useState } from 'react';
import { MedicalCase, DonationRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { InfoBlock } from '../components/InfoBlock';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { HumanDecisionControl } from '../components/HumanDecisionControl';
import { DecisionStatusTrio } from '../components/DecisionStatusTrio';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Scale,
  ClipboardList,
  UserCheck,
  Check,
  Send,
  HelpCircle,
} from 'lucide-react';

interface AdminAuditViewProps {
  cases: MedicalCase[];
  donations: DonationRecord[];
  onUpdateCase: (updatedCase: MedicalCase) => void;
  onDonateSuccess: (donation: DonationRecord) => void;
}

export const AdminAuditView: React.FC<AdminAuditViewProps> = ({
  cases,
  donations,
  onUpdateCase,
  onDonateSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'inconsistencies' | 'reconciliation' | 'audit'>('queue');
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<MedicalCase | null>(null);
  const [decidingCase, setDecidingCase] = useState<MedicalCase | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Key metrics as specified in Rule 21
  const totalActiveCases = cases.length;
  const casesUnderReview = cases.filter(
    (c) =>
      c.status === 'Verification in Progress' ||
      c.status === 'Human Review Required' ||
      c.status === 'AI Screening Completed' ||
      c.status === 'Requires More Information'
  ).length;
  const verifiedCasesCount = cases.filter(
    (c) => c.status === 'Hospital Verified' || c.status === 'Approved'
  ).length;
  const totalFundingGaps = cases.reduce((acc, c) => acc + c.verifiedFundingGap, 0);
  const totalDonations = donations.reduce((acc, d) => acc + d.amount, 0);
  const inconsistentCases = cases.filter((c) => c.hasInconsistency && !c.isResolved);

  const handleDecisionComplete = (dec: any, updated: MedicalCase) => {
    onUpdateCase(updated);
    setFeedbackMessage(
      `Human decision "${dec.decision}" recorded for Case ${updated.id} by ${dec.decidedBy}.`
    );
    setDecidingCase(null);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Standard Page Structure: Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="cf-title text-neutral-900">Reviewer & Audit Dashboard</h1>
          <p className="cf-body text-neutral-600 mt-2">
            Clinical review, inconsistency governance, and final hospital escrow fund reconciliation.
          </p>
        </div>
        <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200 text-xs text-neutral-700">
          <span className="font-semibold block text-neutral-900">AI assists. Humans decide.</span>
          CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers.
        </div>
      </div>

      <TrustMessageBanner />

      {/* Rule 7: Every Screen Must Explain Itself */}
      <section className="cf-card bg-neutral-50/80 border-neutral-200">
        <h3 className="cf-card-heading text-neutral-900 text-sm font-semibold uppercase tracking-wider mb-3">
          Clinical Review & Decision Control Workflow
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What is this?
            </span>
            <p className="font-semibold text-neutral-900">Authorized Audit Console</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Review queue for clinical supervisors to examine hospital documents and resolve variances.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              Why does it matter?
            </span>
            <p className="font-semibold text-neutral-900">Human Decision Governance</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              AI flags missing dates or catalog variances; only human officers have authority to approve or reject.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What do I need to do?
            </span>
            <p className="font-semibold text-neutral-900">Review Information & Decide</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Inspect AI checked findings, check hospital estimate codes, and choose your binding decision.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What happens next?
            </span>
            <p className="font-semibold text-neutral-900">Audit Trail Logging</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Your decision, role, and reasoning are permanently logged and verified funding opens.
            </p>
          </div>
        </div>
      </section>

      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-xs text-emerald-700 underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Rule 21: High-Level Metrics (Title, Value, Short Explanation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBlock
          title="Total Active Cases"
          value={totalActiveCases}
          explanation="Cases currently registered in the Chennai healthcare network."
        />
        <InfoBlock
          title="Cases Under Review"
          value={casesUnderReview}
          explanation="Cases waiting for additional verification or hospital sign-off."
          highlight={casesUnderReview > 0}
        />
        <InfoBlock
          title="Verified Cases"
          value={verifiedCasesCount}
          explanation="Cases with confirmed hospital estimates open for funding."
        />
        <InfoBlock
          title="Potential Inconsistencies"
          value={inconsistentCases.length}
          explanation="Cases flagged for document variance requiring human review."
          highlight={inconsistentCases.length > 0}
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'queue'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Verification Queue ({cases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inconsistencies')}
          className={`pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'inconsistencies'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Potential Inconsistencies ({inconsistentCases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'reconciliation'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Final Fund Check & Reconciliation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'audit'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Audit Ledger & Logs
        </button>
      </div>

      {/* Tab 1: Verification Review Queue */}
      {activeTab === 'queue' && (
        <section className="cf-card space-y-4">
          <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="cf-section-heading text-neutral-900 text-lg">Case Verification Queue</h2>
              <p className="cf-secondary mt-0.5">
                Review document check outputs, clinical estimate accuracy, and approve verified funding gaps.
              </p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {cases.map((c) => (
              <div
                key={c.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                      {c.id}
                    </span>
                    <span className="font-semibold text-neutral-900 text-sm">
                      {c.patientName} ({c.treatment})
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <p className="cf-secondary text-xs text-neutral-600">
                    Hospital: <strong>{c.hospital}</strong> · Ref: {c.verificationReference}
                  </p>
                  <p className="cf-secondary text-xs text-neutral-500">
                    Verified Gap: {formatINR(c.verifiedFundingGap)} · Still Needed: {formatINR(c.stillNeeded)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseForDetail(c)}
                    className="cf-btn-secondary h-9 px-3 text-xs"
                  >
                    View Case
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecidingCase(c)}
                    className="cf-btn-primary h-9 px-3 text-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Review & Decide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Potential Inconsistencies (Rule 22) */}
      {activeTab === 'inconsistencies' && (
        <section className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="cf-card-heading text-amber-900 text-base">
                Respectful Inconsistency Governance
              </h3>
            </div>
            <p className="cf-secondary text-amber-800 text-xs leading-relaxed">
              CareFund never automatically assumes fraud or dishonesty. Automated document checks highlight variances (such as pharmacy estimate mismatches, estimate expiration, or similar case numbers) for trained human clinicians to review and reconcile.
            </p>
          </div>

          {inconsistentCases.length > 0 ? (
            <div className="space-y-4">
              {inconsistentCases.map((c) => (
                <div key={c.id} className="cf-card border-amber-200 bg-white space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                        {c.id}
                      </span>
                      <h4 className="cf-card-heading text-neutral-900">{c.patientName} · {c.treatment}</h4>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>

                  {/* Rule 22: Structure */}
                  <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2 text-xs">
                    <p className="font-semibold text-neutral-900 text-sm">
                      {c.inconsistencyTitle || 'Potential Inconsistency'}
                    </p>
                    <p className="text-neutral-700">
                      "Some information does not match and requires human review."
                    </p>
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="font-semibold text-neutral-800 block mb-1">Why was this flagged?</span>
                      <ul className="list-disc list-inside space-y-0.5 text-neutral-600">
                        <li>{c.inconsistencyReason || 'Document mismatch in hospital pharmacy line items.'}</li>
                        <li>Hospital estimate letter needs confirmed counter-signature.</li>
                      </ul>
                    </div>
                    <p className="cf-secondary text-[11px] text-neutral-500 pt-1">
                      Details: {c.inconsistencyNotes}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedCaseForDetail(c)}
                      className="cf-btn-secondary h-9 px-3 text-xs"
                    >
                      View Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecidingCase(c)}
                      className="cf-btn-primary h-9 px-3 text-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Review & Decide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cf-card text-center py-12">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="cf-card-heading text-neutral-900">No active potential inconsistencies</p>
              <p className="cf-secondary text-xs mt-1">All registered case documents are consistent and validated.</p>
            </div>
          )}
        </section>
      )}

      {/* Tab 3: Final Fund Check & Reconciliation (Rule 4) */}
      {activeTab === 'reconciliation' && (
        <section className="cf-card space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="cf-section-heading text-neutral-900 text-lg">Final Fund Check</h2>
            <p className="cf-secondary mt-0.5">
              We compare the amount received with the verified medical expenses and hospital invoices.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-y border-neutral-200 text-neutral-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Hospital</th>
                  <th className="py-2.5 px-3 text-right">Verified Gap</th>
                  <th className="py-2.5 px-3 text-right">Escrow Received</th>
                  <th className="py-2.5 px-3 text-right">Disbursed to Hospital</th>
                  <th className="py-2.5 px-3 text-center">Final Fund Check</th>
                  <th className="py-2.5 px-3 text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cases.map((c) => {
                  const isBalanced = c.alreadyRaised >= c.verifiedFundingGap;
                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900">{c.id}</td>
                      <td className="py-3 px-3 text-neutral-700">{c.hospital}</td>
                      <td className="py-3 px-3 text-right font-semibold text-neutral-900 tabular-nums">
                        {formatINR(c.verifiedFundingGap)}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-700 font-semibold tabular-nums">
                        {formatINR(c.alreadyRaised)}
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-800 tabular-nums">
                        {formatINR(c.alreadyRaised)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="cf-status-text text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Reconciled
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">
                        {isBalanced ? (
                          <span className="text-emerald-700">Fully Settled</span>
                        ) : (
                          <span className="text-neutral-500">In Progress ({formatINR(c.stillNeeded)} remaining)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 4: Audit Ledger & Logs */}
      {activeTab === 'audit' && (
        <section className="cf-card space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="cf-section-heading text-neutral-900 text-lg">Hospital Escrow Audit Ledger</h2>
            <p className="cf-secondary mt-0.5">
              Immutable ledger trail verifying bank account transfers directly to accredited hospital desks.
            </p>
          </div>

          <div className="space-y-3">
            {donations.map((d) => (
              <div
                key={d.receiptId}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-neutral-900">{d.receiptId}</span>
                    <span>·</span>
                    <span className="font-semibold text-neutral-800">{d.donorName}</span>
                    <span>→</span>
                    <span className="text-neutral-700">{d.hospitalRecipient}</span>
                  </div>
                  <p className="cf-secondary text-[11px] text-neutral-500 mt-0.5">
                    For Patient: {d.patientName} ({d.caseId}) · Gateway: {d.paymentMethod}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-neutral-900 tabular-nums">
                    {formatINR(d.amount)}
                  </span>
                  <span className="cf-secondary text-[11px] text-neutral-500 block">
                    {d.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resolve Inconsistency Modal */}
      {/* Human Decision Control Modal */}
      {decidingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
              <div>
                <h3 className="cf-card-heading text-neutral-900 text-lg">
                  Authorized Human Decision · Case {decidingCase.id}
                </h3>
                <p className="cf-secondary text-xs mt-0.5">
                  {decidingCase.patientName} · {decidingCase.treatment} · {decidingCase.hospital}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDecidingCase(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <HumanDecisionControl
                caseItem={decidingCase}
                onDecisionSubmit={handleDecisionComplete}
              />
            </div>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          caseItem={selectedCaseForDetail}
          isOpen={!!selectedCaseForDetail}
          onClose={() => setSelectedCaseForDetail(null)}
          onDonateSuccess={onDonateSuccess}
          onUpdateCase={onUpdateCase}
        />
      )}
    </div>
  );
};
