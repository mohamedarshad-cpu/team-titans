import React, { useState } from 'react';
import { MedicalCase } from '../types/carefund';
import { formatINR, calculateFundingMetrics } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { VerificationTimeline } from '../components/VerificationTimeline';
import { PrivacyNoticeCard } from '../components/PrivacyNoticeCard';
import { DecisionStatusTrio } from '../components/DecisionStatusTrio';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import {
  FilePlus,
  Search,
  UploadCloud,
  CheckCircle2,
  Building2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RequestAssistanceViewProps {
  cases: MedicalCase[];
  onSubmitNewCase: (newCase: MedicalCase) => void;
}

export const RequestAssistanceView: React.FC<RequestAssistanceViewProps> = ({
  cases,
  onSubmitNewCase,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Tracking state
  const [trackId, setTrackId] = useState('CF-CHN-2026-00124');
  const [trackedCase, setTrackedCase] = useState<MedicalCase | null>(
    cases.find((c) => c.id === 'CF-CHN-2026-00124') || cases[0]
  );
  const [trackError, setTrackError] = useState('');

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [treatment, setTreatment] = useState('');
  const [treatmentCategory, setTreatmentCategory] = useState<'Cardiac' | 'Oncology' | 'Pediatric' | 'Trauma & Ortho' | 'Transplant' | 'Emergency'>('Cardiac');
  const [hospital, setHospital] = useState('Apollo Hospitals, Greams Road, Chennai');
  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  const [totalCost, setTotalCost] = useState('500000');
  const [insurance, setInsurance] = useState('150000');
  const [govtSupport, setGovtSupport] = useState('100000');
  const [hospitalAid, setHospitalAid] = useState('30000');
  const [familySavings, setFamilySavings] = useState('50000');
  const [existingDonations, setExistingDonations] = useState('0');
  const [fileName, setFileName] = useState('');
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic funding gap calculation
  const numCost = Number(totalCost) || 0;
  const numInsurance = Number(insurance) || 0;
  const numGovt = Number(govtSupport) || 0;
  const numHospital = Number(hospitalAid) || 0;
  const numFamily = Number(familySavings) || 0;
  const numDonations = Number(existingDonations) || 0;

  const { confirmedSupport, verifiedFundingGap, stillNeeded } = calculateFundingMetrics({
    totalTreatmentCost: numCost,
    insuranceConfirmed: numInsurance,
    governmentSupportConfirmed: numGovt,
    hospitalAssistance: numHospital,
    familyContribution: numFamily,
    existingDonations: numDonations,
    alreadyRaised: 0,
  });

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError('');
    const found = cases.find(
      (c) => c.id.trim().toLowerCase() === trackId.trim().toLowerCase()
    );
    if (found) {
      setTrackedCase(found);
    } else {
      setTrackError('Case ID not found. Please check your reference code (e.g. CF-CHN-2026-00124).');
      setTrackedCase(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) {
      newErrors.patientName = 'Please enter the patient’s full name as shown on hospital records.';
    }
    if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      newErrors.patientAge = 'Please enter a valid patient age.';
    }
    if (!treatment.trim()) {
      newErrors.treatment = 'Please enter the planned treatment or surgery name.';
    }
    if (numCost <= 0) {
      newErrors.totalCost = 'Please enter the treatment amount shown on the verified hospital estimate.';
    }
    if (verifiedFundingGap <= 0) {
      newErrors.totalCost = 'The confirmed support exceeds the total treatment cost. Funding gap must be greater than ₹0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newId = `CF-CHN-2026-${Math.floor(10000 + Math.random() * 90000).toString().slice(-4)}`;
    const newCase: MedicalCase = {
      id: newId,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      treatment,
      treatmentCategory,
      hospital,
      hospitalAddress: 'Chennai, Tamil Nadu',
      city: 'Chennai, Tamil Nadu',
      diagnosisSummary: diagnosisSummary || 'Medical diagnosis submitted for hospital review.',
      patientStory: `Assistance requested for ${treatment} at ${hospital}. Preliminary documents uploaded.`,
      totalTreatmentCost: numCost,
      insuranceConfirmed: numInsurance,
      governmentSupportConfirmed: numGovt,
      hospitalAssistance: numHospital,
      familyContribution: numFamily,
      existingDonations: numDonations,
      verifiedFundingGap,
      alreadyRaised: 0,
      stillNeeded: verifiedFundingGap,
      status: 'AI Screening Completed',
      verifiedByTitle: 'Authorized Hospital Representative',
      verifierName: 'Pending Hospital Counter-signature',
      verificationDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      verificationReference: `${newId}-VER-INT`,
      hospitalAccountReference: `${hospital} Escrow Desk`,

      // Decision Trio
      aiScreeningState: 'Completed',
      humanReviewState: 'Pending',
      finalDecisionState: 'Not yet decided',

      // AI Assistance & Decision logs
      aiAssistance: {
        checkedSummary: 'Initial automated check completed. Documents formatted properly for human review.',
        checkedItems: [
          'Verified numerical arithmetic of hospital estimated total',
          'Checked document attachment format and preliminary procedure classification',
        ],
        possibleInconsistencies: [],
        supportingInformation: ['Uploaded files queued for hospital medical social work desk'],
        confidenceExplanation: 'AI assisted format check. Final decision awaits authorized human reviewer.',
      },
      humanDecisions: [],

      timeline: [
        {
          stepNumber: 1,
          title: 'Information Submitted',
          status: 'Completed',
          date: 'Today',
          explanation: 'Your information has been submitted and is ready for initial checking.',
          reviewerRole: 'Patient / Family',
        },
        {
          stepNumber: 2,
          title: 'AI Check Completed',
          status: 'Completed',
          date: 'Today',
          explanation: 'CareFund checked the submitted information for missing or inconsistent details.',
          reviewerRole: 'Automated AI Check',
        },
        {
          stepNumber: 3,
          title: 'Human Review',
          status: 'In Progress',
          explanation: 'An authorized hospital representative or CareFund reviewer manually reviews the information.',
          reviewerRole: 'Authorized Reviewer',
        },
        {
          stepNumber: 4,
          title: 'Final Decision',
          status: 'Upcoming',
          explanation: 'The authorized human reviewer makes the final binding decision.',
          reviewerRole: 'Clinical Supervisor',
        },
      ],
      documentChecks: [
        {
          name: 'Hospital Estimate Slip',
          status: 'Verified',
          note: 'Initial scan uploaded; hospital administration verification in progress.',
        },
      ],
      hasInconsistency: false,
    };

    onSubmitNewCase(newCase);
    setSubmittedCaseId(newId);
    setTrackId(newId);
    setTrackedCase(newCase);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Standard Page Structure: Title & Description */}
      <div>
        <h1 className="cf-title text-neutral-900">Request Medical Assistance</h1>
        <p className="cf-body text-neutral-600 mt-2">
          Apply for verified healthcare funding or track your submitted application through Chennai hospital desks.
        </p>
      </div>

      <TrustMessageBanner />

      {/* Rule 7: Every Screen Must Explain Itself */}
      <section className="cf-card bg-neutral-50/80 border-neutral-200">
        <h3 className="cf-card-heading text-neutral-900 text-sm font-semibold uppercase tracking-wider mb-3">
          How Medical Assistance Works on CareFund
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What is this?
            </span>
            <p className="font-semibold text-neutral-900">Patient Assistance Intake</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              A transparent application for patients undergoing major surgeries or hospital treatment in Chennai.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              Why does it matter?
            </span>
            <p className="font-semibold text-neutral-900">Closing the Real Gap</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              CareFund deducts confirmed insurance, schemes, and savings so donors cover the true medical shortfall.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What do I need to do?
            </span>
            <p className="font-semibold text-neutral-900">Submit Hospital Estimate</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Enter treatment details, confirmed financial support, and upload your hospital estimate slip.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What happens next?
            </span>
            <p className="font-semibold text-neutral-900">Human Verification & Approval</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              AI checks document format; authorized hospital and clinical reviewers make the final decision.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation tabs between Submit and Track */}
      <div className="flex border-b border-neutral-200 gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('submit');
            setSubmittedCaseId(null);
          }}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'submit'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Submit Assistance Request
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'track'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Track Existing Request
        </button>
      </div>

      {activeTab === 'submit' && (
        <>
          {submittedCaseId ? (
            /* Submission Success Screen */
            <div className="cf-card border-emerald-200 bg-white p-8 text-center max-w-2xl mx-auto space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <span className="cf-status-text text-xs px-3 py-1 rounded bg-emerald-100 text-emerald-800">
                  Request Submitted Successfully
                </span>
                <h2 className="cf-section-heading text-neutral-900 mt-3">
                  Your Case ID is {submittedCaseId}
                </h2>
                <p className="cf-body text-neutral-600 mt-2">
                  Our initial automated document check has completed. Your request has been routed to the medical social work desk at {hospital}.
                </p>
              </div>

              {/* 3-Part Status Explanation */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-left space-y-2">
                <p className="cf-secondary text-xs text-neutral-500 font-semibold uppercase">What Happens Next?</p>
                <p className="cf-body text-sm text-neutral-800">
                  1. Hospital representative verifies the procedure code and estimate.<br />
                  2. Once confirmed, your verified funding gap of <strong>{formatINR(verifiedFundingGap)}</strong> will open for donor support.<br />
                  3. All funds are disbursed directly to {hospital}.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('track');
                  }}
                  className="cf-btn-primary"
                >
                  Track Status on Timeline
                </button>
              </div>
            </div>
          ) : (
            /* Main Assistance Application Form */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <form onSubmit={handleFormSubmit} className="cf-card space-y-6">
                  <div className="border-b border-neutral-100 pb-4">
                    <h2 className="cf-section-heading text-neutral-900">Patient & Treatment Information</h2>
                    <p className="cf-secondary mt-0.5">
                      Enter the patient information exactly as listed on hospital admission documents.
                    </p>
                  </div>

                  {/* Section 1: Patient Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="cf-label block mb-1">Patient Full Name</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Kavitha R."
                        className={`w-full h-11 px-3.5 bg-white border rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 ${
                          errors.patientName ? 'border-red-500 bg-red-50/20' : 'border-neutral-300'
                        }`}
                      />
                      {errors.patientName ? (
                        <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
                      ) : (
                        <p className="cf-secondary text-xs mt-1">Name on government ID and hospital estimate.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="cf-label block mb-1">Age</label>
                        <input
                          type="number"
                          required
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="48"
                          className={`w-full h-11 px-3.5 bg-white border rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 ${
                            errors.patientAge ? 'border-red-500' : 'border-neutral-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="cf-label block mb-1">Gender</label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full h-11 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Child / Infant">Child / Infant</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="cf-label block mb-1">Medical Category</label>
                      <select
                        value={treatmentCategory}
                        onChange={(e) => setTreatmentCategory(e.target.value as any)}
                        className="w-full h-11 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                      >
                        <option value="Cardiac">Cardiac Surgery</option>
                        <option value="Oncology">Oncology / Cancer Care</option>
                        <option value="Pediatric">Pediatric Speciality</option>
                        <option value="Trauma & Ortho">Trauma & Orthopedic</option>
                        <option value="Transplant">Organ Transplant</option>
                        <option value="Emergency">Emergency ICU Care</option>
                      </select>
                      <p className="cf-secondary text-xs mt-1">Select the primary clinical department.</p>
                    </div>

                    <div>
                      <label className="cf-label block mb-1">Planned Treatment / Surgery</label>
                      <input
                        type="text"
                        required
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        placeholder="e.g. Mitral Valve Replacement"
                        className={`w-full h-11 px-3.5 bg-white border rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 ${
                          errors.treatment ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      {errors.treatment ? (
                        <p className="text-xs text-red-600 mt-1">{errors.treatment}</p>
                      ) : (
                        <p className="cf-secondary text-xs mt-1">Specific medical procedure requested.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Treating Hospital (Chennai & Tamil Nadu)</label>
                    <select
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full h-11 px-3.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                    >
                      <option value="Apollo Hospitals, Greams Road, Chennai">
                        Apollo Hospitals, Greams Road, Chennai
                      </option>
                      <option value="Cancer Institute (WIA), Adyar, Chennai">
                        Cancer Institute (WIA), Adyar, Chennai
                      </option>
                      <option value="MIOT International, Manapakkam, Chennai">
                        MIOT International, Manapakkam, Chennai
                      </option>
                      <option value="Institute of Child Health (ICH), Egmore, Chennai">
                        Institute of Child Health (ICH), Egmore, Chennai
                      </option>
                      <option value="Government Multi Super Speciality Hospital, Omandurar, Chennai">
                        Govt Multi Super Speciality Hospital, Omandurar, Chennai
                      </option>
                    </select>
                    <p className="cf-secondary text-xs mt-1">Funds are paid directly to this hospital's verified account.</p>
                  </div>

                  {/* Section 2: Financial Calculation Fields (Rule 6) */}
                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <div>
                      <h3 className="cf-card-heading text-neutral-900">Treatment Cost & Confirmed Financial Aid</h3>
                      <p className="cf-secondary mt-0.5">
                        CareFund calculates the verified gap by deducting all confirmed insurance, government schemes, and family contributions.
                      </p>
                    </div>

                    <div>
                      <label className="cf-label block mb-1">Total Estimated Treatment Cost (₹ INR)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-neutral-500">₹</span>
                        <input
                          type="number"
                          required
                          value={totalCost}
                          onChange={(e) => setTotalCost(e.target.value)}
                          placeholder="800000"
                          className="w-full h-11 pl-8 pr-4 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        />
                      </div>
                      <p className="cf-secondary text-xs mt-1">
                        Enter the total amount shown on the official hospital estimate letter.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="cf-label block text-xs mb-1">Confirmed Insurance (₹)</label>
                        <input
                          type="number"
                          value={insurance}
                          onChange={(e) => setInsurance(e.target.value)}
                          placeholder="0"
                          className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        />
                        <p className="cf-secondary text-[11px] text-neutral-500 mt-1">TPA or health insurance claim approval.</p>
                      </div>

                      <div>
                        <label className="cf-label block text-xs mb-1">Government Support Confirmed (₹)</label>
                        <input
                          type="number"
                          value={govtSupport}
                          onChange={(e) => setGovtSupport(e.target.value)}
                          placeholder="0"
                          className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        />
                        <p className="cf-secondary text-[11px] text-neutral-500 mt-1">e.g. Tamil Nadu CMCHIS or PM-JAY scheme.</p>
                      </div>

                      <div>
                        <label className="cf-label block text-xs mb-1">Hospital Assistance / Concession (₹)</label>
                        <input
                          type="number"
                          value={hospitalAid}
                          onChange={(e) => setHospitalAid(e.target.value)}
                          placeholder="0"
                          className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        />
                        <p className="cf-secondary text-[11px] text-neutral-500 mt-1">Hospital charity fund discount.</p>
                      </div>

                      <div>
                        <label className="cf-label block text-xs mb-1">Family Savings Contribution (₹)</label>
                        <input
                          type="number"
                          value={familySavings}
                          onChange={(e) => setFamilySavings(e.target.value)}
                          placeholder="0"
                          className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                        />
                        <p className="cf-secondary text-[11px] text-neutral-500 mt-1">Amount the patient family can pay directly.</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Document Upload */}
                  <div className="pt-4 border-t border-neutral-100 space-y-3">
                    <h3 className="cf-card-heading text-neutral-900">Hospital Documents</h3>
                    <p className="cf-secondary text-xs">
                      Upload the hospital estimate certificate signed by the treating consultant or hospital desk.
                    </p>

                    <label className="border-2 border-dashed border-neutral-300 hover:border-red-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                      <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                      <span className="cf-card-heading text-sm text-neutral-800">
                        {fileName ? fileName : 'Click to upload Hospital Estimate or Diagnostic Report'}
                      </span>
                      <span className="cf-secondary text-xs text-neutral-500 mt-1">
                        PDF or clear JPG/PNG format (Max 15MB)
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFileName(file.name);
                        }}
                      />
                    </label>

                    {fileName && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                        <span className="font-medium">Attached: {fileName}</span>
                        <span className="text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded font-semibold">
                          Ready for Document Check
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <p className="cf-secondary text-xs text-neutral-500">
                      Zero registration fee. Direct hospital disbursement.
                    </p>
                    <button
                      type="submit"
                      className="cf-btn-primary"
                    >
                      Submit Assistance Request
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Summary Sidebar (Live Calculation) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="cf-card bg-neutral-50/70 border-neutral-200 space-y-4">
                  <h3 className="cf-card-heading text-neutral-900">Live Funding Gap Calculation</h3>
                  <p className="cf-secondary text-xs">
                    Updates automatically as you enter hospital and confirmed aid values.
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Treatment Cost</span>
                      <span className="font-semibold text-neutral-900 tabular-nums">
                        {formatINR(numCost)}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-600 pl-2 border-l border-neutral-300">
                      <span>− Confirmed Support</span>
                      <span className="tabular-nums">− {formatINR(confirmedSupport)}</span>
                    </div>

                    <div className="pt-2 border-t border-neutral-200 flex justify-between font-semibold text-sm">
                      <span className="text-neutral-900">Verified Funding Gap</span>
                      <span className="text-neutral-900 tabular-nums">{formatINR(verifiedFundingGap)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-red-50 rounded-lg border border-red-200">
                    <span className="cf-secondary text-xs text-red-700 font-medium block">Amount Still Needed</span>
                    <span className="cf-financial-number text-2xl text-red-700 mt-0.5 block">
                      {formatINR(stillNeeded)}
                    </span>
                    <span className="cf-secondary text-[11px] text-red-600 mt-1 block">
                      Amount that will be presented to community donors.
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 leading-relaxed border-t border-neutral-200 pt-3">
                    <strong>Formula Rule:</strong> Verified Funding Gap = Total verified cost − confirmed support − existing donations.
                  </div>
                </div>

                <PrivacyNoticeCard />
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Case Search Input */}
          <div className="cf-card">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="cf-label block mb-1">Enter Your CareFund Case ID</label>
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                  placeholder="e.g. CF-CHN-2026-00124"
                  className="w-full h-11 px-3.5 bg-white border border-neutral-300 rounded-lg text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 uppercase"
                />
              </div>
              <button
                type="submit"
                className="cf-btn-primary sm:self-end h-11"
              >
                <Search className="w-4 h-4" />
                Track Case Status
              </button>
            </form>

            {trackError && (
              <p className="text-xs text-red-600 mt-2 font-medium">{trackError}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
              <span>Try example cases:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackId('CF-CHN-2026-00124');
                  const found = cases.find((c) => c.id === 'CF-CHN-2026-00124');
                  if (found) setTrackedCase(found);
                }}
                className="font-mono underline text-red-600 cursor-pointer"
              >
                CF-CHN-2026-00124 (Hospital Verified)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackId('CF-CHN-2026-00179');
                  const found = cases.find((c) => c.id === 'CF-CHN-2026-00179');
                  if (found) setTrackedCase(found);
                }}
                className="font-mono underline text-red-600 cursor-pointer"
              >
                CF-CHN-2026-00179 (Requires Review)
              </button>
            </div>
          </div>

          {/* Tracked Case View */}
          {trackedCase && (
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="cf-card bg-neutral-50/70">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                  <div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-800">
                      {trackedCase.id}
                    </span>
                    <h2 className="cf-section-heading text-neutral-900 mt-2">
                      {trackedCase.treatment} · {trackedCase.patientName}
                    </h2>
                    <p className="cf-secondary text-xs flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      {trackedCase.hospital}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="cf-secondary text-xs text-neutral-500 block mb-1">Current Status</span>
                    <StatusBadge status={trackedCase.status} size="lg" />
                  </div>
                </div>

                {/* Rule 13: Decision Status Trio */}
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <DecisionStatusTrio
                    aiScreening={trackedCase.aiScreeningState}
                    humanReview={trackedCase.humanReviewState}
                    finalDecision={trackedCase.finalDecisionState}
                  />
                </div>

                {/* 3-Part Status Explanation Box */}
                <div className="mt-4 p-3.5 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-sm text-neutral-900">
                      Status Meaning & Next Step
                    </span>
                  </div>
                  <p className="cf-secondary text-xs text-neutral-600 leading-relaxed">
                    {trackedCase.status === 'Hospital Verified' &&
                      'The hospital has confirmed the treatment and submitted cost information. Campaign is open.'}
                    {trackedCase.status === 'Human Review Required' &&
                      'An authorized human reviewer is reviewing documentation before making the final decision.'}
                    {trackedCase.status === 'Approved' &&
                      'Case has been approved by authorized human reviewer and is accepting public support.'}
                    {trackedCase.status === 'AI Screening Completed' &&
                      'AI screening completed. Awaiting hospital desk review and authorized human sign-off.'}
                    {trackedCase.status === 'Requires More Information' &&
                      'Reviewer requested additional hospital paperwork. Please contact your hospital desk.'}
                    {trackedCase.status === 'Fully Funded' &&
                      '100% of the verified medical gap has been funded. Disbursed directly to hospital escrow.'}
                  </p>
                </div>
              </div>

              {/* Timeline & Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <VerificationTimeline timeline={trackedCase.timeline} />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  {/* Financial Status */}
                  <div className="cf-card space-y-3">
                    <h3 className="cf-card-heading text-neutral-900">Funding Summary</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Verified Cost</span>
                        <span className="font-semibold text-neutral-900 tabular-nums">
                          {formatINR(trackedCase.totalTreatmentCost)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Already Raised</span>
                        <span className="font-semibold text-neutral-900 tabular-nums">
                          {formatINR(trackedCase.alreadyRaised)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-neutral-200 flex justify-between font-semibold text-sm text-red-700">
                        <span>Amount Still Needed</span>
                        <span className="tabular-nums">{formatINR(trackedCase.stillNeeded)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Check Results */}
                  <div className="cf-card space-y-3">
                    <h3 className="cf-card-heading text-neutral-900">Document Check Status</h3>
                    <div className="space-y-2">
                      {trackedCase.documentChecks.map((doc, idx) => (
                        <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="font-semibold text-neutral-900">{doc.name}</span>
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              {doc.status}
                            </span>
                          </div>
                          <p className="cf-secondary text-[11px] text-neutral-600">{doc.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
