import React, { useState, useEffect } from 'react';
import { MedicalCase, UploadedMedicalDoc } from '../types/carefund';
import { formatINR, calculateFundingMetrics } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { VerificationTimeline } from '../components/VerificationTimeline';
import { PrivacyNoticeCard } from '../components/PrivacyNoticeCard';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import { FourStepReviewStepper } from '../components/FourStepReviewStepper';
import { PatientSubmissionWizard } from '../components/PatientSubmissionWizard';
import { AuthenticatedUser } from './SignInGatewayView';
import { PatientDocumentRecord, savePatientDocument, getPatientDocuments, PatientCaseProfile, savePatientCaseProfile, getPatientCaseProfile } from '../firebase';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import {
  FilePlus2,
  FolderHeart,
  FileText,
  CheckCircle2,
  Calculator,
  Bell,
  User,
  Building2,
  UploadCloud,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  PhoneCall,
  Check,
  Eye,
  Loader2,
} from 'lucide-react';

interface PatientPortalViewProps {
  cases: MedicalCase[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSubmitNewCase: (newCase: MedicalCase) => void;
  onUpdateCase: (updatedCase: MedicalCase) => void;
  currentUser?: AuthenticatedUser | null;
}

export const PatientPortalView: React.FC<PatientPortalViewProps> = ({
  cases,
  activeTab,
  onSelectTab,
  onSubmitNewCase,
  onUpdateCase,
  currentUser,
}) => {
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<MedicalCase | null>(null);

  // Document upload & persistence state
  const patientId = currentUser?.uid || 'patient_guest';
  const [patientDocs, setPatientDocs] = useState<PatientDocumentRecord[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedMedicalDoc | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [patientProfile, setPatientProfile] = useState<PatientCaseProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Spouse');

  const [diagnosis, setDiagnosis] = useState('');
  const [conditionSummary, setConditionSummary] = useState('');
  const [treatmentRequired, setTreatmentRequired] = useState('');
  const [surgeryRequired, setSurgeryRequired] = useState(true);
  const [treatmentDescription, setTreatmentDescription] = useState('');
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState('');
  const [expectedTreatmentDate, setExpectedTreatmentDate] = useState('');
  const [treatmentUrgency, setTreatmentUrgency] = useState('High');
  const [treatmentStatus, setTreatmentStatus] = useState('Pending Admission');
  const [previousTreatment, setPreviousTreatment] = useState('');

  const [hospitalName, setHospitalName] = useState('Apollo Hospitals, Greams Road, Chennai');
  const [hospitalAddress, setHospitalAddress] = useState('Greams Road, Thousand Lights, Chennai');
  const [hospitalCity, setHospitalCity] = useState('Chennai');
  const [hospitalState, setHospitalState] = useState('Tamil Nadu');
  const [department, setDepartment] = useState('Cardiothoracic Surgery');
  const [treatingDoctor, setTreatingDoctor] = useState('Dr. S. Murali');
  const [doctorDesignation, setDoctorDesignation] = useState('Senior Consultant');
  const [doctorContact, setDoctorContact] = useState('+91 44 2829 0200');
  const [admissionDate, setAdmissionDate] = useState('');
  const [expectedDischargeDate, setExpectedDischargeDate] = useState('');

  const [totalCostInput, setTotalCostInput] = useState('500000');
  const [familyContributionInput, setFamilyContributionInput] = useState('50000');
  const [insuranceInput, setInsuranceInput] = useState('100000');
  const [govtAssistanceInput, setGovtAssistanceInput] = useState('100000');
  const [otherAssistanceInput, setOtherAssistanceInput] = useState('0');

  const [hasGovernmentScheme, setHasGovernmentScheme] = useState(true);
  const [schemeName, setSchemeName] = useState('CMCHIS');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('100000');
  const [applicationStatus, setApplicationStatus] = useState('Submitted');
  const [assistanceReceived, setAssistanceReceived] = useState('0');
  const [remainingAssistance, setRemainingAssistance] = useState('100000');

  useEffect(() => {
    Promise.all([
      getPatientDocuments(patientId),
      getPatientCaseProfile(patientId),
    ]).then(([docs, profile]) => {
      setPatientDocs(docs);
      if (profile) setPatientProfile(profile);
      setIsLoadingDocs(false);
      setIsLoadingProfile(false);
    });
  }, [patientId]);

  const numCost = Number(totalCostInput) || 0;
  const numFamily = Number(familyContributionInput) || 0;
  const numIns = Number(insuranceInput) || 0;
  const numGovt = Number(govtAssistanceInput) || 0;
  const numOther = Number(otherAssistanceInput) || 0;
  const calculatedFundingRequired = Math.max(0, numCost - (numFamily + numIns + numGovt + numOther));

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !diagnosis.trim() || !treatmentRequired.trim()) {
      setOnboardingError('Please enter Full name, Diagnosis, and Treatment required.');
      return;
    }
    setOnboardingError(null);

    const profile: PatientCaseProfile = {
      patientId,
      fullName,
      dob,
      gender,
      phoneNumber,
      email,
      address,
      city,
      state: stateName,
      pincode,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      emergencyContactRelationship: emergencyRelation,
      diagnosis,
      conditionSummary,
      treatmentRequired,
      surgeryRequired,
      treatmentDescription,
      dateOfDiagnosis,
      expectedTreatmentDate,
      treatmentUrgency,
      treatmentStatus,
      previousTreatmentDetails: previousTreatment,
      hospitalName,
      hospitalAddress,
      hospitalCity,
      hospitalState,
      department,
      treatingDoctor,
      doctorDesignation,
      doctorContact,
      admissionDate,
      expectedDischargeDate,
      totalTreatmentCost: numCost,
      familyContribution: numFamily,
      insuranceCoverage: numIns,
      governmentAssistance: numGovt,
      otherFinancialAssistance: numOther,
      carefundFundingRequired: calculatedFundingRequired,
      hasGovernmentScheme,
      schemeName,
      beneficiaryId,
      approvedAmount: Number(approvedAmount) || 0,
      applicationStatus,
      assistanceReceived: Number(assistanceReceived) || 0,
      remainingAssistance: Number(remainingAssistance) || 0,
      caseStatus: 'Patient Information Submitted',
      hospitalVerificationStatus: 'Pending Hospital Verification',
      createdAt: new Date().toISOString(),
    };

    await savePatientCaseProfile(profile);
    setPatientProfile(profile);

    const newMedicalCase: MedicalCase = {
      id: `CF-${patientId.slice(0, 6).toUpperCase()}-2026`,
      patientName: fullName,
      patientAge: 35,
      patientGender: gender,
      treatment: treatmentRequired,
      treatmentCategory: 'Cardiac',
      hospital: hospitalName,
      hospitalAddress,
      city,
      state: stateName,
      fourStepStage: 1,
      diagnosisSummary: diagnosis || conditionSummary,
      patientStory: treatmentDescription || conditionSummary,
      status: 'Information Submitted',
      totalTreatmentCost: numCost,
      insuranceConfirmed: numIns,
      governmentSupportConfirmed: numGovt,
      hospitalAssistance: 0,
      familyContribution: numFamily,
      existingDonations: 0,
      verifiedFundingGap: calculatedFundingRequired,
      alreadyRaised: 0,
      stillNeeded: calculatedFundingRequired,
      verifiedByTitle: 'Pending Hospital Review',
      verifierName: treatingDoctor,
      verificationDate: new Date().toLocaleDateString(),
      verificationReference: `REF-${patientId}`,
      hospitalAccountReference: 'Axis Bank Escrow #92102008391823',
      aiScreeningState: 'In Progress',
      humanReviewState: 'Pending',
      finalDecisionState: 'Not yet decided',
      aiAssistance: {
        checkedSummary: 'Initial check in progress for patient submitted medical records.',
        checkedItems: ['Personal Details', 'Treatment Estimate'],
        possibleInconsistencies: [],
        supportingInformation: [],
        confidenceExplanation: 'AI assists. Humans decide.',
      },
      humanDecisions: [],
      documentChecks: [],
      hasInconsistency: false,
      admittedDate: admissionDate || '2026-10-08',
      dischargeExpected: expectedDischargeDate || '2026-10-25',
      clinicalSpecialist: `${treatingDoctor}, ${doctorDesignation}`,
      hospitalBedId: 'Ward 4B',
      timeline: [
        {
          stepNumber: 1,
          title: 'Information Submitted',
          status: 'Completed',
          date: new Date().toLocaleDateString(),
          explanation: 'Patient profile and medical case submitted successfully.',
          reviewerRole: fullName,
        },
      ],
      documents: [],
      hospitalEscrowDetails: {
        accountName: `${hospitalName} Escrow`,
        bankName: 'Axis Bank, Commercial Branch',
        accountNumber: '92102008391823',
        ifscCode: 'UTIB0000142',
        escrowReference: `ESC-${patientId}`,
      },
    };

    onSubmitNewCase(newMedicalCase);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed = ['pdf', 'jpg', 'jpeg', 'png'];

    if (!allowed.includes(ext)) {
      setUploadError('Document upload failed. Please try again.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Document upload failed. Please try again.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      const newRecord: PatientDocumentRecord = {
        id: `DOC-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        patientId,
        name: file.name,
        fileType: ext.toUpperCase(),
        size: sizeStr,
        uploadDate: dateStr,
        timestamp: Date.now(),
        dataUrl,
        verificationStatus: 'Pending Verification',
        uploadedBy: currentUser?.displayName || currentUser?.email || 'Patient / Family',
        status: 'Uploaded',
        category: 'Patient Uploaded Medical Document',
      };

      try {
        await savePatientDocument(newRecord);
        setPatientDocs((prev) => [newRecord, ...prev.filter(d => d.id !== newRecord.id)]);
        setUploadSuccess('Document uploaded successfully.');
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => setUploadSuccess(null), 4000);
      } catch (err) {
        setIsUploading(false);
        setUploadError('Document upload failed. Please try again.');
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      setUploadError('Document upload failed. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Active tracked case for patient
  const activeCase = cases.find((c) => c.id === 'CF-CHN-2026-00124') || cases[0];

  // Request Assistance Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [treatment, setTreatment] = useState('');
  const [treatmentCategory, setTreatmentCategory] = useState<
    'Cardiac' | 'Oncology' | 'Pediatric' | 'Trauma & Ortho' | 'Transplant' | 'Emergency'
  >('Cardiac');
  const [hospital, setHospital] = useState('Apollo Hospitals, Greams Road, Chennai');
  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  const [totalCost, setTotalCost] = useState('500000');
  const [insurance, setInsurance] = useState('150000');
  const [govtSupport, setGovtSupport] = useState('100000');
  const [hospitalAid, setHospitalAid] = useState('30000');
  const [familySavings, setFamilySavings] = useState('50000');
  const [fileName, setFileName] = useState('');
  const [submittedCaseSuccess, setSubmittedCaseSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Consent settings state
  const [consentMedicalShare, setConsentMedicalShare] = useState(true);
  const [consentBlurPhoto, setConsentBlurPhoto] = useState(true);
  const [consentDirectEscrow, setConsentDirectEscrow] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);

  // Dynamic funding gap calculation
  const legacyNumCost = Number(totalCost) || 0;
  const legacyNumIns = Number(insurance) || 0;
  const legacyNumGovt = Number(govtSupport) || 0;
  const legacyNumHosp = Number(hospitalAid) || 0;
  const legacyNumFam = Number(familySavings) || 0;

  const calculatedGap = Math.max(0, legacyNumCost - (legacyNumIns + legacyNumGovt + legacyNumHosp + legacyNumFam));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.patientName = 'Patient full name is required';
    if (!patientAge.trim() || isNaN(Number(patientAge)))
      newErrors.patientAge = 'Valid patient age is required';
    if (!treatment.trim()) newErrors.treatment = 'Treatment or surgery name is required';
    if (!diagnosisSummary.trim())
      newErrors.diagnosisSummary = 'Clinical summary or doctor prognosis is required';
    if (numCost <= 0) newErrors.totalCost = 'Total estimated cost must be greater than zero';
    if (!fileName) newErrors.fileName = 'Hospital estimate or discharge plan document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCaseId = `CF-CHN-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newCase: MedicalCase = {
      id: newCaseId,
      patientName,
      patientAge: Number(patientAge),
      patientGender,
      hospital,
      hospitalAddress: 'Greams Road, Thousand Lights, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      treatment,
      treatmentCategory,
      fourStepStage: 1,
      diagnosisSummary,
      patientStory: diagnosisSummary,
      status: 'Information Submitted',
      totalTreatmentCost: numCost,
      insuranceConfirmed: numIns,
      governmentSupportConfirmed: numGovt,
      hospitalAssistance: legacyNumHosp,
      familyContribution: legacyNumFam,
      existingDonations: 0,
      verifiedFundingGap: calculatedGap,
      alreadyRaised: 0,
      stillNeeded: calculatedGap,
      verifiedByTitle: 'Pending Hospital Review',
      verifierName: 'Apollo Hospitals Clinical Desk',
      verificationDate: '08 Oct 2026',
      verificationReference: `CF-REF-${newCaseId}`,
      hospitalAccountReference: 'Axis Bank Escrow #92102008391823',
      aiScreeningState: 'In Progress',
      humanReviewState: 'Pending',
      finalDecisionState: 'Not yet decided',
      aiAssistance: {
        checkedSummary: 'Initial check in progress for missing documents and cost math.',
        checkedItems: ['Hospital admission order', 'Cost estimate letter'],
        possibleInconsistencies: [],
        supportingInformation: [],
        confidenceExplanation: 'AI assists. Humans decide.',
      },
      humanDecisions: [],
      documentChecks: [
        {
          name: fileName || 'Hospital Estimate Letter',
          status: 'Pending',
          note: 'Uploaded by patient family',
        },
      ],
      hasInconsistency: false,
      admittedDate: '08 Oct 2026',
      dischargeExpected: '25 Oct 2026',
      clinicalSpecialist: 'Dr. S. Murali, Senior Consultant',
      hospitalBedId: 'Pediatric Ward 4B',
      inconsistencyNotes: undefined,
      timeline: [
        {
          stepNumber: 1,
          title: 'Information Submitted',
          status: 'Completed',
          date: '08 Oct 2026',
          explanation:
            'Your medical assistance request and hospital estimate documents have been submitted and are ready for initial checking.',
          reviewerRole: 'Patient / Family Applicant',
        },
        {
          stepNumber: 2,
          title: 'AI Check Completed',
          status: 'In Progress',
          date: '08 Oct 2026',
          explanation:
            'CareFund AI is currently checking submitted documents for missing or inconsistent details.',
          reviewerRole: 'Automated Diagnostic Engine',
        },
        {
          stepNumber: 3,
          title: 'Human Review',
          status: 'Upcoming',
          explanation:
            'An authorized hospital representative or CareFund reviewer will manually inspect clinical and cost records.',
          reviewerRole: 'Awaiting Authorized Reviewer',
        },
        {
          stepNumber: 4,
          title: 'Final Decision',
          status: 'Upcoming',
          explanation:
            'The authorized human reviewer will make the final decision. AI only assists.',
          reviewerRole: 'Authorized Clinical Auditor',
        },
      ],
      documents: [
        {
          id: `DOC-${Date.now()}-1`,
          title: fileName || 'Hospital Cost Estimate & Admission Letter',
          type: 'Hospital Bill',
          verified: false,
          source: hospital,
          verificationDate: '08 Oct 2026',
        },
      ],
      hospitalEscrowDetails: {
        accountName: `${hospital} Enterprise Escrow`,
        bankName: 'Axis Bank, Commercial Branch, Chennai',
        accountNumber: '92102008391823',
        ifscCode: 'UTIB0000142',
        escrowReference: `ESC-${newCaseId}`,
      },
    };

    onSubmitNewCase(newCase);
    setSubmittedCaseSuccess(newCaseId);
  };

  const handleSaveConsent = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-neutral-600">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <span className="text-sm font-semibold">Loading patient profile...</span>
        </div>
      </div>
    );
  }

