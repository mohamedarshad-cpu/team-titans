import React, { useState } from 'react';
import { MedicalCase, UploadedMedicalDoc, TimelineStep, DocumentCheckItem } from '../types/carefund';
import { STATES_AND_UT, POPULAR_HOSPITALS } from '../data/locations';
import { formatINR } from '../data/mockCases';
import { DocumentUploadCard } from './DocumentUploadCard';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { useLanguage } from '../i18n/LanguageContext';
import {
  User,
  Stethoscope,
  Calculator,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  Lock,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Edit3,
  FileText,
  Eye,
  Check,
  Info,
} from 'lucide-react';

interface PatientSubmissionWizardProps {
  onSubmitSuccess: (newCase: MedicalCase) => void;
  onCancel?: () => void;
  onViewCaseInPortal?: (caseItem: MedicalCase) => void;
}

export const PatientSubmissionWizard: React.FC<PatientSubmissionWizardProps> = ({
  onSubmitSuccess,
  onCancel,
  onViewCaseInPortal,
}) => {
  const { t, language } = useLanguage();

  // Wizard Step: 1 = Details, 2 = Treatment, 3 = Financial, 4 = Documents, 5 = Review, 6 = Submitted
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<UploadedMedicalDoc | null>(null);

  // Form Fields - Step 1: Patient Information
  const [fullName, setFullName] = useState('Kavitha R.');
  const [patientAge, setPatientAge] = useState('34');
  const [patientDob, setPatientDob] = useState('1992-05-14');
  const [gender, setGender] = useState('Female');
  const [mobileNumber, setMobileNumber] = useState('98401 23456');
  const [emailAddress, setEmailAddress] = useState('kavitha.family@gmail.com');
  const [submittedFor, setSubmittedFor] = useState<'Myself' | 'Parent' | 'Child' | 'Spouse' | 'Family Member' | 'Other'>('Myself');

  // Location Fields - Step 1
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [cityTown, setCityTown] = useState('Greams Road');

  // Form Fields - Step 2: Treatment Information
  const [treatment, setTreatment] = useState('Mitral Valve Replacement Surgery');
  const [treatmentCategory, setTreatmentCategory] = useState<
    'Cardiac' | 'Oncology' | 'Pediatric' | 'Trauma & Ortho' | 'Transplant' | 'Emergency'
  >('Cardiac');
  const [hospitalName, setHospitalName] = useState('Apollo Hospitals');
  const [hospitalLocation, setHospitalLocation] = useState('Greams Road, Thousand Lights, Chennai');
  const [doctorOrDept, setDoctorOrDept] = useState('Dr. S. Murali, Department of Cardiothoracic Surgery');
  const [treatmentDate, setTreatmentDate] = useState('2026-10-24');
  const [isEmergency, setIsEmergency] = useState<boolean>(false);
  const [shortDescription, setShortDescription] = useState(
    'Severe mitral valve regurgitation requiring urgent artificial valve replacement. Scheduled for admission at Apollo Hospitals.'
  );

  // Form Fields - Step 3: Financial Details
  const [totalCost, setTotalCost] = useState('480000');
  const [insurance, setInsurance] = useState('150000');
  const [govtSupport, setGovtSupport] = useState('100000');
  const [hospitalAid, setHospitalAid] = useState('30000');
  const [familySavings, setFamilySavings] = useState('50000');

  // Form Fields - Step 4: Medical Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedMedicalDoc>>({
    medical_cert: {
      id: 'medical_cert',
      category: 'Medical Certificate',
      name: 'Apollo_Cardiology_Admission_Certificate.pdf',
      fileType: 'PDF',
      size: '1.2 MB',
      uploadDate: '08 Oct 2026',
      isRequired: true,
      status: 'Uploaded',
      description: 'Medical certificate issued by Dr. S. Murali confirming mitral valve replacement schedule.',
    },
    hospital_estimate: {
      id: 'hospital_estimate',
      category: 'Hospital Estimate',
      name: 'Apollo_Greams_Itemized_Estimate_Slip.pdf',
      fileType: 'PDF',
      size: '950 KB',
      uploadDate: '08 Oct 2026',
      isRequired: true,
      status: 'Uploaded',
      description: 'Official Apollo Hospitals schedule of charges including ICU bed and valve prosthesis.',
    },
  });

  // Step 4: Document Confirmation Declaration
  const [genuineConfirmed, setGenuineConfirmed] = useState(true);

  // Step 5: Final User Confirmation Checkboxes
  const [accurateInfoConfirmed, setAccurateInfoConfirmed] = useState(true);
  const [reviewConsentConfirmed, setReviewConsentConfirmed] = useState(true);
  const [authorizedCheckConsentConfirmed, setAuthorizedCheckConsentConfirmed] = useState(true);

  // Form Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Created Case State after submission
  const [createdCase, setCreatedCase] = useState<MedicalCase | null>(null);

  // Mathematical Funding Gap calculation
  const numCost = Number(totalCost) || 0;
  const numIns = Number(insurance) || 0;
  const numGovt = Number(govtSupport) || 0;
  const numHosp = Number(hospitalAid) || 0;
  const numFam = Number(familySavings) || 0;
  const calculatedGap = Math.max(0, numCost - (numIns + numGovt + numHosp + numFam));

  // Find districts for selected state
  const currentStateData = STATES_AND_UT.find((s) => s.name === selectedState) || STATES_AND_UT[0];
  const currentDistrictData = currentStateData.districts.find((d) => d.name === selectedDistrict) || currentStateData.districts[0];

  // Validation functions
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Patient full name is required';
    if (!patientAge.trim() || isNaN(Number(patientAge))) errs.patientAge = 'Valid patient age is required';
    if (!mobileNumber.trim()) errs.mobileNumber = 'Mobile number is required for verification contact';
    if (!selectedDistrict) errs.district = 'Please select a district';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!treatment.trim()) errs.treatment = 'Treatment or medical condition is required';
    if (!hospitalName.trim()) errs.hospitalName = 'Hospital name is required';
    if (!doctorOrDept.trim()) errs.doctorOrDept = 'Doctor or clinical department is required';
    if (!shortDescription.trim()) errs.shortDescription = 'Brief description of medical assistance is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (numCost <= 0) errs.totalCost = 'Total estimated cost must be greater than zero';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs: Record<string, string> = {};
    if (!uploadedDocs['medical_cert']) {
      errs.medical_cert = 'Medical Certificate / Treatment Certificate is required.';
    }
    if (!uploadedDocs['hospital_estimate']) {
      errs.hospital_estimate = 'Hospital Estimate / Cost Estimate is required.';
    }
    if (!genuineConfirmed) {
      errs.genuine = 'Please confirm that the uploaded documents are genuine.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs: Record<string, string> = {};
    if (!accurateInfoConfirmed) {
      errs.accurate = 'You must confirm that the provided information is correct.';
    }
    if (!reviewConsentConfirmed) {
      errs.reviewConsent = 'You must understand that CareFund reviews documents before approval.';
    }
    if (!authorizedCheckConsentConfirmed) {
      errs.authorizedCheck = 'You must agree to verification by authorized reviewers.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !validateStep4()) return;
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleUploadDoc = (doc: UploadedMedicalDoc) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [doc.id]: doc,
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[doc.id];
      return copy;
    });
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Submission handler
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep5()) return;

    // Generate unique Case ID matching CareFund Chennai pattern: CF-CHN-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const districtCode = selectedDistrict.slice(0, 3).toUpperCase();
    const newCaseId = `CF-${districtCode}-2026-${randomSuffix}`;

    const currentDateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    // Convert uploaded docs into CareFund document checks
    const docCheckItems: DocumentCheckItem[] = Object.values(uploadedDocs).map((doc) => ({
      name: doc.name,
      status: 'Pending',
      note: `Uploaded by patient user on ${currentDateStr}. AI screening in progress.`,
    }));

    // 4-Step Timeline definition
    const initialTimeline: TimelineStep[] = [
      {
        stepNumber: 1,
        title: 'Information Submitted',
        status: 'Completed',
        date: currentDateStr,
        explanation: 'Patient details, treatment estimate, and medical documents received.',
        reviewerRole: 'Patient / Family',
      },
      {
        stepNumber: 2,
        title: 'AI Check Completed',
        status: 'In Progress',
        date: currentDateStr,
        explanation: 'CareFund AI is checking submitted files for completeness, readability, and arithmetic consistency.',
        reviewerRole: 'Automated AI Assistant',
      },
      {
        stepNumber: 3,
        title: 'Human Review',
        status: 'Upcoming',
        explanation: 'Authorized clinical liaison from hospital desk will verify patient order and treatment charges.',
        reviewerRole: 'Authorized Clinical Desk',
      },
      {
        stepNumber: 4,
        title: 'Final Decision',
        status: 'Upcoming',
        explanation: 'Authorized human reviewer makes the final binding decision. AI only assists.',
        reviewerRole: 'Authorized Auditor',
      },
    ];

    const newCase: MedicalCase = {
      id: newCaseId,
      patientName: fullName,
      patientAge: Number(patientAge),
      patientGender: gender,
      mobileNumber,
      emailAddress,
      dob: patientDob,
      relationshipToPatient: submittedFor,
      submittedFor,
      state: selectedState,
      district: selectedDistrict,
      city: cityTown,
      treatment,
      treatmentCategory,
      hospital: hospitalName,
      hospitalAddress: hospitalLocation,
      doctorOrDepartment: doctorOrDept,
      treatmentDate,
      isEmergency,
      diagnosisSummary: shortDescription,
      patientStory: shortDescription,
      fourStepStage: 1,
      status: 'Information Submitted',

      // Financials
      totalTreatmentCost: numCost,
      insuranceConfirmed: numIns,
      governmentSupportConfirmed: numGovt,
      hospitalAssistance: numHosp,
      familyContribution: numFam,
      existingDonations: 0,
      verifiedFundingGap: calculatedGap,
      alreadyRaised: 0,
      stillNeeded: calculatedGap,

      // Verification metadata
      verifiedByTitle: 'Pending Hospital Review',
      verifierName: `${hospitalName} Clinical Liaison`,
      verificationDate: currentDateStr,
      verificationReference: `CF-REF-${newCaseId}`,
      hospitalAccountReference: `Axis Bank Escrow #${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,

      aiScreeningState: 'In Progress',
      humanReviewState: 'Pending',
      finalDecisionState: 'Not yet decided',

      aiAssistance: {
        checkedSummary: 'Initial check: All required documents present. No missing files. Arithmetic checked.',
        checkedItems: [
          'Medical Certificate presence verified',
          'Hospital Estimate Letter uploaded',
          'Financial gap arithmetic verified (100% match)',
          'Patient identity and mobile contact logged',
        ],
        possibleInconsistencies: [],
        supportingInformation: [
          `Hospital: ${hospitalName} (${hospitalLocation})`,
          `Estimated Cost: ₹${numCost.toLocaleString()} | Verified Gap: ₹${calculatedGap.toLocaleString()}`,
        ],
        confidenceExplanation: 'AI assists. Humans decide. Ready for Step 3 Authorized Human Review.',
      },
      humanDecisions: [],
      timeline: initialTimeline,
      documentChecks: docCheckItems,
      uploadedMedicalDocs: Object.values(uploadedDocs),
      hasInconsistency: false,
      userDeclarations: {
        genuineConfirmed,
        accurateInfoConfirmed,
        reviewConsentConfirmed,
        authorizedCheckConsentConfirmed,
      },
      hospitalEscrowDetails: {
        accountName: `${hospitalName} Enterprise Healthcare Escrow`,
        bankName: 'Axis Bank, Commercial Branch',
        accountNumber: '92102008391823',
        ifscCode: 'UTIB0000142',
        escrowReference: `ESC-${newCaseId}`,
      },
    };

    setCreatedCase(newCase);
    onSubmitSuccess(newCase);
    setCurrentStep(6);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        onRemove={(id) => handleRemoveDoc(id)}
        onReplaceClick={(id) => {
          setPreviewDoc(null);
        }}
      />

      {/* Wizard Header and Progress Stepper */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="cf-title text-neutral-900 tracking-tight">
              Medical Assistance Request
            </h1>
            <p className="cf-body text-neutral-600 mt-1 text-sm">
              User-first medical funding submission with transparent 4-step human verification.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 text-white shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI assists · Humans decide</span>
          </div>
        </div>

        {/* 6-Phase User-First Breadcrumb Flow */}
        <div className="mt-6 p-3 bg-white rounded-xl border border-neutral-200 overflow-x-auto shadow-xs">
          <div className="flex items-center min-w-[620px] justify-between text-xs">
            {[
              { num: 1, label: 'Patient Details' },
              { num: 2, label: 'Treatment' },
              { num: 3, label: 'Financials' },
              { num: 4, label: 'Upload Documents' },
              { num: 5, label: 'Review All' },
              { num: 6, label: 'Submit & AI Review' },
            ].map((st, idx) => {
              const isPast = currentStep > st.num;
              const isCurrent = currentStep === st.num;

              return (
                <React.Fragment key={st.num}>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isPast
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : st.num}
                    </span>
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? 'text-red-700'
                          : isPast
                          ? 'text-neutral-900'
                          : 'text-neutral-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                  {idx < 5 && (
                    <div
                      className={`h-[2px] flex-1 mx-2 ${
                        currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1: ENTER PATIENT DETAILS & LOCATION                       */}
      {/* ============================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="cf-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="cf-card-heading text-neutral-900 text-base font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                <span>Patient Information</span>
              </h3>
              <p className="cf-secondary text-xs text-neutral-500 mt-1">
                Enter primary details for the patient requiring financial assistance.
              </p>
            </div>

            {/* Relationship Question */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <label className="cf-label block font-semibold text-neutral-900">
                Who are you submitting this request for?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                {(['Myself', 'Parent', 'Child', 'Spouse', 'Family Member', 'Other'] as const).map(
                  (rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setSubmittedFor(rel)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                        submittedFor === rel
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {rel}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label block mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kavitha Ramanathan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`cf-input text-sm ${errors.fullName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="cf-label block mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 34"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className={`cf-input text-sm ${errors.patientAge ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                  {errors.patientAge && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.patientAge}</p>
                  )}
                </div>

                <div>
                  <label className="cf-label block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="cf-input text-sm"
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="cf-label block mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98401 23456"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={`cf-input pl-9 text-sm ${errors.mobileNumber ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="cf-label block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="kavitha.family@gmail.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="cf-input pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location Section - Tamil Nadu (38 districts) & Puducherry */}
            <div className="border-t border-neutral-100 pt-5 space-y-4">
              <div>
                <h4 className="cf-card-heading text-neutral-900 text-sm font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>Patient Location & Residence</span>
                </h4>
                <p className="cf-secondary text-xs text-neutral-500 mt-0.5">
                  Select state and district to route case to the nearest hospital network liaison desk.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="cf-label block mb-1">State / Union Territory</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      const newState = e.target.value;
                      setSelectedState(newState);
                      const stateObj = STATES_AND_UT.find((s) => s.name === newState);
                      if (stateObj && stateObj.districts[0]) {
                        setSelectedDistrict(stateObj.districts[0].name);
                        setCityTown(stateObj.districts[0].cities[0] || stateObj.districts[0].name);
                      }
                    }}
                    className="cf-input text-sm font-semibold"
                  >
                    <option value="Tamil Nadu">Tamil Nadu (38 Districts)</option>
                    <option value="Puducherry">Puducherry (4 Districts)</option>
                  </select>
                </div>

                <div>
                  <label className="cf-label block mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setSelectedDistrict(newDist);
                      const distObj = currentStateData.districts.find((d) => d.name === newDist);
                      if (distObj && distObj.cities[0]) {
                        setCityTown(distObj.cities[0]);
                      }
                    }}
                    className="cf-input text-sm"
                  >
                    {currentStateData.districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.district}</p>
                  )}
                </div>

                <div>
                  <label className="cf-label block mb-1">City / Town / Area</label>
                  <input
                    type="text"
                    value={cityTown}
                    onChange={(e) => setCityTown(e.target.value)}
                    placeholder="e.g. Greams Road, Thousand Lights"
                    className="cf-input text-sm"
                    list="city-suggestions"
                  />
                  <datalist id="city-suggestions">
                    {currentDistrictData.cities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleNext}
              className="cf-btn-primary text-sm py-2.5 px-6 cursor-pointer"
            >
              <span>Continue to Treatment Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: MEDICAL / TREATMENT DETAILS                            */}
      {/* ============================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="cf-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="cf-card-heading text-neutral-900 text-base font-bold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-red-600" />
                <span>Treatment Information</span>
              </h3>
              <p className="cf-secondary text-xs text-neutral-500 mt-1">
                Enter diagnosis and hospital details. Do not enter unnecessary sensitive medical information.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="cf-label block mb-1">
                  Treatment / Medical Condition <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mitral Valve Replacement Surgery, Chemotherapy, Pediatric ASD Repair"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className={`cf-input text-sm ${errors.treatment ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.treatment && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.treatment}</p>
                )}
              </div>

              <div>
                <label className="cf-label block mb-1">Clinical Category</label>
                <select
                  value={treatmentCategory}
                  onChange={(e) => setTreatmentCategory(e.target.value as any)}
                  className="cf-input text-sm"
                >
                  <option value="Cardiac">Cardiac</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pediatric">Pediatric</option>
                  <option value="Trauma & Ortho">Trauma & Ortho</option>
                  <option value="Transplant">Transplant</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="cf-label block mb-1">Emergency Treatment?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEmergency(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-colors ${
                      !isEmergency
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    No (Scheduled)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEmergency(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-colors ${
                      isEmergency
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    Yes (Emergency)
                  </button>
                </div>
              </div>

              <div>
                <label className="cf-label block mb-1">
                  Hospital Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Hospitals"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className={`cf-input text-sm ${errors.hospitalName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  list="hospital-suggestions"
                />
                <datalist id="hospital-suggestions">
                  {POPULAR_HOSPITALS.map((h) => (
                    <option key={h.name} value={h.name}>
                      {h.location}
                    </option>
                  ))}
                </datalist>
                {errors.hospitalName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.hospitalName}</p>
                )}
              </div>

              <div>
                <label className="cf-label block mb-1">Hospital Location / Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Greams Road, Thousand Lights, Chennai"
                  value={hospitalLocation}
                  onChange={(e) => setHospitalLocation(e.target.value)}
                  className="cf-input text-sm"
                />
              </div>

              <div>
                <label className="cf-label block mb-1">
                  Doctor / Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. S. Murali, Cardiothoracic Surgery"
                  value={doctorOrDept}
                  onChange={(e) => setDoctorOrDept(e.target.value)}
                  className={`cf-input text-sm ${errors.doctorOrDept ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.doctorOrDept && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.doctorOrDept}</p>
                )}
              </div>

              <div>
                <label className="cf-label block mb-1">Treatment / Admission Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={treatmentDate}
                    onChange={(e) => setTreatmentDate(e.target.value)}
                    className="cf-input pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="cf-label block mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-neutral-500 mb-1">
                  Briefly explain the treatment or medical assistance required.
                </p>
                <textarea
                  rows={3}
                  placeholder="Explain diagnosis, doctor recommendation, and urgency..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={`cf-input text-sm ${errors.shortDescription ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.shortDescription && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.shortDescription}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="cf-btn-secondary text-sm py-2.5 px-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="cf-btn-primary text-sm py-2.5 px-6 cursor-pointer"
            >
              <span>Continue to Financials</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: FINANCIAL DETAILS & LIVE FUNDING GAP                   */}
      {/* ============================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="cf-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="cf-card-heading text-neutral-900 text-base font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-red-600" />
                <span>Financial Information & Funding Gap</span>
              </h3>
              <p className="cf-secondary text-xs text-neutral-500 mt-1">
                CareFund calculates an exact funding gap after accounting for insurance, government schemes, and family contributions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="cf-label block mb-1">
                  Total Estimated Treatment Cost (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className="cf-input text-base font-bold text-neutral-900"
                />
                {errors.totalCost && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.totalCost}</p>
                )}
              </div>

              <div>
                <label className="cf-label block mb-1">Insurance Coverage (₹)</label>
                <p className="text-[11px] text-neutral-500 mb-1">Private medical insurance (e.g. Star Health, Care Health)</p>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="cf-input text-sm text-neutral-800"
                />
              </div>

              <div>
                <label className="cf-label block mb-1">Government Support (₹)</label>
                <p className="text-[11px] text-neutral-500 mb-1">CMCHIS (Tamil Nadu) / PMJAY / Ayushman Bharat</p>
                <input
                  type="number"
                  value={govtSupport}
                  onChange={(e) => setGovtSupport(e.target.value)}
                  className="cf-input text-sm text-neutral-800"
                />
              </div>

              <div>
                <label className="cf-label block mb-1">Hospital Philanthropic Aid (₹)</label>
                <p className="text-[11px] text-neutral-500 mb-1">Concessions or charity trust discount from hospital</p>
                <input
                  type="number"
                  value={hospitalAid}
                  onChange={(e) => setHospitalAid(e.target.value)}
                  className="cf-input text-sm text-neutral-800"
                />
              </div>

              <div>
                <label className="cf-label block mb-1">Family Savings & Contribution (₹)</label>
                <p className="text-[11px] text-neutral-500 mb-1">Direct contribution family can afford to pay</p>
                <input
                  type="number"
                  value={familySavings}
                  onChange={(e) => setFamilySavings(e.target.value)}
                  className="cf-input text-sm text-neutral-800"
                />
              </div>
            </div>

            {/* Live Transparent Gap Calculation Result */}
            <div className="p-5 bg-neutral-900 text-white rounded-xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs text-neutral-300 font-semibold uppercase tracking-wider block">
                    Verified Community Funding Gap
                  </span>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    ₹{numCost.toLocaleString()} - (₹{numIns.toLocaleString()} + ₹{numGovt.toLocaleString()} + ₹{numHosp.toLocaleString()} + ₹{numFam.toLocaleString()})
                  </p>
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                  {formatINR(calculatedGap)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800 leading-relaxed">
                This exact amount will be ring-fenced for crowdfunding. 100% of received donations are settled directly into the hospital escrow account.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="cf-btn-secondary text-sm py-2.5 px-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="cf-btn-primary text-sm py-2.5 px-6 cursor-pointer"
            >
              <span>Continue to Upload Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 4: UPLOAD MEDICAL DOCUMENTS                               */}
      {/* ============================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="cf-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="cf-card-heading text-neutral-900 text-lg font-bold flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-red-600" />
                  <span>Upload Medical Documents</span>
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-100 text-neutral-700">
                  Accepted: PDF, JPG, JPEG, PNG (Max 10 MB)
                </span>
              </div>
              <p className="cf-secondary text-xs text-neutral-600 mt-1">
                Upload documents that help us verify your treatment and financial assistance request.
              </p>
            </div>

            {/* Privacy Notification Banner (Rule 17) */}
            <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-xs">
                  Your Medical Documents Are Private
                </p>
                <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                  Your uploaded medical documents are available only to authorized reviewers and verified hospital staff when required. Donors never see private medical reports, prescriptions, or contact details.
                </p>
              </div>
            </div>

            {/* Checklist Progress Overview (Rule 9) */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <h4 className="cf-card-heading text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Document Checklist
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {uploadedDocs['medical_cert'] ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-neutral-400">○</span>
                  )}
                  <span className={uploadedDocs['medical_cert'] ? 'font-semibold text-neutral-900' : 'text-neutral-600'}>
                    Medical Certificate (Required)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedDocs['hospital_estimate'] ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-neutral-400">○</span>
                  )}
                  <span className={uploadedDocs['hospital_estimate'] ? 'font-semibold text-neutral-900' : 'text-neutral-600'}>
                    Hospital Estimate (Required)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedDocs['prescription'] ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-neutral-400">○</span>
                  )}
                  <span className={uploadedDocs['prescription'] ? 'font-semibold text-neutral-900' : 'text-neutral-600'}>
                    Prescription / Medical Report (Optional)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {uploadedDocs['insurance_doc'] ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-neutral-400">○</span>
                  )}
                  <span className={uploadedDocs['insurance_doc'] ? 'font-semibold text-neutral-900' : 'text-neutral-600'}>
                    Insurance Document (Optional)
                  </span>
                </div>
              </div>
            </div>

            {/* REQUIRED DOCUMENTS SECTION (Rule 5 & 6) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h4 className="text-sm font-bold text-neutral-900">
                  Required Documents <span className="text-red-500">*</span>
                </h4>
                <span className="text-xs text-neutral-500">Must be provided for verification</span>
              </div>

              {/* 1. Medical Certificate */}
              <DocumentUploadCard
                id="medical_cert"
                category="Medical Certificate"
                title="Medical Certificate / Treatment Certificate"
                description="Upload a clear medical certificate issued by the hospital or authorized doctor confirming diagnosis and treatment necessity."
                isRequired={true}
                uploadedDoc={uploadedDocs['medical_cert']}
                demoFileName="Apollo_Medical_Treatment_Certificate.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />
              {errors.medical_cert && (
                <p className="text-[11px] text-red-600 -mt-2">{errors.medical_cert}</p>
              )}

              {/* 2. Hospital Estimate */}
              <DocumentUploadCard
                id="hospital_estimate"
                category="Hospital Estimate"
                title="Hospital Estimate / Cost Estimate"
                description="Upload official itemized treatment estimate on hospital letterhead with seal and procedure charges."
                isRequired={true}
                uploadedDoc={uploadedDocs['hospital_estimate']}
                demoFileName="Apollo_Surgery_Cost_Estimate_Letterhead.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />
              {errors.hospital_estimate && (
                <p className="text-[11px] text-red-600 -mt-2">{errors.hospital_estimate}</p>
              )}
            </div>

            {/* ADDITIONAL DOCUMENTS SECTION */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h4 className="text-sm font-bold text-neutral-900">
                  Additional Supporting Documents (Optional)
                </h4>
                <span className="text-xs text-neutral-500">Helps expedite human review</span>
              </div>

              {/* 3. Prescription / Medical Report */}
              <DocumentUploadCard
                id="prescription"
                category="Prescription / Report"
                title="Prescription / Medical Report"
                description="Upload doctor prescription slip, diagnostic pathology, or Echo ultrasound report."
                isRequired={false}
                uploadedDoc={uploadedDocs['prescription']}
                demoFileName="Echocardiogram_Diagnostic_Imaging_Report.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />

              {/* 4. Insurance Document */}
              <DocumentUploadCard
                id="insurance_doc"
                category="Insurance Policy"
                title="Insurance Document"
                description="Upload health insurance policy letter, cashless pre-auth slip, or denial statement."
                isRequired={false}
                uploadedDoc={uploadedDocs['insurance_doc']}
                demoFileName="Star_Health_Policy_PreAuth_Letter.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />

              {/* 5. Government Assistance Document */}
              <DocumentUploadCard
                id="govt_doc"
                category="Govt Scheme Card"
                title="Government Assistance Document"
                description="Upload CMCHIS Smart Card, PMJAY Beneficiary card, or BPL ration card."
                isRequired={false}
                uploadedDoc={uploadedDocs['govt_doc']}
                demoFileName="CMCHIS_Beneficiary_Smart_Card.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />

              {/* 6. Other Supporting Document */}
              <DocumentUploadCard
                id="other_doc"
                category="Supporting Proof"
                title="Other Supporting Document"
                description="Any additional financial proof, hospital admission order, or NGO sponsorship record."
                isRequired={false}
                uploadedDoc={uploadedDocs['other_doc']}
                demoFileName="Patient_Income_Certificate_VRO.pdf"
                onUpload={handleUploadDoc}
                onRemove={handleRemoveDoc}
                onViewPreview={(d) => setPreviewDoc(d)}
              />
            </div>

            {/* Patient Document Genuine Confirmation Checkbox (Rule 10) */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <h4 className="cf-card-heading text-xs font-bold text-neutral-900">
                Check Your Documents
              </h4>
              <p className="text-xs text-neutral-600">
                Please make sure the uploaded documents are clear, readable and belong to the correct patient.
              </p>
              <label className="flex items-start gap-2.5 pt-2 text-xs text-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genuineConfirmed}
                  onChange={(e) => setGenuineConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span className="leading-snug font-medium">
                  I confirm that the uploaded documents are genuine and belong to this assistance request.
                </span>
              </label>
              {errors.genuine && (
                <p className="text-[11px] text-red-600">{errors.genuine}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="cf-btn-secondary text-sm py-2.5 px-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="cf-btn-primary text-sm py-2.5 px-6 cursor-pointer"
            >
              <span>Review All Information</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 5: REVIEW ALL INFORMATION & PATIENT CONFIRMATION          */}
      {/* ============================================================== */}
      {currentStep === 5 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="cf-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="cf-title text-neutral-900 text-xl font-bold">
                Review Your Assistance Request
              </h3>
              <p className="cf-body text-xs text-neutral-600 mt-1">
                Please review your patient details, treatment information, financial information and uploaded documents before submitting.
              </p>
            </div>

            {/* Section 1: Patient Details */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <h4 className="cf-card-heading text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-red-600" />
                  <span>Patient Details</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Patient Name</span>
                  <span className="font-semibold text-neutral-900">{fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Age & Gender</span>
                  <span className="font-semibold text-neutral-900">
                    {patientAge} years · {gender}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Relationship</span>
                  <span className="font-semibold text-neutral-900">{submittedFor}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Location</span>
                  <span className="font-semibold text-neutral-900">
                    {cityTown}, {selectedDistrict}, {selectedState}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Mobile Number</span>
                  <span className="font-semibold text-neutral-900 font-mono">{mobileNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Email Address</span>
                  <span className="font-semibold text-neutral-900 truncate block">
                    {emailAddress || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Treatment Details */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <h4 className="cf-card-heading text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-red-600" />
                  <span>Treatment Details</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Treatment</span>
                  <span className="font-semibold text-neutral-900">{treatment}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Hospital</span>
                  <span className="font-semibold text-neutral-900">{hospitalName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Doctor / Dept</span>
                  <span className="font-semibold text-neutral-900">{doctorOrDept}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Treatment Date</span>
                  <span className="font-semibold text-neutral-900">{treatmentDate}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Emergency Status</span>
                  <span
                    className={`font-semibold ${
                      isEmergency ? 'text-red-700 font-bold' : 'text-neutral-700'
                    }`}
                  >
                    {isEmergency ? 'Yes (Emergency)' : 'No (Scheduled)'}
                  </span>
                </div>
              </div>

              <div className="text-xs pt-1 border-t border-neutral-100">
                <span className="text-neutral-500 block text-[11px]">Clinical Description:</span>
                <p className="text-neutral-700 mt-0.5">{shortDescription}</p>
              </div>
            </div>

            {/* Section 3: Financial Details */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <h4 className="cf-card-heading text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-600" />
                  <span>Financial Details & Funding Gap</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Total Treatment Cost</span>
                  <span className="font-bold text-neutral-900 text-sm">{formatINR(numCost)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Insurance Coverage</span>
                  <span className="font-semibold text-neutral-800">{formatINR(numIns)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Government Scheme</span>
                  <span className="font-semibold text-neutral-800">{formatINR(numGovt)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Hospital Concession</span>
                  <span className="font-semibold text-neutral-800">{formatINR(numHosp)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Family Contribution</span>
                  <span className="font-semibold text-neutral-800">{formatINR(numFam)}</span>
                </div>
                <div>
                  <span className="text-red-600 font-semibold block text-[11px]">Net Verified Funding Gap</span>
                  <span className="font-extrabold text-red-700 text-sm">{formatINR(calculatedGap)}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Uploaded Documents */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2">
                <h4 className="cf-card-heading text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>Uploaded Medical Documents ({Object.keys(uploadedDocs).length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit / Upload More</span>
                </button>
              </div>

              <div className="space-y-2">
                {Object.values(uploadedDocs).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">{doc.name}</p>
                        <p className="text-[11px] text-neutral-500">
                          {doc.category} · {doc.fileType} · {doc.size}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL USER CONFIRMATION SECTION (Rule 12) */}
            <div className="p-5 bg-red-50/40 rounded-xl border border-red-200 space-y-3">
              <h4 className="cf-card-heading text-neutral-900 font-bold text-sm">
                Ready to Submit?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Please review your patient details, treatment information, financial information and uploaded documents before submitting.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <label className="flex items-start gap-2.5 text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accurateInfoConfirmed}
                    onChange={(e) => setAccurateInfoConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>
                    I confirm that the information I provided is correct to the best of my knowledge.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewConsentConfirmed}
                    onChange={(e) => setReviewConsentConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>
                    I understand that CareFund will review my documents before assistance is approved.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={authorizedCheckConsentConfirmed}
                    onChange={(e) => setAuthorizedCheckConsentConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span>
                    I agree to verification of the submitted information by authorized reviewers.
                  </span>
                </label>
              </div>

              {(errors.accurate || errors.reviewConsent || errors.authorizedCheck) && (
                <div className="p-2.5 bg-red-100/70 border border-red-200 rounded text-[11px] text-red-700 space-y-0.5">
                  <p>Please check all three declarations to submit your request.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="cf-btn-secondary text-sm py-2.5 px-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="cf-btn-primary text-sm py-3 px-8 font-bold cursor-pointer shadow-md"
            >
              <span>Submit Assistance Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* STEP 6: AFTER SUBMISSION — UNIQUE CASE ID & AI REVIEW          */}
      {/* ============================================================== */}
      {currentStep === 6 && createdCase && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Success Banner (Rule 13) */}
          <div className="cf-card p-6 sm:p-8 text-center space-y-4 border-emerald-200 bg-emerald-50/20 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                Request Submitted Successfully
              </h2>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs font-semibold text-neutral-600">Unique Case ID:</span>
                <span className="font-mono text-base font-extrabold text-neutral-900 bg-white px-3 py-1 rounded-lg border border-neutral-300 shadow-2xs">
                  {createdCase.id}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Status: Submitted
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Your assistance request has been assigned reference <strong className="font-mono">{createdCase.id}</strong>. CareFund is now checking your submitted information and documents.
            </p>

            {/* Next Step Box */}
            <div className="p-3.5 bg-white rounded-xl border border-neutral-200 max-w-md mx-auto text-xs text-neutral-700 space-y-1">
              <span className="font-bold text-neutral-900 block text-xs">Next Step:</span>
              <p>
                CareFund will now check your submitted information and documents. An authorized clinical reviewer from {createdCase.hospital} will examine your records.
              </p>
            </div>
          </div>

          {/* Patient 7-Step Progress Tracker (Rule 16) */}
          <div className="cf-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="cf-card-heading text-neutral-900 font-bold text-sm">
                  My Assistance Request Progress
                </h3>
                <p className="cf-secondary text-xs text-neutral-500">
                  Track real-time status of your submission and reviewer verification.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-800">
                {createdCase.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-700 font-bold block">✓ Patient Details Submitted</span>
                <p className="text-neutral-600 text-[11px]">{createdCase.patientName}, {createdCase.patientAge}y</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-700 font-bold block">✓ Documents Uploaded</span>
                <p className="text-neutral-600 text-[11px]">
                  {createdCase.documentChecks.length} medical files stored securely
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-700 font-bold block">✓ Patient Review Completed</span>
                <p className="text-neutral-600 text-[11px]">Self-declaration verified</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-700 font-bold block">✓ Request Submitted</span>
                <p className="text-neutral-600 text-[11px]">Logged in hospital portal</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>● AI Review (Active)</span>
                </div>
                <p className="text-neutral-600 text-[11px]">
                  Checking files for completeness and mathematical accuracy.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 opacity-80">
                <span className="text-neutral-600 font-bold block">○ Human Review (Upcoming)</span>
                <p className="text-neutral-500 text-[11px]">
                  Hospital clinical desk and CareFund auditor review.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 opacity-80">
                <span className="text-neutral-600 font-bold block">○ Final Decision (Upcoming)</span>
                <p className="text-neutral-500 text-[11px]">
                  Authorized human reviewer makes final decision.
                </p>
              </div>
            </div>
          </div>

          {/* AI Review Report Card (Rule 14 & 15) */}
          <div className="cf-card p-6 space-y-4 bg-linear-to-b from-white to-neutral-50/50">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <h3 className="cf-card-heading text-neutral-900 font-bold text-sm">
                  AI Review
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
                AI assists · Humans decide
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1.5">
              <p className="font-semibold text-neutral-900">
                CareFund is checking the submitted information for possible missing or inconsistent details.
              </p>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                CareFund AI automatically checks file readability, procedure date consistency, patient name match, and mathematical gap calculations. <strong>AI does NOT decide whether a medical certificate is genuine, and AI never approves or rejects requests.</strong>
              </p>
            </div>

            {/* Checklist of AI verifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Missing documents: All required documents uploaded</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Document readability: Text and headers legible</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Name consistency: Verified with admission sheet</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Funding gap formula: Mathematics confirmed (100% match)</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-100 rounded-lg text-xs text-neutral-600 flex items-center gap-2">
              <Info className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>
                Final Human Decision will be made by authorized clinical reviewers at Apollo Hospitals / CareFund Audit Desk.
              </span>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                // Reset form to submit another request
                setCurrentStep(1);
                setCreatedCase(null);
              }}
              className="cf-btn-secondary text-xs py-2 px-4 cursor-pointer"
            >
              <span>Submit Another Assistance Request</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onViewCaseInPortal) {
                  onViewCaseInPortal(createdCase);
                } else if (onCancel) {
                  onCancel();
                }
              }}
              className="cf-btn-primary text-xs py-2.5 px-6 font-bold cursor-pointer"
            >
              <span>View Case in Patient Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
