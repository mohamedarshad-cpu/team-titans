import React, { useState } from 'react';
import { MedicalCase, DonationRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { InfoBlock } from '../components/InfoBlock';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CreditCard,
  Scale,
  Bell,
  User,
  Search,
  Check,
  FileText,
  DollarSign,
  Download,
  UploadCloud,
  FileCheck2,
  Plus,
} from 'lucide-react';

interface HospitalPortalViewProps {
  cases: MedicalCase[];
  donations: DonationRecord[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onUpdateCase: (updatedCase: MedicalCase) => void;
  onDonateSuccess: (donation: DonationRecord) => void;
}

export const HospitalPortalView: React.FC<HospitalPortalViewProps> = ({
  cases,
  donations,
  activeTab,
  onSelectTab,
  onUpdateCase,
  onDonateSuccess,
}) => {
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<MedicalCase | null>(null);
  const [verifyingCase, setVerifyingCase] = useState<MedicalCase | null>(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [uploadedHospitalFileName, setUploadedHospitalFileName] = useState('');
  const [uploadedDocType, setUploadedDocType] = useState('Hospital Admission Order & Itemized Estimate');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [disbursementRequestSuccess, setDisbursementRequestSuccess] = useState<string | null>(null);
  const [reconciliationSuccess, setReconciliationSuccess] = useState<string | null>(null);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  // Upload desk state
  const [docUploadCaseId, setDocUploadCaseId] = useState<string>(cases[0]?.id || '');
  const [newUploadedDocName, setNewUploadedDocName] = useState<string>('');
  const [newUploadedDocCategory, setNewUploadedDocCategory] = useState<string>('Itemized Treatment Estimate');

  // Group cases according to operational stages
  const awaitingVerification = cases.filter(
    (c) =>
      c.status === 'AI Screening Completed' ||
      c.status === 'Pending' ||
      c.status === 'Verification in Progress' ||
      c.status === 'Information Submitted'
  );
  const hospitalVerified = cases.filter(
    (c) => c.status === 'Hospital Verified' || c.status === 'Approved'
  );
  const requiringReview = cases.filter(
    (c) => c.status === 'Human Review Required' || c.status === 'Requires More Information'
  );
  const completedCases = cases.filter(
    (c) => c.status === 'Fully Funded' || c.status === 'Case Closed' || c.status === 'Reconciled'
  );

  const filteredHospitalCases = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      c.patientName.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      c.treatment.toLowerCase().includes(caseSearchQuery.toLowerCase())
  );

  // Handle hospital representative verification action with file upload to web
  const handleVerifyCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingCase) return;

    const docName = uploadedHospitalFileName || 'Apollo_Admission_Order_and_Itemized_Estimate_Signed.pdf';
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const updatedTimeline = verifyingCase.timeline.map((step) => {
      if (step.stepNumber === 3) {
        return {
          ...step,
          status: 'Completed' as const,
          date: currentDate,
          explanation:
            verificationNote ||
            `Hospital confirmed clinical necessity, verified tariffs, and uploaded official files (${docName}) to web.`,
          reviewerRole: 'Dr. C. Balasubramanian (Apollo Clinical Nodal Desk)',
        };
      }
      return step;
    });

    const newDocCheck = {
      name: `${uploadedDocType}: ${docName}`,
      status: 'Verified' as const,
      note: `Uploaded to web and certified by Apollo Greams Road Clinical Social Work Desk on ${currentDate}`,
    };

    const updatedDocChecks = [
      newDocCheck,
      ...verifyingCase.documentChecks.map((d) => ({
        ...d,
        status: 'Verified' as const,
        note: d.note.includes('Verified') ? d.note : `${d.note} · Verified by Hospital Desk`,
      })),
    ];

    const updated: MedicalCase = {
      ...verifyingCase,
      status: 'Hospital Verified',
      verifiedByTitle: 'Authorized Hospital Representative',
      verifierName: 'Dr. C. Balasubramanian, Medical Social Work Liaison, Apollo Hospitals, Chennai',
      verificationDate: currentDate,
      verificationReference: `CF-VER-2026-${verifyingCase.id.slice(-5)}`,
      timeline: updatedTimeline,
      documentChecks: updatedDocChecks,
      humanReviewState: 'In Progress',
      hasInconsistency: false,
      isResolved: true,
      inconsistencyNotes: undefined,
    };