  if (!patientProfile) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-mono text-red-600 font-bold uppercase tracking-wider">Step {onboardingStep} of 5 — Patient Onboarding</span>
            <h1 className="text-2xl font-bold text-neutral-900 mt-1">Complete your patient profile</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              Enter your clinical, hospital, and financial details to open your isolated CareFund case.
            </p>
          </div>

          {onboardingError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{onboardingError}</span>
            </div>
          )}

          <form onSubmit={handleCompleteOnboarding} className="space-y-6">
            {onboardingStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-neutral-900 border-b pb-2">1. Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kavitha R."
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">City / District</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Next: Medical Condition →
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-neutral-900 border-b pb-2">2. Medical Condition</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Medical Condition / Diagnosis *</label>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Rheumatic Heart Disease with Severe Mitral Regurgitation"
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Treatment Required *</label>
                    <input
                      type="text"
                      required
                      value={treatmentRequired}
                      onChange={(e) => setTreatmentRequired(e.target.value)}
                      placeholder="e.g. Open Heart Mitral Valve Replacement Surgery"
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Clinical Story / Condition Summary</label>
                    <textarea
                      rows={3}
                      value={conditionSummary}
                      onChange={(e) => setConditionSummary(e.target.value)}
                      placeholder="Explain symptoms, doctor prognosis, and family situation in your own words..."
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Surgery Required?</label>
                      <select
                        value={surgeryRequired ? 'yes' : 'no'}
                        onChange={(e) => setSurgeryRequired(e.target.value === 'yes')}
                        className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 bg-white"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Treatment Urgency</label>
                      <select
                        value={treatmentUrgency}
                        onChange={(e) => setTreatmentUrgency(e.target.value)}
                        className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 bg-white"
                      >
                        <option value="Critical / Immediate">Critical / Immediate</option>
                        <option value="High">High</option>
                        <option value="Moderate">Moderate</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Next: Hospital Details →
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-neutral-900 border-b pb-2">3. Hospital Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Hospital Name</label>
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Treating Doctor Name</label>
                    <input
                      type="text"
                      value={treatingDoctor}
                      onChange={(e) => setTreatingDoctor(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Doctor Designation</label>
                    <input
                      type="text"
                      value={doctorDesignation}
                      onChange={(e) => setDoctorDesignation(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Next: Treatment Cost & Funding →
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-neutral-900 border-b pb-2">4. Treatment Cost & Funding Requirement</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Total Treatment Cost (₹)</label>
                    <input
                      type="number"
                      value={totalCostInput}
                      onChange={(e) => setTotalCostInput(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Family / Self Contribution (₹)</label>
                    <input
                      type="number"
                      value={familyContributionInput}
                      onChange={(e) => setFamilyContributionInput(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Insurance Coverage (₹)</label>
                    <input
                      type="number"
                      value={insuranceInput}
                      onChange={(e) => setInsuranceInput(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Government Scheme Assistance (₹)</label>
                    <input
                      type="number"
                      value={govtAssistanceInput}
                      onChange={(e) => setGovtAssistanceInput(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-red-800 uppercase tracking-wider">CareFund Funding Required (Calculated)</p>
                    <p className="text-2xl font-black text-red-700 mt-0.5">₹ {formatINR(calculatedFundingRequired)}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-white text-red-700 rounded-lg border border-red-200 shadow-2xs">
                    Auto-Calculated
                  </span>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(3)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(5)}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Next: Review & Submit →
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <h3 className="text-base font-bold text-neutral-900 border-b pb-2">5. Review & Submit</h3>
                <div className="space-y-3 text-xs text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <p><strong>Patient Name:</strong> {fullName || 'Not provided'}</p>
                  <p><strong>Diagnosis:</strong> {diagnosis || 'Not provided'}</p>
                  <p><strong>Treatment Required:</strong> {treatmentRequired || 'Not provided'}</p>
                  <p><strong>Hospital:</strong> {hospitalName}</p>
                  <p><strong>Total Treatment Cost:</strong> ₹ {formatINR(numCost)}</p>
                  <p className="text-red-700 font-bold text-sm"><strong>CareFund Funding Required:</strong> ₹ {formatINR(calculatedFundingRequired)}</p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(4)}
                    className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer shadow-md"
                  >
                    Complete Profile & Submit Case
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* All content wrapped here */}
    </div>
  );
};





      {/* ============================================================== */}
      {/* TAB: CREATE ASSISTANCE REQUEST                                  */}
      {/* ============================================================== */}
      {activeTab === 'create' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div>
            <h1 className="cf-title text-neutral-900">Create Medical Assistance Request</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Submit patient and hospital details. AI performs an initial check for missing items, then authorized human reviewers make the final decision.
            </p>
          </div>

          <TrustMessageBanner />

          {submittedCaseSuccess ? (
            <div className="cf-card p-8 text-center space-y-4 border-emerald-200 bg-emerald-50/30">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                Assistance Request Submitted Successfully
              </h2>
              <p className="text-sm text-neutral-600 max-w-lg mx-auto">
                Case reference <span className="font-mono font-bold">{submittedCaseSuccess}</span> has been logged under{' '}
                <span className="font-semibold">Step 1 — Information Submitted</span>. CareFund AI is performing the initial check for missing or inconsistent details.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectTab('verification')}
                  className="cf-btn-primary cursor-pointer text-xs"
                >
                  <span>Track 4-Step Verification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSubmittedCaseSuccess(null)}
                  className="cf-btn-secondary cursor-pointer text-xs"
                >
                  <span>Submit Another Request</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-8">
              {/* Step 1: Patient Information */}
              <div className="cf-card p-6 space-y-4">
                <h3 className="cf-card-heading text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Patient & Treatment Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="cf-label block mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Master Aarav M."
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className={`cf-input text-sm ${errors.patientName ? 'border-red-500' : ''}`}
                    />
                    {errors.patientName && (
                      <span className="text-[11px] text-red-600 mt-1 block">{errors.patientName}</span>
                    )}
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Age & Gender</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Age"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className={`cf-input text-sm w-20 ${errors.patientAge ? 'border-red-500' : ''}`}
                      />
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="cf-input text-sm flex-1"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="cf-label block mb-1">Treatment / Procedure</label>
                    <input
                      type="text"
                      placeholder="e.g. Ventricular Septal Defect Surgical Closure"
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className={`cf-input text-sm ${errors.treatment ? 'border-red-500' : ''}`}
                    />
                    {errors.treatment && (
                      <span className="text-[11px] text-red-600 mt-1 block">{errors.treatment}</span>
                    )}
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Clinical Department</label>
                    <select
                      value={treatmentCategory}
                      onChange={(e) => setTreatmentCategory(e.target.value as any)}
                      className="cf-input text-sm"
                    >
                      <option>Cardiac</option>
                      <option>Oncology</option>
                      <option>Pediatric</option>
                      <option>Trauma & Ortho</option>
                      <option>Transplant</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="cf-label block mb-1">Treating Hospital (Chennai)</label>
                  <select
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="cf-input text-sm"
                  >
                    <option>Apollo Hospitals, Greams Road, Chennai</option>
                    <option>Cancer Institute (WIA), Adyar, Chennai</option>
                    <option>MIOT International, Manapakkam, Chennai</option>
                    <option>Institute of Child Health (ICH), Egmore, Chennai</option>
                    <option>Govt Multi Super Speciality Hospital, Omandurar, Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="cf-label block mb-1">Clinical Diagnosis & Prognosis</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the diagnosis, doctor advice, and urgency..."
                    value={diagnosisSummary}
                    onChange={(e) => setDiagnosisSummary(e.target.value)}
                    className={`cf-input text-sm ${errors.diagnosisSummary ? 'border-red-500' : ''}`}
                  />
                  {errors.diagnosisSummary && (
                    <span className="text-[11px] text-red-600 mt-1 block">{errors.diagnosisSummary}</span>
                  )}
                </div>
              </div>

              {/* Step 2: Financial Gap Calculator */}
              <div className="cf-card p-6 space-y-4">
                <h3 className="cf-card-heading text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Cost Breakdown & Funding Gap Calculation</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="cf-label block mb-1">Total Estimated Cost (₹)</label>
                    <input
                      type="number"
                      value={totalCost}
                      onChange={(e) => setTotalCost(e.target.value)}
                      className="cf-input text-sm font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Insurance Coverage (₹)</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="cf-input text-sm text-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Govt Support (CMCHIS / PMJAY) (₹)</label>
                    <input
                      type="number"
                      value={govtSupport}
                      onChange={(e) => setGovtSupport(e.target.value)}
                      className="cf-input text-sm text-neutral-700"
                    />
                  </div>

                  <div>
                    <label className="cf-label block mb-1">Family Savings & Contribution (₹)</label>
                    <input
                      type="number"
                      value={familySavings}
                      onChange={(e) => setFamilySavings(e.target.value)}
                      className="cf-input text-sm text-neutral-700"
                    />
                  </div>
                </div>

                {/* Mathematical Live Gap Result */}
                <div className="p-4 bg-neutral-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-300 block">Verified Community Funding Gap</span>
                    <span className="text-xs text-neutral-400 font-mono">
                      ₹{legacyNumCost.toLocaleString()} - (₹{legacyNumIns.toLocaleString()} + ₹{legacyNumGovt.toLocaleString()} + ₹{legacyNumFam.toLocaleString()})
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">
                    {formatINR(calculatedGap)}
                  </span>
                </div>
              </div>

              {/* Step 3: Document Upload & AI Screening Note */}
              <div className="cf-card p-6 space-y-4">
                <h3 className="cf-card-heading text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Hospital Estimate & Supporting Documents</span>
                </h3>

                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-neutral-400 transition-colors">
                  <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-800">
                    {fileName ? fileName : 'Upload Hospital Estimate Letter (PDF / JPG)'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Upload official estimate letter from Apollo, Cancer Institute, or network hospital.
                  </p>
                  <label className="inline-block mt-3 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold cursor-pointer">
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFileName(e.target.files[0].name);
                        } else {
                          setFileName('Apollo_Estimate_Surgery_Oct2026.pdf');
                        }
                      }}
                    />
                  </label>
                  {!fileName && (
                    <button
                      type="button"
                      onClick={() => setFileName('Apollo_Hospital_Estimate_Cardiology_2026.pdf')}
                      className="block mx-auto mt-2 text-[11px] text-red-600 underline cursor-pointer"
                    >
                      Use Demo Hospital Estimate Letter
                    </button>
                  )}
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700 space-y-1">
                  <span className="font-semibold block text-neutral-900">
                    AI Initial Screening Preview:
                  </span>
                  <p>
                    CareFund AI checks for missing documents, date mismatches, and mathematical errors. It does not approve, reject, or declare fraud. Final decisions belong to authorized hospital reviewers.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full cf-btn-primary justify-center text-sm py-3 cursor-pointer"
              >
                <span>Submit Assistance Request for Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: MY CASES                                                  */}
      {/* ============================================================== */}
      {activeTab === 'my-cases' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">My Cases</h1>
            <p className="cf-body text-neutral-600 mt-1">
              All assistance requests submitted by your family and their active review statuses.
            </p>
          </div>

          <div className="space-y-4">
            {cases.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="cf-card p-6 border-neutral-200 hover:border-neutral-300 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-neutral-500">{item.id}</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                      {item.patientName}, {item.age}y · {item.treatment}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{item.hospital}</span>
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                {/* 4-Step Stepper */}
                <FourStepReviewStepper
                  currentStep={
                    item.status === 'Approved'
                      ? 4
                      : item.status === 'Human Review' || item.status === 'Hospital Verified'
                      ? 3
                      : 2
                  }
                  status={item.status}
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-xl text-xs">
                  <div>
                    <span className="text-neutral-500 block">Total Cost</span>
                    <span className="font-bold text-neutral-900">{formatINR(item.totalTreatmentCost)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Verified Gap</span>
                    <span className="font-bold text-neutral-900">{formatINR(item.verifiedFundingGap)}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">Community Raised</span>
                    <span className="font-bold text-emerald-700">{formatINR(item.alreadyRaised)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseForModal(item)}
                    className="cf-btn-secondary text-xs cursor-pointer"
                  >
                    <span>View Case Details & Ledger</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTab('verification')}
                    className="cf-btn-primary text-xs cursor-pointer"
                  >
                    <span>View 4-Step Verification</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DOCUMENTS                                                 */}
      {/* ============================================================== */}
      {activeTab === 'documents' && (
        <div className="space-y-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="cf-title text-neutral-900">Documents</h1>
              <p className="cf-body text-neutral-600 mt-1">
                Medical estimates, clinical diagnoses, and financial proof uploaded for your case.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading document...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>

          {uploadError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Documents list */}
          {isLoadingDocs ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading documents...</div>
          ) : patientDocs.length === 0 ? (
            <div className="cf-card p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-900">No documents uploaded yet.</h3>
                <p className="text-xs text-neutral-500">Upload your treatment estimates, prescriptions, or bills.</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          ) : (
            <div className="cf-card divide-y divide-neutral-100">
              {patientDocs.map((doc) => (
                <div key={doc.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900 truncate" title={doc.name}>
                          {doc.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase">
                          {doc.fileType}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {doc.size} · Uploaded on {doc.uploadDate} by {doc.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      doc.verificationStatus === 'Verified' || doc.verificationStatus.includes('Verified')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {doc.verificationStatus}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPreviewDoc({
                        id: doc.id,
                        category: doc.category,
                        name: doc.name,
                        fileType: doc.fileType,
                        size: doc.size,
                        uploadDate: doc.uploadDate,
                        dataUrl: doc.dataUrl,
                        status: (doc.status as 'Uploaded' | 'Pending') || 'Uploaded',
                        isRequired: false,
                        description: doc.description,
                      })}
                      className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Existing default static documents preserved below */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-neutral-900 truncate">
                        Apollo Hospitals Treatment Cost Estimate & Admission Order
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                        PDF
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      1.4 MB · Signed by Dr. S. Murali, Senior Cardiothoracic Consultant · 04 Oct 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified by Hospital
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc({
                      id: 'default-1',
                      category: 'Hospital Bill',
                      name: 'Apollo Hospitals Treatment Cost Estimate & Admission Order',
                      fileType: 'PDF',
                      size: '1.4 MB',
                      uploadDate: '04 Oct 2026',
                      status: 'Uploaded',
                      isRequired: false,
                    })}
                    className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Document Preview Modal */}
          <DocumentPreviewModal
            document={previewDoc}
            isOpen={Boolean(previewDoc)}
            onClose={() => setPreviewDoc(null)}
            onRemove={() => {}}
            onReplaceClick={() => {}}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: VERIFICATION STATUS (4-STEP REVIEW)                       */}
      {/* ============================================================== */}
      {activeTab === 'verification' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">4-Step Review & Verification Status</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Real-time audit of every verification step. AI assists with initial checks; authorized human reviewers make the final decision.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Stepper overview */}
          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">
              Live Progress for Case {activeCase.id}
            </h3>
            <FourStepReviewStepper
              currentStep={
                activeCase.status === 'Approved'
                  ? 4
                  : activeCase.status === 'Human Review' || activeCase.status === 'Hospital Verified'
                  ? 3
                  : 2
              }
              status={activeCase.status}
            />
          </div>

          {/* Detailed Verification Timeline */}
          <div className="cf-card p-6">
            <VerificationTimeline timeline={activeCase.timeline} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: FUNDING GAP                                               */}
      {/* ============================================================== */}
      {activeTab === 'funding-gap' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="cf-title text-neutral-900">Funding Gap Calculation</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Why CareFund calculates a mathematical funding gap to protect families and ensure exact community support.
            </p>
          </div>

          <div className="cf-card p-6 space-y-6">
            <h3 className="cf-card-heading text-neutral-900">
              Transparent Gap Formula for {activeCase.patientName}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl text-sm">
                <div>
                  <span className="font-semibold text-neutral-900">1. Total Estimated Hospital Cost</span>
                  <p className="text-xs text-neutral-500">Official estimate from {activeCase.hospital}</p>
                </div>
                <span className="font-bold text-neutral-900 text-base">
                  {formatINR(activeCase.totalTreatmentCost)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-red-50/50 rounded-xl text-sm border border-red-100">
                <div>
                  <span className="font-semibold text-red-900">(-) Private Medical Insurance</span>
                  <p className="text-xs text-neutral-500">Star Health Insurance coverage</p>
                </div>
                <span className="font-bold text-red-700 text-base">
                  - {formatINR(activeCase.insuranceConfirmed ?? activeCase.insuranceCoverage ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-red-50/50 rounded-xl text-sm border border-red-100">
                <div>
                  <span className="font-semibold text-red-900">(-) Government Scheme (CMCHIS / PMJAY)</span>
                  <p className="text-xs text-neutral-500">Tamil Nadu Chief Minister Comprehensive Scheme</p>
                </div>
                <span className="font-bold text-red-700 text-base">
                  - {formatINR(activeCase.governmentSupportConfirmed ?? activeCase.governmentSupport ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-red-50/50 rounded-xl text-sm border border-red-100">
                <div>
                  <span className="font-semibold text-red-900">(-) Hospital Trust Concession</span>
                  <p className="text-xs text-neutral-500">Hospital philanthropic reduction</p>
                </div>
                <span className="font-bold text-red-700 text-base">
                  - {formatINR(activeCase.hospitalAssistance ?? activeCase.hospitalAid ?? 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-red-50/50 rounded-xl text-sm border border-red-100">
                <div>
                  <span className="font-semibold text-red-900">(-) Family Savings & Contribution</span>
                  <p className="text-xs text-neutral-500">Patient family contribution</p>
                </div>
                <span className="font-bold text-red-700 text-base">
                  - {formatINR(activeCase.familyContribution ?? 0)}
                </span>
              </div>

              {/* Equals Result */}
              <div className="flex items-center justify-between p-4 bg-neutral-900 text-white rounded-xl text-base font-bold">
                <div>
                  <span className="text-sm font-bold text-white block">(=) Verified Community Funding Gap</span>
                  <span className="text-xs text-neutral-300 font-normal">
                    This is the exact amount eligible for community crowdfunding
                  </span>
                </div>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatINR(activeCase.verifiedFundingGap)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: MEDICAL INFORMATION                                       */}
      {/* ============================================================== */}
      {activeTab === 'medical' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="cf-title text-neutral-900">Medical Information</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Clinical condition, required treatment, and diagnosis details for {patientProfile.fullName}.
            </p>
          </div>

          <TrustMessageBanner />

          <div className="cf-card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Primary Diagnosis</span>
                <p className="text-lg font-bold text-neutral-900 mt-1">{patientProfile.diagnosis || 'Ventricular Septal Defect (Congenital Heart Disease)'}</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Treatment Required</span>
                <p className="text-lg font-bold text-neutral-900 mt-1">{patientProfile.treatmentRequired || 'Corrective Open Heart Surgery (VSD Closure)'}</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Urgency Level</span>
                <div className="mt-1">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    {patientProfile.treatmentUrgency || 'High (Within 14 Days)'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Surgery Required</span>
                <p className="text-base font-semibold text-neutral-900 mt-1">
                  {patientProfile.surgeryRequired ? 'Yes — Major Surgical Procedure' : 'No — Medical Management'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Clinical Condition Summary</span>
              <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
                {patientProfile.conditionSummary || 'Patient was diagnosed with large perimembranous ventricular septal defect with left-to-right shunt and pulmonary arterial hypertension. Requires immediate surgical closure to avoid irreversible Eisenmenger physiology.'}
              </p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Detailed Treatment Plan</span>
              <p className="text-sm text-neutral-700 mt-1 leading-relaxed">
                {patientProfile.treatmentDescription || 'Open heart surgery under cardiopulmonary bypass with Dacron patch closure of VSD, followed by 48 hours of ICU hemodynamic monitoring and 5 days of step-down ward care.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: HOSPITAL DETAILS                                          */}
      {/* ============================================================== */}
      {activeTab === 'hospital-details' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="cf-title text-neutral-900">Hospital & Clinical Details</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Verified clinical facility, treating physician, and admission schedule.
            </p>
          </div>

          <TrustMessageBanner />

          <div className="cf-card p-6 space-y-6">
            <div className="flex items-start gap-4 p-4 bg-red-50/40 rounded-xl border border-red-100">
              <Building2 className="w-8 h-8 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-bold text-neutral-900">{patientProfile.hospitalName || 'Apollo Hospitals, Greams Road, Chennai'}</h3>
                <p className="text-xs text-neutral-600 mt-0.5">{patientProfile.hospitalAddress || '21 Greams Lane, Thousand Lights, Chennai, Tamil Nadu 600006'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-semibold">
                    ✓ Verified CareFund Partner Hospital
                  </span>
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[11px] font-medium">
                    Department: {patientProfile.department || 'Cardiothoracic Surgery'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Treating Doctor / Surgeon</span>
                <p className="text-base font-bold text-neutral-900 mt-1">{patientProfile.treatingDoctor || 'Dr. S. Murali'}</p>
                <p className="text-xs text-neutral-500">{patientProfile.doctorDesignation || 'Senior Consultant Pediatric Cardiac Surgeon'}</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Clinical Desk Contact</span>
                <p className="text-base font-mono font-bold text-neutral-900 mt-1">{patientProfile.doctorContact || '+91 44 2829 0200'}</p>
                <p className="text-xs text-neutral-500">Nodal Escrow Coordinator: Apollo Greams Desk</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Scheduled Admission</span>
                <p className="text-base font-semibold text-neutral-900 mt-1">{patientProfile.admissionDate || '12 Oct 2026'}</p>
                <p className="text-xs text-neutral-500">Admitting Ward: Pediatric Cardiothoracic 4B</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expected Discharge</span>
                <p className="text-base font-semibold text-neutral-900 mt-1">{patientProfile.expectedDischargeDate || '19 Oct 2026'}</p>
                <p className="text-xs text-neutral-500">Subject to post-operative hemodynamic recovery</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: GOVERNMENT SCHEME                                         */}
      {/* ============================================================== */}
      {activeTab === 'government' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="cf-title text-neutral-900">Government Health Schemes</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Public schemes and subsidies verified to prevent duplicate fundraising and reduce community requirement.
            </p>
          </div>

          <TrustMessageBanner />

          <div className="cf-card p-6 space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Active Government Scheme</span>
                <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                  {patientProfile.schemeName || 'Chief Minister Comprehensive Health Insurance Scheme (CMCHIS)'}
                </h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Card / Scheme Reference: <span className="font-mono font-bold">{patientProfile.schemeIdNumber || 'TN-CMCHIS-992384-2026'}</span>
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shrink-0">
                Approved & Subtracted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Government Scheme Support</span>
                <p className="text-xl font-bold text-neutral-900 mt-1">{formatINR(Number(patientProfile.govtAssistance) || 100000)}</p>
                <p className="text-xs text-neutral-500 mt-0.5">Automatically subtracted from total treatment cost</p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ayushman Bharat (PM-JAY) Status</span>
                <p className="text-base font-semibold text-neutral-900 mt-1">Linked via State Co-Payment</p>
                <p className="text-xs text-neutral-500 mt-0.5">Verified with hospital PM-JAY desk</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CASE STATUS                                               */}
      {/* ============================================================== */}
      {activeTab === 'status' && (
        <div className="space-y-8 max-w-4xl">
          <div>
            <h1 className="cf-title text-neutral-900">Case Status & Audit Milestones</h1>
            <p className="cf-body text-neutral-600 mt-1">
              End-to-end status of your medical assistance request through the 6-stage verification workflow.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Stepper overview */}
          <div className="cf-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="cf-card-heading text-neutral-900">Stage Progress</h3>
              <StatusBadge status={activeCase.status} />
            </div>

            <FourStepReviewStepper
              currentStep={
                activeCase.status === 'Approved'
                  ? 4
                  : activeCase.status === 'Human Review' || activeCase.status === 'Hospital Verified'
                  ? 3
                  : 2
              }
              status={activeCase.status}
            />
          </div>

          {/* Detailed 6-Stage Timeline */}
          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Workflow Stages</h3>
            <div className="space-y-3">
              {[
                { stage: '1. Information Submitted', desc: 'Patient and family provided clinical diagnosis and estimated costs.', status: 'Completed', date: '03 Oct 2026' },
                { stage: '2. Documents Submitted', desc: 'Medical reports, hospital bills, and identity cards uploaded.', status: 'Completed', date: '04 Oct 2026' },
                { stage: '3. Hospital Verification', desc: 'Apollo Hospitals Clinical Desk confirmed admission & itemized estimate.', status: 'Completed', date: '04 Oct 2026' },
                { stage: '4. Human Review Desk', desc: 'Authorized medical auditor Dr. K. Swaminathan verified funding gap.', status: 'Completed', date: '05 Oct 2026' },
                { stage: '5. Final Decision', desc: 'Approved for community escrow crowdfunding.', status: activeCase.status === 'Approved' ? 'Completed' : 'In Progress', date: '05 Oct 2026' },
                { stage: '6. Funding Active', desc: 'Verified community donations paid directly to hospital escrow.', status: activeCase.status === 'Approved' ? 'Active' : 'Pending', date: 'Live' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{item.stage}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{item.desc}</p>
                    <span className="text-[11px] font-mono text-neutral-400 mt-1 block">{item.date}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Completed' || item.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
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
              Updates on verification, hospital review, and donations received.
            </p>
          </div>

          <div className="cf-card divide-y divide-neutral-100">
            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  Final Decision: Approved by Dr. K. Swaminathan (Authorized Reviewer)
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Your assistance request has been fully verified and is now live for community support.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">05 Oct 2026, 04:30 PM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  Hospital Verification Completed by Apollo Liaison
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Admission order and clinical estimate confirmed with hospital clinical coordinator.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">04 Oct 2026, 06:15 PM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors">
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-neutral-900">
                  AI Initial Check Completed
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  CareFund AI checked submitted documents. All items complete with no date discrepancies.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">04 Oct 2026, 03:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PROFILE & PRIVACY / CONSENT                               */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="cf-title text-neutral-900">Patient Profile & Consent</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Manage guardian contacts, hospital record numbers, and patient privacy consents.
            </p>
          </div>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Consent and profile information saved.</span>
            </div>
          )}

          <form onSubmit={handleSaveConsent} className="space-y-6">
            <div className="cf-card p-6 space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Applicant / Guardian Contact</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="cf-label block mb-1">Guardian / Primary Contact</label>
                  <input
                    type="text"
                    defaultValue="Revathi S."
                    className="cf-input text-sm"
                  />
                </div>
                <div>
                  <label className="cf-label block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98401 23456"
                    className="cf-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="cf-label block mb-1">Hospital Medical Record Number (MRN)</label>
                <input
                  type="text"
                  defaultValue="APH-GRE-2026-98124"
                  className="cf-input text-sm font-mono"
                />
              </div>
            </div>

            <div className="cf-card p-6 space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Patient Privacy & Trust Consent</h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentMedicalShare}
                    onChange={(e) => setConsentMedicalShare(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Consent to share medical estimate with authorized clinical desk reviewers
                    </span>
                    <span className="text-xs text-neutral-500">
                      Required for hospital liaison verification and funding gap validation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentBlurPhoto}
                    onChange={(e) => setConsentBlurPhoto(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Protect patient identity (blur face & conceal personal address on public case cards)
                    </span>
                    <span className="text-xs text-neutral-500">
                      Ensures patient dignity while maintaining full clinical verification with the hospital.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentDirectEscrow}
                    onChange={(e) => setConsentDirectEscrow(e.target.checked)}
                    className="mt-1 rounded text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-neutral-900 block">
                      Authorize direct settlement to hospital escrow account
                    </span>
                    <span className="text-xs text-neutral-500">
                      100% of community contributions are paid directly to Apollo Hospitals for the patient's care.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="cf-btn-primary cursor-pointer">
              <span>Save Profile & Consent</span>
            </button>
          </form>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCaseForModal && (
        <CaseDetailModal
          medicalCase={selectedCaseForModal}
          onClose={() => setSelectedCaseForModal(null)}
          onUpdateCase={onUpdateCase}
        />
      )}
    </div>
  );
};

