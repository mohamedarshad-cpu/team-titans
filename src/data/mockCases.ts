import { CaseStatus, MedicalCase, DonationRecord } from '../types/carefund';

export const STATUS_EXPLANATIONS: Record<CaseStatus, string> = {
  'Information Submitted': 'Your information has been submitted and is ready for initial checking.',
  'AI Check Completed': 'CareFund checked the submitted information for missing or inconsistent details.',
  'AI Screening Completed': 'CareFund checked the submitted information for missing or inconsistent details.',
  'Verification in Progress': 'Documents and hospital bills are currently being reviewed by clinical desks.',
  'Hospital Verified': 'The hospital has confirmed the treatment and submitted cost information.',
  'Human Review': 'An authorized hospital representative or CareFund reviewer manually reviews the information.',
  'Human Review Required': 'An authorized human reviewer must review and decide on this case.',
  'Approved': 'Approved by an authorized human reviewer. Case is verified for funding.',
  'More Information Required': 'Reviewer requested additional hospital documentation before making a final decision.',
  'Requires More Information': 'Reviewer requested additional hospital documentation before making a final decision.',
  'Further Review Required': 'Case has been sent for secondary clinical committee review.',
  'Rejected': 'Case was reviewed by an authorized human reviewer and cannot be approved (reason recorded).',
  'Pending': 'Awaiting supporting hospital paperwork or clinical estimate confirmation.',
  'Payment Confirmed': 'Payment disbursed directly to verified hospital accounts.',
  'Reconciled': 'Final fund check matches verified medical hospital bills.',
  'Fully Funded': 'The verified medical funding gap has been 100% fulfilled.',
  'Case Closed': 'Treatment completed, hospital bills settled, and audit closed.',
};

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

export function calculateFundingMetrics(caseItem: {
  totalTreatmentCost: number;
  insuranceConfirmed: number;
  governmentSupportConfirmed: number;
  hospitalAssistance: number;
  familyContribution: number;
  existingDonations: number;
  alreadyRaised: number;
}) {
  const confirmedSupport =
    caseItem.insuranceConfirmed +
    caseItem.governmentSupportConfirmed +
    caseItem.hospitalAssistance +
    caseItem.familyContribution;

  // Verified Funding Gap = Total verified treatment cost − confirmed support − existing donations
  const verifiedFundingGap = Math.max(
    0,
    caseItem.totalTreatmentCost - confirmedSupport - caseItem.existingDonations
  );

  const stillNeeded = Math.max(0, verifiedFundingGap - caseItem.alreadyRaised);

  return {
    confirmedSupport,
    verifiedFundingGap,
    stillNeeded,
  };
}

