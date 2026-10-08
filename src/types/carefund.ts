export type CaseStatus =
  | 'Information Submitted'
  | 'AI Check Completed'
  | 'AI Screening Completed'
  | 'Verification in Progress'
  | 'Hospital Verified'
  | 'Human Review Required'
  | 'Human Review'
  | 'Approved'
  | 'More Information Required'
  | 'Requires More Information'
  | 'Further Review Required'
  | 'Rejected'
  | 'Pending'
  | 'Payment Confirmed'
  | 'Reconciled'
  | 'Fully Funded'
  | 'Case Closed';

export type FourStepStage = 1 | 2 | 3 | 4;


export type HumanDecisionAction =
  | 'Approve'
  | 'Request More Information'
  | 'Send for Further Review'
  | 'Reject';

export interface HumanDecisionRecord {
  decision: HumanDecisionAction;
  decidedBy: string;
  reviewerRole: string;
  decidedAt: string;
  reason?: string;
  notes?: string;
}

export type HumanDecision = HumanDecisionRecord;

export interface AIAssistanceReport {
  checkedSummary: string;
  checkedItems: string[];
  possibleInconsistencies: string[];
  supportingInformation: string[];
  confidenceExplanation: string;
}

export interface TimelineStep {
  stepNumber: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  date?: string;
  explanation: string;
  reviewerRole?: string;
}

export interface DocumentCheckItem {
  name: string;
  status: 'Verified' | 'Needs Review' | 'Pending';
  note: string;
}

export interface MedicalCase {
  id: string; // e.g. CF-CHN-2026-00124
  patientName: string;
  patientAge: number;
  patientGender: string;
  treatment: string;
  treatmentCategory: 'Cardiac' | 'Oncology' | 'Pediatric' | 'Trauma & Ortho' | 'Transplant' | 'Emergency';
  hospital: string;
  hospitalAddress: string;
  city: string;
  district?: string;
  state?: string;
  fourStepStage?: 1 | 2 | 3 | 4;
  diagnosisSummary: string;
  patientStory: string;
  
  // Financial breakdown
  totalTreatmentCost: number;
  insuranceConfirmed: number;
  governmentSupportConfirmed: number;
  hospitalAssistance: number;
  familyContribution: number;
  existingDonations: number;
  verifiedFundingGap: number;
  alreadyRaised: number;
  stillNeeded: number;

  // Verification metadata
  status: CaseStatus;
  verifiedByTitle: string;
  verifierName: string;
  verificationDate: string;
  verificationReference: string;
  hospitalAccountReference: string;

  // Decision Status Trio (Rule 13)
  aiScreeningState: 'Completed' | 'In Progress' | 'Pending';
  humanReviewState: 'Completed' | 'In Progress' | 'Pending';
  finalDecisionState: 'Approved' | 'Not yet decided' | 'Requires More Information' | 'Send for Further Review' | 'Rejected';

  // AI Assistance & Human Decision Records (Rule 2)
  aiAssistance: AIAssistanceReport;
  humanDecisions: HumanDecisionRecord[];
  
  // Steps and documents
  timeline: TimelineStep[];
  documentChecks: DocumentCheckItem[];

  // Inconsistency details
  hasInconsistency: boolean;
  inconsistencyTitle?: string;
  inconsistencyReason?: string;
  inconsistencyNotes?: string;
  isResolved?: boolean;

  // Convenience aliases and additional clinical metadata
  age?: number;
  gender?: string;
  summary?: string;
  hospitalBedId?: string;
  admittedDate?: string;
  dischargeExpected?: string;
  clinicalSpecialist?: string;
  insuranceCoverage?: number;
  governmentSupport?: number;
  hospitalAid?: number;
  decision?: HumanDecisionRecord;
  documents?: any[];
  hospitalEscrowDetails?: any;

  // Patient Submission Flow Extensions
  mobileNumber?: string;
  emailAddress?: string;
  dob?: string;
  relationshipToPatient?: string;
  submittedFor?: string;
  doctorOrDepartment?: string;
  treatmentDate?: string;
  isEmergency?: boolean;
  uploadedMedicalDocs?: UploadedMedicalDoc[];
  userDeclarations?: {
    genuineConfirmed: boolean;
    accurateInfoConfirmed: boolean;
    reviewConsentConfirmed: boolean;
    authorizedCheckConsentConfirmed: boolean;
  };
}

export interface UploadedMedicalDoc {
  id: string;
  category: string;
  name: string;
  fileType: string;
  size: string;
  uploadDate: string;
  dataUrl?: string;
  isRequired: boolean;
  status: 'Uploaded' | 'Pending';
  description?: string;
}

export interface DonationRecord {
  receiptId: string;
  caseId: string;
  patientName: string;
  amount: number;
  donorName: string;
  timestamp: string;
  paymentMethod: string;
  hospitalRecipient: string;
  status: 'Payment Confirmed' | 'Reconciled';
}