    onUpdateCase(updated);
    setActionSuccessMessage(`Files uploaded to web and verified by hospital desk! Case ${verifyingCase.id} is now Hospital Verified.`);
    setVerifyingCase(null);
    setVerificationNote('');
    setUploadedHospitalFileName('');
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  // Handle uploading files to web from the dedicated Documents desk
  const handleUploadHospitalDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = cases.find((c) => c.id === docUploadCaseId) || cases[0];
    if (!targetCase) return;

    const docName = newUploadedDocName || 'Clinical_Treatment_Sheet_and_Cost_Verification.pdf';
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newDoc = {
      name: `${newUploadedDocCategory}: ${docName}`,
      status: 'Verified' as const,
      note: `Uploaded to web by Apollo Clinical Desk on ${currentDate}. Official hospital seal attached.`,
    };

    // Update case timeline step 3 if pending
    const updatedTimeline = targetCase.timeline.map((step) => {
      if (step.stepNumber === 3 && step.status !== 'Completed') {
        return {
          ...step,
          status: 'Completed' as const,
          date: currentDate,
          explanation: `Official documents (${docName}) uploaded to web by hospital liaison desk.`,
          reviewerRole: 'Apollo Hospitals Clinical Desk',
        };
      }
      return step;
    });

    const updatedDocs = [
      newDoc,
      ...targetCase.documentChecks.map((d) => ({
        ...d,
        status: 'Verified' as const,
        note: d.note.includes('Verified') ? d.note : `${d.note} · Verified by Hospital Desk`,
      })),
    ];

    const updated: MedicalCase = {
      ...targetCase,
      status: targetCase.status === 'Approved' ? 'Approved' : 'Hospital Verified',
      timeline: updatedTimeline,
      documentChecks: updatedDocs,
      verificationDate: currentDate,
      verifiedByTitle: targetCase.verifiedByTitle || 'Authorized Hospital Representative',
      verifierName: targetCase.verifierName || 'Dr. C. Balasubramanian, Medical Social Work Liaison',
      verificationReference: targetCase.verificationReference || `CF-VER-2026-${targetCase.id.slice(-5)}`,
    };