export const INITIAL_CASES: MedicalCase[] = [
  {
    id: 'CF-CHN-2026-00124',
    patientName: 'Kavitha R.',
    patientAge: 48,
    patientGender: 'Female',
    treatment: 'Cardiac Surgery',
    treatmentCategory: 'Cardiac',
    hospital: 'Verified Hospital, Chennai',
    hospitalAddress: 'Greams Road, Thousand Lights, Chennai, Tamil Nadu 600006',
    city: 'Chennai, Tamil Nadu',
    diagnosisSummary: 'Severe Rheumatic Mitral Stenosis requiring urgent Mitral Valve Replacement.',
    patientStory:
      'Kavitha is a primary school helper from Tiruvallur district. She was diagnosed with severe valve calcification requiring open-heart valve surgery to prevent imminent cardiac failure.',
    totalTreatmentCost: 800000,
    insuranceConfirmed: 300000,
    governmentSupportConfirmed: 100000,
    hospitalAssistance: 50000,
    familyContribution: 100000,
    existingDonations: 50000,
    verifiedFundingGap: 200000,
    alreadyRaised: 135000,
    stillNeeded: 65000,
    status: 'Hospital Verified',
    verifiedByTitle: 'Authorized Hospital Representative',
    verifierName: 'Dr. Priya Raman (Chief Medical Social Worker)',
    verificationDate: '09 Oct 2026',
    verificationReference: 'CF-VER-2026-00124',
    hospitalAccountReference: 'Verified Hospital Escrow A/C 9921004128 (Chennai)',
    
    // Decision Status Trio (Rule 13)
    aiScreeningState: 'Completed',
    humanReviewState: 'Completed',
    finalDecisionState: 'Approved',

    // AI Assistance details (Rule 2)
    aiAssistance: {
      checkedSummary: 'Automated initial document screening completed.',
      checkedItems: [
        'Checked hospital letterhead, admission dates, and procedure code integrity',
        'Verified Tamil Nadu CMCHIS government subsidy authorization letter for ₹1,00,000',
        'Calculated funding gap arithmetic: verified total minus confirmed support',
      ],
      possibleInconsistencies: [],
      supportingInformation: [
        'Echo report matches valve stenosis clinical diagnosis',
        'Hospital bed reservation confirmed for upcoming surgical cycle',
      ],
      confidenceExplanation: 'High format confidence. All line items correspond directly with the hospital fee schedule.',
    },
    humanDecisions: [
      {
        decision: 'Approve',
        decidedBy: 'Dr. Priya Raman',
        reviewerRole: 'Authorized Hospital Representative & Clinical Social Worker',
        decidedAt: '09 Oct 2026, 11:30 AM',
        notes: 'Verified original signed estimate with the surgical team. Gap verified at ₹2,00,000.',
      },
    ],

    timeline: [
      {
        stepNumber: 1,
        title: 'Information Submitted',
        status: 'Completed',
        date: '04 Oct 2026',
        explanation: 'Patient family submitted hospital admission order, diagnostic echo report, and preliminary estimate slip.',
        reviewerRole: 'Patient / Family',
      },
      {
        stepNumber: 2,
        title: 'AI Check Completed',
        status: 'Completed',
        date: '05 Oct 2026',
        explanation: 'CareFund checked the submitted information for missing or inconsistent details.',
        reviewerRole: 'Automated AI Check',
      },
      {
        stepNumber: 3,
        title: 'Human Review',
        status: 'Completed',
        date: '08 Oct 2026',
        explanation: 'Authorized hospital representative and clinical desk manually reviewed records, treatment cost, and verified funding gap.',
        reviewerRole: 'CareFund Clinical Desk',
      },
      {
        stepNumber: 4,
        title: 'Final Decision',
        status: 'Completed',
        date: '09 Oct 2026',
        explanation: 'Authorized human reviewer made the final decision to approve the verified funding gap.',
        reviewerRole: 'Dr. Priya Raman (Authorized Reviewer)',
      },
    ],
    documentChecks: [
      {
        name: 'Hospital Estimate Letter',
        status: 'Verified',
        note: 'Hospital seal, signature of Medical Director, and itemized procedure codes verified by human reviewer.',
      },
      {
        name: 'Clinical Echo & Diagnostic Report',
        status: 'Verified',
        note: 'Confirmed severe mitral regurgitation consistent with proposed surgical procedure.',
      },
      {
        name: 'Government Support Check (CMCHIS)',
        status: 'Verified',
        note: 'Tamil Nadu Chief Minister Comprehensive Scheme authorization letter confirmed for ₹1,00,000.',
      },
    ],
    hasInconsistency: false,
  },
  {
    id: 'CF-CHN-2026-00142',
    patientName: 'Aarav M.',
    patientAge: 7,
    patientGender: 'Male',
    treatment: 'Pediatric Oncology Therapy',
    treatmentCategory: 'Pediatric',
    hospital: 'Verified Hospital, Chennai',
    hospitalAddress: 'Adyar Medical Zone, Chennai, Tamil Nadu 600036',
    city: 'Chennai, Tamil Nadu',
    diagnosisSummary: 'Acute Lymphoblastic Leukemia (B-ALL) requiring Phase 2 consolidation chemotherapy protocol.',
    patientStory:
      'Seven-year-old Aarav requires 12 weeks of specialized pediatric chemotherapy. The hospital charity foundation provided an initial concession, but high-dependency pharmacy costs remain pending.',
    totalTreatmentCost: 650000,
    insuranceConfirmed: 150000,
    governmentSupportConfirmed: 200000,
    hospitalAssistance: 50000,
    familyContribution: 50000,
    existingDonations: 20000,
    verifiedFundingGap: 180000,
    alreadyRaised: 120000,
    stillNeeded: 60000,
    status: 'Approved',
    verifiedByTitle: 'Authorized Hospital Representative',
    verifierName: 'Sister Mary Teresa (Pediatric Oncology Coordinator)',
    verificationDate: '06 Oct 2026',
    verificationReference: 'CF-VER-2026-00142',
    hospitalAccountReference: 'Patient Escrow A/C 011982736 (Chennai)',

    aiScreeningState: 'Completed',
    humanReviewState: 'Completed',
    finalDecisionState: 'Approved',

    aiAssistance: {
      checkedSummary: 'Pediatric protocol and diagnostic reports checked.',
      checkedItems: [
        'Chemotherapy cycle duration and medication code alignment checked',
        'State pediatric oncology grant verified with state database',
      ],
      possibleInconsistencies: [],
      supportingInformation: ['Biopsy confirmation uploaded and dated within last 30 days'],
      confidenceExplanation: 'Clear document records. Ready for human authorization.',
    },
    humanDecisions: [
      {
        decision: 'Approve',
        decidedBy: 'Sister Mary Teresa',
        reviewerRole: 'Authorized Clinical Coordinator',
        decidedAt: '06 Oct 2026, 04:00 PM',
        notes: 'Protocol cleared. Verified funding gap of ₹1,80,000 confirmed for community escrow support.',
      },
    ],

    timeline: [
      {
        stepNumber: 1,
        title: 'Information Submitted',
        status: 'Completed',
        date: '01 Oct 2026',
        explanation: 'Hospital oncology protocol and bone marrow biopsy reports submitted.',
        reviewerRole: 'Patient Desk',
      },
      {
        stepNumber: 2,
        title: 'AI Check Completed',
        status: 'Completed',
        date: '02 Oct 2026',
        explanation: 'CareFund checked the submitted information for missing or inconsistent details.',
        reviewerRole: 'Automated AI Check',
      },
      {
        stepNumber: 3,
        title: 'Human Review',
        status: 'Completed',
        date: '05 Oct 2026',
        explanation: 'Authorized hospital coordinator reviewed state grant overlap and treatment schedule.',
        reviewerRole: 'Authorized Clinical Coordinator',
      },
      {
        stepNumber: 4,
        title: 'Final Decision',
        status: 'Completed',
        date: '06 Oct 2026',
        explanation: 'Authorized human reviewer made the final decision to approve the verified case.',
        reviewerRole: 'Sister Mary Teresa (Authorized Reviewer)',
      },
    ],
    documentChecks: [
      {
        name: 'Pediatric Oncology Protocol',
        status: 'Verified',
        note: 'Approved by pediatric oncology board and human reviewer.',
      },
      {
        name: 'Hospital Pharmacy Subsidy Form',
        status: 'Verified',
        note: 'Hospital assistance of ₹50,000 deducted directly on estimation billing.',
      },
    ],
    hasInconsistency: false,
  },
  {
    id: 'CF-CHN-2026-00179',
    patientName: 'Muthusamy V.',
    patientAge: 54,
    patientGender: 'Male',
    treatment: 'Renal Transplant Preparation',
    treatmentCategory: 'Transplant',
    hospital: 'Verified Hospital, Chennai',
    hospitalAddress: 'Omandurar Healthcare Hub, Anna Salai, Chennai, Tamil Nadu 600002',
    city: 'Chennai, Tamil Nadu',
    diagnosisSummary: 'End-Stage Renal Disease (ESRD) under pre-transplant workup and bi-weekly hemodialysis.',
    patientStory:
      'Muthusamy is undergoing HLA cross-matching and donor fitness screening for a scheduled kidney transplant.',
    totalTreatmentCost: 580000,
    insuranceConfirmed: 100000,
    governmentSupportConfirmed: 250000,
    hospitalAssistance: 30000,
    familyContribution: 50000,
    existingDonations: 0,
    verifiedFundingGap: 150000,
    alreadyRaised: 0,
    stillNeeded: 150000,
    status: 'Human Review Required',
    verifiedByTitle: 'Pending Human Decision',
    verifierName: 'Awaiting Authorized Reviewer',
    verificationDate: 'Pending Decision',
    verificationReference: 'CF-VER-2026-00179-PEND',
    hospitalAccountReference: 'Hospital Escrow A/C 339182740 (Chennai)',

    aiScreeningState: 'Completed',
    humanReviewState: 'In Progress',
    finalDecisionState: 'Not yet decided',

    aiAssistance: {
      checkedSummary: 'AI identified a potential line-item discrepancy for reviewer inspection.',
      checkedItems: [
        'Transplant committee authorization checked and confirmed valid',
        'Compared pharmacy estimate slip with hospital billing catalog',
      ],
      possibleInconsistencies: [
        'Pharmacy estimate slip shows ₹35,000 variance compared to standard dialysis medicine pricing',
        'Hospital estimate slip is awaiting updated physician counter-signature',
      ],
      supportingInformation: [
        'Patient identity and government welfare card verified',
      ],
      confidenceExplanation: 'AI flagged document discrepancy for human decision. AI cannot reject or approve this case.',
    },
    humanDecisions: [],

    timeline: [
      {
        stepNumber: 1,
        title: 'Information Submitted',
        status: 'Completed',
        date: '04 Oct 2026',
        explanation: 'Transplant committee clearance and pre-surgical estimate uploaded.',
        reviewerRole: 'Patient Desk',
      },
      {
        stepNumber: 2,
        title: 'AI Check Completed',
        status: 'Completed',
        date: '05 Oct 2026',
        explanation: 'CareFund checked the submitted information and identified a pharmacy slip line-item variance for human review.',
        reviewerRole: 'Automated AI Check',
      },
      {
        stepNumber: 3,
        title: 'Human Review',
        status: 'In Progress',
        date: '08 Oct 2026',
        explanation: 'Authorized clinical reviewer evaluating pharmacy quotation variance directly with hospital desk.',
        reviewerRole: 'CareFund Clinical Review Desk',
      },
      {
        stepNumber: 4,
        title: 'Final Decision',
        status: 'Upcoming',
        explanation: 'Awaiting authorized human decision: Approve, Request More Information, Send for Further Review, or Reject.',
        reviewerRole: 'Awaiting Authorized Reviewer',
      },
    ],
    documentChecks: [
      {
        name: 'Transplant Committee Authorization',
        status: 'Verified',
        note: 'State organ sharing registry authorization valid.',
      },
      {
        name: 'Pharmacy Estimate Slip',
        status: 'Needs Review',
        note: 'Pharmacy bill estimate shows ₹35,000 variance with standard hospital catalog.',
      },
    ],
    hasInconsistency: true,
    inconsistencyTitle: 'Potential Inconsistency',
    inconsistencyReason: 'Pharmacy estimate line-item variance between submitted scan and hospital catalog.',
    inconsistencyNotes:
      'We noticed a ₹35,000 difference in medication estimate quotes between the uploaded quotation slip and the hospital pharmacy billing record. Authorized reviewer must decide next step.',
    isResolved: false,
  },
  {
    id: 'CF-CHN-2026-00155',
    patientName: 'Saravanan K.',
    patientAge: 34,
    patientGender: 'Male',
    treatment: 'Emergency Trauma & Orthopedic Reconstruction',
    treatmentCategory: 'Trauma & Ortho',
    hospital: 'Verified Hospital, Chennai',
    hospitalAddress: 'Mount Poonamallee Medical Corridor, Chennai 600089',
    city: 'Chennai, Tamil Nadu',
    diagnosisSummary: 'Polytrauma compound fracture femur & pelvic stabilization following road accident.',
    patientStory:
      'Saravanan, a delivery partner, suffered severe pelvic and femoral fractures. Emergency stabilization completed; donor funding covered the urgent internal fixation surgical expenses.',
    totalTreatmentCost: 420000,
    insuranceConfirmed: 100000,
    governmentSupportConfirmed: 80000,
    hospitalAssistance: 40000,
    familyContribution: 50000,
    existingDonations: 0,
    verifiedFundingGap: 150000,
    alreadyRaised: 150000,
    stillNeeded: 0,
    status: 'Fully Funded',
    verifiedByTitle: 'Authorized Hospital Representative',
    verifierName: 'Dr. K. Senthil Nathan (Trauma Registrar)',
    verificationDate: '28 Sep 2026',
    verificationReference: 'CF-VER-2026-00155',
    hospitalAccountReference: 'Hospital Escrow A/C 449210087 (Chennai)',

    aiScreeningState: 'Completed',
    humanReviewState: 'Completed',
    finalDecisionState: 'Approved',

    aiAssistance: {
      checkedSummary: 'Emergency admission sheet and surgical implant bills verified.',
      checkedItems: ['Implant serial numbers checked', 'Hospital trauma admission order verified'],
      possibleInconsistencies: [],
      supportingInformation: ['Emergency trauma surgeon verification letter attached'],
      confidenceExplanation: 'High consistency. Clear emergency care documentation.',
    },
    humanDecisions: [
      {
        decision: 'Approve',
        decidedBy: 'Dr. K. Senthil Nathan',
        reviewerRole: 'Authorized Trauma Registrar',
        decidedAt: '28 Sep 2026, 02:15 PM',
        notes: 'Emergency protocol confirmed. Funding gap verified at ₹1,50,000.',
      },
    ],

    timeline: [
      {
        stepNumber: 1,
        title: 'Information Submitted',
        status: 'Completed',
        date: '25 Sep 2026',
        explanation: 'Emergency admission sheet, orthopedic surgical estimate uploaded.',
        reviewerRole: 'Emergency Desk',
      },
      {
        stepNumber: 2,
        title: 'AI Check Completed',
        status: 'Completed',
        date: '26 Sep 2026',
        explanation: 'CareFund checked the submitted information for missing or inconsistent details.',
        reviewerRole: 'Automated AI Check',
      },
      {
        stepNumber: 3,
        title: 'Human Review',
        status: 'Completed',
        date: '27 Sep 2026',
        explanation: 'Hospital trauma registrar and clinical reviewer verified emergency hardware bills and hospital bed costs.',
        reviewerRole: 'Authorized Trauma Desk',
      },
      {
        stepNumber: 4,
        title: 'Final Decision',
        status: 'Completed',
        date: '28 Sep 2026',
        explanation: 'Authorized human reviewer made the final decision to approve and disburse verified escrow funds.',
        reviewerRole: 'Dr. K. Senthil Nathan (Authorized Reviewer)',
      },
    ],
    documentChecks: [
      {
        name: 'Emergency Trauma Admission Record',
        status: 'Verified',
        note: 'Clinical severity verified by human registrar.',
      },
      {
        name: 'Surgical Implant Bill Estimate',
        status: 'Verified',
        note: 'Hospital authorized medical hardware cost verified.',
      },
    ],
    hasInconsistency: false,
  },
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    receiptId: 'CF-RCP-2026-8812',
    caseId: 'CF-CHN-2026-00124',
    patientName: 'Kavitha R.',
    amount: 5000,
    donorName: 'Anand Kumar',
    timestamp: '08 Oct 2026, 10:14 AM',
    paymentMethod: 'UPI (Bank Ref 881204)',
    hospitalRecipient: 'Verified Hospital, Chennai',
    status: 'Payment Confirmed',
  },
  {
    receiptId: 'CF-RCP-2026-8810',
    caseId: 'CF-CHN-2026-00124',
    patientName: 'Kavitha R.',
    amount: 15000,
    donorName: 'Radha Swaminathan',
    timestamp: '08 Oct 2026, 09:30 AM',
    paymentMethod: 'Net Banking (Chennai)',
    hospitalRecipient: 'Verified Hospital, Chennai',
    status: 'Payment Confirmed',
  },
  {
    receiptId: 'CF-RCP-2026-8794',
    caseId: 'CF-CHN-2026-00142',
    patientName: 'Aarav M.',
    amount: 10000,
    donorName: 'Vikram Chandran',
    timestamp: '07 Oct 2026, 04:45 PM',
    paymentMethod: 'UPI (Direct Escrow)',
    hospitalRecipient: 'Verified Hospital, Chennai',
    status: 'Payment Confirmed',
  },
  {
    receiptId: 'CF-RCP-2026-8650',
    caseId: 'CF-CHN-2026-00155',
    patientName: 'Saravanan K.',
    amount: 25000,
    donorName: 'Suresh & Preeti',
    timestamp: '28 Sep 2026, 03:20 PM',
    paymentMethod: 'Direct Escrow Transfer',
    hospitalRecipient: 'Verified Hospital, Chennai',
    status: 'Reconciled',
  },
];