    onUpdateCase(updated);
    setActionSuccessMessage(`Document "${docName}" uploaded to web from hospital and verified for Case ${targetCase.id}.`);
    setNewUploadedDocName('');
    setTimeout(() => setActionSuccessMessage(null), 5000);
  };

  const handleDisbursementRequest = (caseId: string) => {
    setDisbursementRequestSuccess(`Disbursement milestone requested for Case ${caseId}. Escrow settlement initiated.`);
    setTimeout(() => setDisbursementRequestSuccess(null), 4000);
  };

  const handleReconcile = (caseId: string) => {
    setReconciliationSuccess(`Final invoice for Case ${caseId} reconciled with zero variance.`);
    setTimeout(() => setReconciliationSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DASHBOARD                                                 */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="cf-title text-neutral-900">Hospital Dashboard</h1>
              <p className="cf-body text-neutral-600 mt-1">
                Apollo Hospitals, Greams Road · Nodal Clinical Social Work & Escrow Desk
              </p>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Accredited Partner Desk · Chennai Hub</span>
            </div>
          </div>

          <TrustMessageBanner />

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-amber-700 font-medium">Awaiting Verification</span>
              <p className="cf-financial-number text-2xl text-amber-700 mt-1">
                {awaitingVerification.length}
              </p>
              <p className="text-[11px] text-amber-600 mt-1">Estimates pending confirmation</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">Active Hospital Verified</span>
              <p className="cf-financial-number text-2xl text-neutral-900 mt-1">
                {hospitalVerified.length}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Admitted & crowdfunding active</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-emerald-700 font-medium">Escrow Settlements</span>
              <p className="cf-financial-number text-2xl text-emerald-700 mt-1">
                {formatINR(donations.reduce((acc, d) => acc + d.amount, 0))}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">Ring-fenced hospital deposits</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">Reconciled Cases</span>
              <p className="cf-financial-number text-2xl text-neutral-900 mt-1">
                {completedCases.length}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Final itemized invoices cleared</p>
            </div>
          </div>

          {/* Priority Action: Awaiting Verification Queue */}
          <div className="cf-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="cf-card-heading text-neutral-900">Cases Awaiting Hospital Verification</h3>
                <p className="cf-secondary text-xs text-neutral-500 mt-0.5">
                  Confirm patient admission order and itemized treatment cost.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('verification')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1"
              >
                <span>Full Verification Desk</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {awaitingVerification.length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-4 bg-neutral-50 rounded-lg">
                No cases currently awaiting hospital verification. All clinical estimates confirmed.
              </p>
            ) : (
              <div className="space-y-3">
                {awaitingVerification.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-500">{c.id}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 mt-1">
                        {c.patientName}, {c.patientAge || c.age}y · {c.treatment}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Ward: {c.hospitalBedId || 'General Ward 3B'} · Admitted: {c.admittedDate || '04 Oct 2026'}
                      </p>
                      <p className="text-xs text-neutral-800 font-semibold mt-1">
                        Estimated Cost: {formatINR(c.totalTreatmentCost)} · Net Funding Gap: {formatINR(c.verifiedFundingGap)}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingCase(c);
                          onSelectTab('verification');
                        }}
                        className="cf-btn-primary text-xs py-2 px-3 justify-center cursor-pointer"
                      >
                        Verify Patient & Cost
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCaseForDetail(c)}
                        className="cf-btn-secondary text-xs py-2 px-3 justify-center cursor-pointer"
                      >
                        View Documents
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CASES                                                     */}
      {/* ============================================================== */}
      {activeTab === 'cases' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Hospital Admitted Cases</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Complete registry of patients admitted to Apollo Hospitals Chennai under CareFund assistance.
            </p>
          </div>

          <div className="cf-card p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search admitted cases by patient name, MRN, procedure, or case ID..."
                value={caseSearchQuery}
                onChange={(e) => setCaseSearchQuery(e.target.value)}
                className="cf-input pl-9 text-sm"
              />
            </div>
          </div>

          <div className="cf-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Patient & Ward</th>
                    <th className="py-3 px-4">Treatment / Procedure</th>
                    <th className="py-3 px-4 text-right">Verified Cost</th>
                    <th className="py-3 px-4 text-right">Escrow Raised</th>
                    <th className="py-3 px-4 text-right">Still Needed</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredHospitalCases.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">{c.id}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-neutral-900">{c.patientName}, {c.patientAge || c.age}y</p>
                        <p className="text-[11px] text-neutral-500 font-mono">Bed: {c.hospitalBedId || 'ICU-4'}</p>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-700">{c.treatment}</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-neutral-900">
                        {formatINR(c.totalTreatmentCost)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-700 font-medium">
                        {formatINR(c.alreadyRaised)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-red-600">
                        {formatINR(c.stillNeeded)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCaseForDetail(c)}
                          className="cf-btn-secondary text-xs py-1.5 px-2.5 cursor-pointer"
                        >
                          View Details
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
      {/* TAB: PATIENT VERIFICATION                                      */}
      {/* ============================================================== */}
      {activeTab === 'verification' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Patient Verification Desk</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Authorized clinical liaison verification confirming patient identity, admission order, and medical necessity.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Verification Form Modal / Card */}
          {verifyingCase ? (
            <div className="cf-card p-6 border-red-200 bg-red-50/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <span className="font-mono text-xs text-neutral-500">{verifyingCase.id}</span>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Verify Patient: {verifyingCase.patientName} ({verifyingCase.treatment})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyingCase(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleVerifyCaseSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block">Admitted Facility</span>
                    <span className="font-semibold text-neutral-900">{verifyingCase.hospital}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block">Estimated Cost</span>
                    <span className="font-bold text-neutral-900">{formatINR(verifyingCase.totalTreatmentCost)}</span>
                  </div>
                </div>

                <div>
                  <label className="cf-label block mb-1">
                    Hospital Representative Clinical Verification Statement
                  </label>
                  <textarea
                    rows={2}
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    placeholder="Confirm that the patient is actively admitted, surgeon schedule is confirmed, and estimated costs are aligned with official hospital schedule of charges..."
                    className="cf-input text-xs"
                    required
                  />
                </div>

                {/* File Upload to Web from Hospital */}
                <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="cf-label block font-semibold text-neutral-900">
                      Upload Verification Files to Web (PDF / Scanned Reports)
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hospital Official Seal
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="cf-label block mb-1">Document Category</label>
                      <select
                        value={uploadedDocType}
                        onChange={(e) => setUploadedDocType(e.target.value)}
                        className="cf-input text-xs"
                      >
                        <option>Hospital Admission Order & Itemized Estimate</option>
                        <option>Surgeon Operating Clearance & Tariff Slip</option>
                        <option>Clinical Workup & Diagnostic Echo Report</option>
                        <option>Direct Escrow Settlement Authorization</option>
                      </select>
                    </div>

                    <div>
                      <label className="cf-label block mb-1">Document File Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Apollo_Admission_GreamsRd_Oct2026.pdf"
                        value={uploadedHospitalFileName}
                        onChange={(e) => setUploadedHospitalFileName(e.target.value)}
                        className="cf-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="border border-dashed border-neutral-300 rounded-lg p-3 text-center bg-neutral-50/50">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <UploadCloud className="w-4 h-4 text-neutral-500" />
                      <span className="font-medium text-neutral-700">
                        {uploadedHospitalFileName ? `Selected: ${uploadedHospitalFileName}` : 'Choose official file or attach signed certificate'}
                      </span>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                      <label className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-800 rounded border border-neutral-300 text-[11px] font-medium cursor-pointer">
                        <span>Browse Files</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setUploadedHospitalFileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                      {!uploadedHospitalFileName && (
                        <button
                          type="button"
                          onClick={() => setUploadedHospitalFileName('Apollo_Admission_and_Itemized_Tariff_Signed.pdf')}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-[11px] font-medium cursor-pointer"
                        >
                          Use Signed Apollo Estimate PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Submitting uploads the certified files to web, completes Step 3 (Hospital Verification), and advances case to final human review.
                  </span>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setVerifyingCase(null)}
                    className="cf-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cf-btn-primary text-xs">
                    Confirm Hospital Verification
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Select Case to Verify</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className="cf-card p-5 flex flex-col justify-between hover:border-neutral-300 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-neutral-500">{c.id}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 mt-1">
                        {c.patientName}, {c.patientAge || c.age}y
                      </h4>
                      <p className="text-xs text-neutral-700 font-medium mt-0.5">{c.treatment}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Estimated Cost: {formatINR(c.totalTreatmentCost)} · Gap: {formatINR(c.verifiedFundingGap)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingCase(c);
                          setVerificationNote(
                            `Apollo Hospitals social work desk confirmed patient admission order and clinical surgery schedule for ${c.patientName}. Cost estimate verified against hospital schedule.`
                          );
                        }}
                        className="cf-btn-primary text-xs py-1.5 px-3 flex-1 justify-center cursor-pointer"
                      >
                        Verify Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCaseForDetail(c)}
                        className="cf-btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                      >
                        Docs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: TREATMENT COST VERIFICATION                               */}
      {/* ============================================================== */}
      {activeTab === 'costs' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Treatment Cost Verification</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Itemized billing review verifying surgery costs, ICU charges, medicines, and insurance deductions.
            </p>
          </div>

          <div className="cf-card p-6 space-y-6">
            <h3 className="cf-card-heading text-neutral-900">
              Itemized Schedule of Charges — CF-CHN-2026-00124 (Kavitha R.)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Itemized Clinical Service</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Standard Charge</th>
                    <th className="py-2.5 px-3 text-right">Hospital Concession</th>
                    <th className="py-2.5 px-3 text-right">Net Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3 px-3 font-medium text-neutral-900">Surgeon & Anesthesia Team Fees</td>
                    <td className="py-3 px-3 text-neutral-500">Professional Services</td>
                    <td className="py-3 px-3 text-right">₹3,50,000</td>
                    <td className="py-3 px-3 text-right text-emerald-700">-₹50,000</td>
                    <td className="py-3 px-3 text-right font-bold">₹3,00,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-neutral-900">Cardiac ICU & Monitoring (7 Days)</td>
                    <td className="py-3 px-3 text-neutral-500">Critical Care</td>
                    <td className="py-3 px-3 text-right">₹4,20,000</td>
                    <td className="py-3 px-3 text-right text-emerald-700">-₹20,000</td>
                    <td className="py-3 px-3 text-right font-bold">₹4,00,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-neutral-900">HeartMate 3 LVAD Implant & Cannulae</td>
                    <td className="py-3 px-3 text-neutral-500">Medical Implants</td>
                    <td className="py-3 px-3 text-right">₹16,00,000</td>
                    <td className="py-3 px-3 text-right text-emerald-700">-₹1,00,000</td>
                    <td className="py-3 px-3 text-right font-bold">₹15,00,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-medium text-neutral-900">Pharmacy & Post-op Anticoagulation</td>
                    <td className="py-3 px-3 text-neutral-500">Medications</td>
                    <td className="py-3 px-3 text-right">₹1,80,000</td>
                    <td className="py-3 px-3 text-right text-emerald-700">-₹30,000</td>
                    <td className="py-3 px-3 text-right font-bold">₹1,50,000</td>
                  </tr>
                </tbody>
                <tfoot className="bg-neutral-50 font-bold border-t border-neutral-200">
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-right">Total Net Verified Hospital Bill:</td>
                    <td className="py-3 px-3 text-right text-base text-red-600">₹23,50,000</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Verified by Dr. C. Balasubramanian (Apollo Clinical Nodal Officer) on 04 Oct 2026.
                </span>
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                VER-APO-2026-981
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DOCUMENTS (HOSPITAL WEB UPLOAD DESK)                     */}
      {/* ============================================================== */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Hospital Documents & Web Upload</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Upload official clinical orders, itemized estimates, and diagnostic summaries to the web portal. All uploaded files are instantly verified with the hospital credential seal.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Quick Upload Form Card */}
          <div className="cf-card p-6 border-red-200 bg-red-50/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-red-600" />
                <h3 className="cf-card-heading text-neutral-900 font-bold">
                  Upload Official Medical Document to Web
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Apollo Greams Road Nodal Desk
              </span>
            </div>

            <form onSubmit={handleUploadHospitalDocSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="cf-label block mb-1">Select Patient / Case</label>
                  <select
                    value={docUploadCaseId}
                    onChange={(e) => setDocUploadCaseId(e.target.value)}
                    className="cf-input text-xs"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.patientName} ({c.treatment})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="cf-label block mb-1">Document Category</label>
                  <select
                    value={newUploadedDocCategory}
                    onChange={(e) => setNewUploadedDocCategory(e.target.value)}
                    className="cf-input text-xs"
                  >
                    <option>Hospital Admission Order</option>
                    <option>Itemized Treatment Estimate</option>
                    <option>Diagnostic Pathology & Echo Report</option>
                    <option>Surgeon Operating Clearance</option>
                    <option>Post-Op Discharge Summary & Final Bill</option>
                  </select>
                </div>

                <div>
                  <label className="cf-label block mb-1">Document File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo_Greams_Estimate_Oct2026.pdf"
                    value={newUploadedDocName}
                    onChange={(e) => setNewUploadedDocName(e.target.value)}
                    className="cf-input text-xs"
                  />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border border-dashed border-neutral-300 rounded-xl p-4 text-center bg-white">
                <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-neutral-800">
                  {newUploadedDocName ? `Selected: ${newUploadedDocName}` : 'Select Document to Upload to Web (PDF / Scanned JPG)'}
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  <label className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold cursor-pointer">
                    <span>Browse Computer</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setNewUploadedDocName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {!newUploadedDocName && (
                    <button
                      type="button"
                      onClick={() => setNewUploadedDocName('Apollo_Greams_Itemized_Surgery_Invoice_Signed.pdf')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Use Demo Official Estimate File
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-neutral-500">
                  Uploaded files are digitally stamped with Apollo Hospitals partner key and synced with Reviewer Portal.
                </span>
                <button
                  type="submit"
                  className="cf-btn-primary text-xs py-2 px-4 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload File to Web & Mark Verified</span>
                </button>
              </div>
            </form>
          </div>

          {/* Master Uploaded Documents Ledger */}
          <div className="cf-card overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="cf-card-heading text-neutral-900">Hospital Uploaded Documents Ledger</h3>
                <p className="cf-secondary text-xs text-neutral-500">
                  All clinical documents uploaded and certified by Apollo Greams Road liaison desk.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {cases.reduce((acc, c) => acc + c.documentChecks.length, 0)} documents synced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Verification Details</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {cases.flatMap((c) =>
                    c.documentChecks.map((doc, idx) => (
                      <tr key={`${c.id}-${idx}`} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-3 font-mono font-semibold text-neutral-900">{c.id}</td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-neutral-900">{c.patientName}</p>
                          <p className="text-[11px] text-neutral-500">{c.treatment}</p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                            <span className="font-semibold text-neutral-800">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-neutral-600 max-w-xs truncate" title={doc.note}>
                          {doc.note}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              doc.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCaseForDetail(c)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PAYMENTS                                                  */}
      {/* ============================================================== */}
      {activeTab === 'payments' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Escrow Payments & Disbursements</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Direct hospital escrow transfers and milestone disbursement requests.
            </p>
          </div>

          {disbursementRequestSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{disbursementRequestSuccess}</span>
            </div>
          )}

          {/* Direct Bank Escrow Account Card */}
          <div className="cf-card p-6 bg-neutral-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold tracking-wide">
                  Verified Hospital Escrow Settlement Account
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Direct Settlement
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div>
                <span className="text-neutral-400 block">Beneficiary Entity</span>
                <span className="font-semibold text-white">Apollo Hospitals Enterprise Ltd</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Designated Escrow Account</span>
                <span className="font-mono font-semibold text-white">92102008391823 (Axis Bank)</span>
              </div>
              <div>
                <span className="text-neutral-400 block">IFSC / Branch</span>
                <span className="font-mono font-semibold text-white">UTIB0000142 / Greams Road</span>
              </div>
            </div>
          </div>

          {/* Payment Confirmations Table */}
          <div className="cf-card overflow-hidden">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="cf-card-heading text-neutral-900">Received Escrow Credits</h3>
              <span className="text-xs text-neutral-500">Updated in real-time</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Receipt Ref</th>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {donations.map((d) => (
                    <tr key={d.receiptId} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900">{d.receiptId}</td>
                      <td className="py-3 px-3 font-mono text-neutral-700">{d.caseId}</td>
                      <td className="py-3 px-3 font-medium text-neutral-800">{d.patientName}</td>
                      <td className="py-3 px-3 text-neutral-500">{d.timestamp}</td>
                      <td className="py-3 px-3 text-right font-bold text-neutral-900 tabular-nums">
                        {formatINR(d.amount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDisbursementRequest(d.caseId)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Request Disbursement
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
      {/* TAB: RECONCILIATION                                            */}
      {/* ============================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Post-Discharge Invoice Reconciliation</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Matches hospital estimates against final discharge invoices. Unused escrow funds are refunded to the CareFund medical pool.
            </p>
          </div>

          {reconciliationSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reconciliationSuccess}</span>
            </div>
          )}

          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Discharged Patients Pending Reconciliation</h3>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-neutral-500">CF-CHN-2026-00142</span>
                <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                  Aarav M., 4y · Ventricular Septal Defect Surgery
                </h4>
                <p className="text-xs text-neutral-600">Discharged: 07 Oct 2026 · Estimated: ₹5,00,000 · Actual Bill: ₹4,92,000</p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Surplus ₹8,000 to be returned to CareFund Pediatric Pool
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleReconcile('CF-CHN-2026-00142')}
                className="cf-btn-primary text-xs py-2 px-3 cursor-pointer shrink-0"
              >
                Sign Off Reconciliation
              </button>
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
            <h1 className="cf-title text-neutral-900">Hospital Notifications</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Liaison desk updates on patient escrow credits, auditor approvals, and invoices.
            </p>
          </div>

          <div className="cf-card divide-y divide-neutral-100">
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  New Escrow Deposit: ₹25,000 credited for Kavitha R. (CF-CHN-2026-00124)
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Direct transfer from CareFund Axis Escrow to Apollo Greams Road account.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">08 Oct 2026, 11:20 AM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  Clinical Audit Signed: Dr. K. Swaminathan approved Case CF-CHN-2026-00124
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Pre-operative funding gap validated. Final human decision recorded.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">05 Oct 2026, 04:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PROFILE                                                   */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="cf-title text-neutral-900">Hospital Profile & Escrow Details</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Authorized clinical liaison coordinates, accreditation numbers, and escrow settlement details.
            </p>
          </div>

          {profileSaveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hospital profile updated.</span>
            </div>
          )}

          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Institution & Liaison Officer</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label block mb-1">Accredited Hospital Name</label>
                <input
                  type="text"
                  readOnly
                  value="Apollo Hospitals, Greams Road, Chennai"
                  className="cf-input text-sm bg-neutral-50"
                />
              </div>
              <div>
                <label className="cf-label block mb-1">NABH Accreditation Number</label>
                <input
                  type="text"
                  readOnly
                  value="NABH-2024-H-0812"
                  className="cf-input text-sm font-mono bg-neutral-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label block mb-1">Authorized Medical Social Worker</label>
                <input
                  type="text"
                  defaultValue="Dr. C. Balasubramanian"
                  className="cf-input text-sm"
                />
              </div>
              <div>
                <label className="cf-label block mb-1">Liaison Contact Direct</label>
                <input
                  type="text"
                  defaultValue="044-2829-0200 / balasu.c@apollo.org"
                  className="cf-input text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          medicalCase={selectedCaseForDetail}
          onClose={() => setSelectedCaseForDetail(null)}
          onUpdateCase={onUpdateCase}
        />
      )}
    </div>
  );
};
