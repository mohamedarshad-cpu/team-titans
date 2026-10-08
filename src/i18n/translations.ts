export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'ar';

export interface LanguageMeta {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', dir: 'ltr' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
];

export interface TranslationDictionary {
  // Brand & Trust Motto
  brandName: string;
  motto: string;
  mottoDesc: string;

  // Nav
  navVerifiedCases: string;
  navRequestAssistance: string;
  navHospitalPortal: string;
  navReviewerAudit: string;
  navHowItWorks: string;
  switchRole: string;

  // 4 Steps
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Financial Labels
  totalTreatmentCost: string;
  confirmedSupport: string;
  verifiedFundingGap: string;
  alreadyRaised: string;
  amountStillNeeded: string;
  stillNeededDesc: string;

  // Decision Actions
  btnApprove: string;
  btnRequestMoreInfo: string;
  btnFurtherReview: string;
  btnReject: string;
  btnConfirmDecision: string;
  btnCancel: string;
  btnDonateNow: string;
  btnViewDetails: string;
  btnSubmitRequest: string;
  btnReviewCase: string;

  // Rejection Modal
  rejectionConfirmTitle: string;
  rejectionReasonLabel: string;
  rejectionReasonPlaceholder: string;
  rejectionRequiredError: string;

  // Location
  locationSearchPlaceholder: string;
  stateLabel: string;
  districtLabel: string;
  cityLabel: string;
  allDistricts: string;

  // Statuses
  statusSubmitted: string;
  statusAIChecked: string;
  statusHumanReview: string;
  statusApproved: string;
  statusRequiresInfo: string;
  statusFurtherReview: string;
  statusRejected: string;
  statusFullyFunded: string;
  statusClosed: string;

  // Common Page Titles & Flow
  whatIsThis: string;
  whyDoesItMatter: string;
  whatDoINeedToDo: string;
  whatHappensNext: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    brandName: 'CareFund',
    motto: 'AI assists. Humans decide.',
    mottoDesc: 'CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers.',

    navVerifiedCases: 'Verified Cases',
    navRequestAssistance: 'Request Assistance',
    navHospitalPortal: 'Hospital Portal',
    navReviewerAudit: 'Reviewer & Audit',
    navHowItWorks: 'How CareFund Works',
    switchRole: 'Switch Role:',

    step1Title: 'Information Submitted',
    step1Desc: 'Your information has been submitted and is ready for initial checking.',
    step2Title: 'AI Check Completed',
    step2Desc: 'CareFund checked the submitted information for missing or inconsistent details.',
    step3Title: 'Human Review',
    step3Desc: 'An authorized hospital representative or CareFund reviewer manually reviews the information.',
    step4Title: 'Final Decision',
    step4Desc: 'The authorized human reviewer makes the final binding decision.',

    totalTreatmentCost: 'Total Verified Treatment Cost',
    confirmedSupport: 'Confirmed Support',
    verifiedFundingGap: 'Verified Funding Gap',
    alreadyRaised: 'Already Raised',
    amountStillNeeded: 'Amount Still Needed',
    stillNeededDesc: 'Remaining amount required after confirmed support and existing donations.',

    btnApprove: 'Approve Case',
    btnRequestMoreInfo: 'Request More Information',
    btnFurtherReview: 'Send for Further Review',
    btnReject: 'Reject Case',
    btnConfirmDecision: 'Confirm Final Decision',
    btnCancel: 'Cancel',
    btnDonateNow: 'Donate Now',
    btnViewDetails: 'View Details',
    btnSubmitRequest: 'Submit Assistance Request',
    btnReviewCase: 'Review Case',

    rejectionConfirmTitle: 'Are you sure you want to reject this case?',
    rejectionReasonLabel: 'Reason for Decision (Required)',
    rejectionReasonPlaceholder: 'Provide the specific reason why this case cannot be approved...',
    rejectionRequiredError: 'A decision reason is mandatory before rejecting.',

    locationSearchPlaceholder: 'Search by city, district or hospital...',
    stateLabel: 'State / Union Territory',
    districtLabel: 'District',
    cityLabel: 'City / Town',
    allDistricts: 'All 38 Districts & Puducherry',

    statusSubmitted: 'Information Submitted',
    statusAIChecked: 'AI Check Completed',
    statusHumanReview: 'Human Review',
    statusApproved: 'Approved',
    statusRequiresInfo: 'More Information Required',
    statusFurtherReview: 'Further Review Required',
    statusRejected: 'Rejected',
    statusFullyFunded: 'Fully Funded',
    statusClosed: 'Case Closed',

    whatIsThis: 'What is this?',
    whyDoesItMatter: 'Why does it matter?',
    whatDoINeedToDo: 'What do I need to do?',
    whatHappensNext: 'What happens next?',
  },

  ta: {
    brandName: 'CareFund',
    motto: 'AI உதவுகிறது. மனிதர்களே தீர்மானிக்கிறார்கள்.',
    mottoDesc: 'விடுபட்ட அல்லது பொருந்தாத தகவல்களைக் கண்டறிய CareFund AI-ஐப் பயன்படுத்துகிறது. இறுதியான முடிவை எப்போதும் அங்கீகரிக்கப்பட்ட மனித அதிகாரிகளே எடுக்கிறார்கள்.',

    navVerifiedCases: 'சரிபார்க்கப்பட்ட வழக்குகள்',
    navRequestAssistance: 'உதவி கோரிக்கை',
    navHospitalPortal: 'மருத்துவமனை தளம்',
    navReviewerAudit: 'மதிப்பாய்வு & தணிக்கை',
    navHowItWorks: 'செயல்முறை விளக்கம்',
    switchRole: 'பங்கு மாற்றம்:',

    step1Title: 'தகவல் சமர்ப்பிக்கப்பட்டது',
    step1Desc: 'உங்கள் தகவல் சமர்ப்பிக்கப்பட்டு ஆரம்ப ஆய்வுக்கு தயாராக உள்ளது.',
    step2Title: 'AI ஆய்வு முடிந்தது',
    step2Desc: 'சமர்ப்பிக்கப்பட்ட தகவலில் விடுபட்ட அல்லது பொருந்தாத விவரங்களை CareFund சரிபார்த்தது.',
    step3Title: 'மனித மதிப்பாய்வு',
    step3Desc: 'அங்கீகரிக்கப்பட்ட மருத்துவமனை அதிகாரி அல்லது மதிப்பாய்வாளர் தகவலை நேரடியாகச் சரிபார்க்கிறார்.',
    step4Title: 'இறுதி முடிவு',
    step4Desc: 'அங்கீகரிக்கப்பட்ட மனித மதிப்பாய்வாளர் அதிகாரப்பூர்வ இறுதி முடிவை எடுக்கிறார்.',

    totalTreatmentCost: 'மொத்த சரிபார்க்கப்பட்ட சிகிச்சை செலவு',
    confirmedSupport: 'உறுதிசெய்யப்பட்ட ஆதரவு',
    verifiedFundingGap: 'சரிபார்க்கப்பட்ட நிதி இடைவெளி',
    alreadyRaised: 'ஏற்கனவே திரட்டப்பட்டது',
    amountStillNeeded: 'இன்னும் தேவைப்படும் தொகை',
    stillNeededDesc: 'உறுதிசெய்யப்பட்ட ஆதரவு மற்றும் நன்கொடைகளுக்குப் பிறகு தேவைப்படும் மீதித் தொகை.',

    btnApprove: 'ஒப்புதல் அளிக்கவும்',
    btnRequestMoreInfo: 'கூடுதல் தகவல் கோரவும்',
    btnFurtherReview: 'மேலதிக ஆய்வுக்கு அனுப்பவும்',
    btnReject: 'நிராகரிக்கவும்',
    btnConfirmDecision: 'இறுதி முடிவை உறுதிசெய்',
    btnCancel: 'ரத்து செய்',
    btnDonateNow: 'இப்போதே நன்கொடை அளியுங்கள்',
    btnViewDetails: 'விவரங்களைப் பார்க்கவும்',
    btnSubmitRequest: 'உதவி விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    btnReviewCase: 'வழக்கை மதிப்பாய்வு செய்யவும்',

    rejectionConfirmTitle: 'இந்த வழக்கை நீங்கள் நிச்சயமாக நிராகரிக்க விரும்புகிறீர்களா?',
    rejectionReasonLabel: 'முடிவுக்கான காரணம் (கட்டாயம்)',
    rejectionReasonPlaceholder: 'இந்த வழக்கை ஏன் அங்கீகரிக்க முடியவில்லை என்பதற்கான குறிப்பிட்ட காரணத்தைத் தெரிவிக்கவும்...',
    rejectionRequiredError: 'நிராகரிக்கும் முன் காரணம் குறிப்பிடுவது கட்டாயமாகும்.',

    locationSearchPlaceholder: 'நகரம், மாவட்டம் அல்லது மருத்துவமனை மூலம் தேடவும்...',
    stateLabel: 'மாநிலம் / யூனியன் பிரதேசம்',
    districtLabel: 'மாவட்டம்',
    cityLabel: 'நகரம் / ஊர்',
    allDistricts: 'அனைத்து 38 மாவட்டங்கள் & புதுச்சேரி',

    statusSubmitted: 'தகவல் சமர்ப்பிக்கப்பட்டது',
    statusAIChecked: 'AI ஆய்வு முடிந்தது',
    statusHumanReview: 'மனித மதிப்பாய்வு',
    statusApproved: 'ஒப்புதல் அளிக்கப்பட்டது',
    statusRequiresInfo: 'கூடுதல் தகவல் தேவை',
    statusFurtherReview: 'மேலதிக ஆய்வு தேவை',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    statusFullyFunded: 'முழு நிதியுதவி பெற்றது',
    statusClosed: 'வழக்கு முடிக்கப்பட்டது',

    whatIsThis: 'இது என்ன?',
    whyDoesItMatter: 'இது ஏன் முக்கியமானது?',
    whatDoINeedToDo: 'நான் என்ன செய்ய வேண்டும்?',
    whatHappensNext: 'அடுத்து என்ன நடக்கும்?',
  },

  hi: {
    brandName: 'CareFund',
    motto: 'AI सहायता करता है। निर्णय मनुष्य लेते हैं।',
    mottoDesc: 'CareFund अधूरी या असंगत जानकारी की पहचान करने के लिए AI का उपयोग करता है। अंतिम निर्णय हमेशा अधिकृत मानव समीक्षक ही लेते हैं।',

    navVerifiedCases: 'सत्यापित मामले',
    navRequestAssistance: 'सहायता का अनुरोध',
    navHospitalPortal: 'अस्पताल पोर्टल',
    navReviewerAudit: 'समीक्षक और ऑडिट',
    navHowItWorks: 'CareFund कैसे काम करता है',
    switchRole: 'भूमिका बदलें:',

    step1Title: 'जानकारी प्रस्तुत की गई',
    step1Desc: 'आपकी जानकारी प्रस्तुत की जा चुकी है और प्रारंभिक जांच के लिए तैयार है।',
    step2Title: 'AI जांच पूर्ण',
    step2Desc: 'CareFund ने अधूरी या असंगत जानकारी के लिए प्रस्तुत विवरणों की जांच की।',
    step3Title: 'मानव समीक्षा',
    step3Desc: 'अधिकृत अस्पताल प्रतिनिधि या समीक्षक जानकारी की व्यक्तिगत रूप से समीक्षा करते हैं।',
    step4Title: 'अंतिम निर्णय',
    step4Desc: 'अधिकृत मानव समीक्षक अंतिम बाध्यकारी निर्णय लेते हैं।',

    totalTreatmentCost: 'कुल सत्यापित उपचार लागत',
    confirmedSupport: 'पुष्ट वित्तीय सहायता',
    verifiedFundingGap: 'सत्यापित वित्तीय अंतर',
    alreadyRaised: 'पहले से जुटाई गई राशि',
    amountStillNeeded: 'अभी भी आवश्यक राशि',
    stillNeededDesc: 'पुष्ट सहायता और मौजूदा दान के बाद शेष आवश्यक राशि।',

    btnApprove: 'मामला स्वीकृत करें',
    btnRequestMoreInfo: 'अधिक जानकारी मांगें',
    btnFurtherReview: 'आगे की समीक्षा हेतु भेजें',
    btnReject: 'अस्वीकार करें',
    btnConfirmDecision: 'अंतिम निर्णय की पुष्टि करें',
    btnCancel: 'रद्द करें',
    btnDonateNow: 'अभी दान करें',
    btnViewDetails: 'विवरण देखें',
    btnSubmitRequest: 'सहायता अनुरोध सबमिट करें',
    btnReviewCase: 'मामले की समीक्षा करें',

    rejectionConfirmTitle: 'क्या आप वाकई इस मामले को अस्वीकार करना चाहते हैं?',
    rejectionReasonLabel: 'निर्णय का कारण (अनिवार्य)',
    rejectionReasonPlaceholder: 'कृपया स्पष्ट कारण बताएं कि यह मामला क्यों स्वीकृत नहीं किया जा सकता...',
    rejectionRequiredError: 'अस्वीकार करने से पहले कारण बताना अनिवार्य है।',

    locationSearchPlaceholder: 'शहर, जिला या अस्पताल द्वारा खोजें...',
    stateLabel: 'राज्य / केंद्र शासित प्रदेश',
    districtLabel: 'जिला',
    cityLabel: 'शहर / कस्बा',
    allDistricts: 'सभी 38 जिले और पुडुचेरी',

    statusSubmitted: 'जानकारी प्रस्तुत की गई',
    statusAIChecked: 'AI जांच पूर्ण',
    statusHumanReview: 'मानव समीक्षा',
    statusApproved: 'स्वीकृत',
    statusRequiresInfo: 'अधिक जानकारी आवश्यक',
    statusFurtherReview: 'आगे की समीक्षा आवश्यक',
    statusRejected: 'अस्वीकृत',
    statusFullyFunded: 'पूर्ण वित्तपोषित',
    statusClosed: 'मामला बंद',

    whatIsThis: 'यह क्या है?',
    whyDoesItMatter: 'यह क्यों महत्वपूर्ण है?',
    whatDoINeedToDo: 'मुझे क्या करना होगा?',
    whatHappensNext: 'आगे क्या होगा?',
  },

  ml: {
    brandName: 'CareFund',
    motto: 'AI സഹായിക്കുന്നു. മനുഷ്യർ തീരുമാനിക്കുന്നു.',
    mottoDesc: 'വിട്ടുപോയതോ പൊരുത്തക്കേടുകളുള്ളതോ ആയ വിവരങ്ങൾ തിരിച്ചറിയാൻ CareFund AI ഉപയോഗിക്കുന്നു. അന്തിമ തീരുമാനം എപ്പോഴും അംഗീകൃത മനുഷ്യ അവലോകകരാണ് എടുക്കുന്നത്.',

    navVerifiedCases: 'സ്ഥിരീകരിച്ച കേസുകൾ',
    navRequestAssistance: 'സഹായ അഭ്യർത്ഥന',
    navHospitalPortal: 'ഹോസ്പിറ്റൽ പോർട്ടൽ',
    navReviewerAudit: 'ഓഡിറ്റ് & റിവ്യൂ',
    navHowItWorks: 'പ്രവർത്തനരീതി',
    switchRole: 'റോൾ മാറ്റുക:',

    step1Title: 'വിവരങ്ങൾ സമർപ്പിച്ചു',
    step1Desc: 'നിങ്ങളുടെ വിവരങ്ങൾ സമർപ്പിച്ചു, പ്രാഥമിക പരിശോധനയ്ക്ക് തയ്യാറാണ്.',
    step2Title: 'AI പരിശോധന പൂർത്തിയായി',
    step2Desc: 'വിട്ടുപോയ വിവരങ്ങൾക്കോ പൊരുത്തക്കേടുകൾക്കോ ആയി സമർപ്പിച്ച രേഖകൾ പരിശോധിച്ചു.',
    step3Title: 'മനുഷ്യ പരിശോധന',
    step3Desc: 'അംഗീകൃത ആശുപത്രി പ്രതിനിധിയോ റിവ്യൂവറോ വിവരങ്ങൾ നേരിട്ട് പരിശോധിക്കുന്നു.',
    step4Title: 'അന്തിമ തീരുമാനം',
    step4Desc: 'അംഗീകൃത മനുഷ്യ ഉദ്യോഗസ്ഥൻ അന്തിമ തീരുമാനം എടുക്കുന്നു.',

    totalTreatmentCost: 'ആകെ സ്ഥിരീകരിച്ച ചികിത്സാ ചെലവ്',
    confirmedSupport: 'സ്ഥിരീകരിച്ച സഹായം',
    verifiedFundingGap: 'സ്ഥിരീകരിച്ച ഫണ്ടിംഗ് ഗ്യാപ്പ്',
    alreadyRaised: 'ഇതിനകം സമാഹരിച്ചത്',
    amountStillNeeded: 'ഇനിയും ആവശ്യമുള്ള തുക',
    stillNeededDesc: 'സ്ഥിരീകരിച്ച സഹായത്തിനും സംഭാവനകൾക്കും ശേഷം ആവശ്യമുള്ള തുക.',

    btnApprove: 'കേസ് അംഗീകരിക്കുക',
    btnRequestMoreInfo: 'കൂടുതൽ വിവരങ്ങൾ ആവശ്യപ്പെടുക',
    btnFurtherReview: 'തുടർ പരിശോധനയ്ക്ക് അയക്കുക',
    btnReject: 'നിരസിക്കുക',
    btnConfirmDecision: 'അന്തിമ തീരുമാനം സ്ഥിരീകരിക്കുക',
    btnCancel: 'റദ്ദാക്കുക',
    btnDonateNow: 'ഇപ്പോൾ സംഭാവന ചെയ്യുക',
    btnViewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    btnSubmitRequest: 'സഹായ അഭ്യർത്ഥന നൽകുക',
    btnReviewCase: 'കേസ് പരിശോധിക്കുക',

    rejectionConfirmTitle: 'ഈ കേസ് നിരസിക്കാൻ നിങ്ങൾ തീർച്ചയായും ആഗ്രഹിക്കുന്നുണ്ടോ?',
    rejectionReasonLabel: 'തീരുമാനത്തിനുള്ള കാരണം (നിർബന്ധം)',
    rejectionReasonPlaceholder: 'എന്തുകൊണ്ട് ഈ കേസ് അംഗീകരിക്കാൻ കഴിയില്ലെന്നതിന്റെ കാരണം വ്യക്തമാക്കുക...',
    rejectionRequiredError: 'നിരസിക്കുന്നതിന് മുൻപ് കാരണം വ്യക്തമാക്കേണ്ടത് നിർബന്ധമാണ്.',

    locationSearchPlaceholder: 'നഗരം, ജില്ല അല്ലെങ്കിൽ ആശുപത്രി പ്രകാരം തിരയുക...',
    stateLabel: 'സംസ്ഥാനം / കേന്ദ്രഭരണ പ്രദേശം',
    districtLabel: 'ജില്ല',
    cityLabel: 'നഗരം',
    allDistricts: 'എല്ലാ 38 ജില്ലകളും പുതുച്ചേരിയും',

    statusSubmitted: 'വിവരങ്ങൾ സമർപ്പിച്ചു',
    statusAIChecked: 'AI പരിശോധന പൂർത്തിയായി',
    statusHumanReview: 'മനുഷ്യ പരിശോധന',
    statusApproved: 'അംഗീകരിച്ചു',
    statusRequiresInfo: 'കൂടുതൽ വിവരങ്ങൾ ആവശ്യമാണ്',
    statusFurtherReview: 'തുടർ പരിശോധന ആവശ്യമാണ്',
    statusRejected: 'നിരസിച്ചു',
    statusFullyFunded: 'പൂർണ്ണമായും ധനസഹായം ലഭിച്ചു',
    statusClosed: 'കേസ് അവസാനിപ്പിച്ചു',

    whatIsThis: 'ഇതെന്താണ്?',
    whyDoesItMatter: 'ഇത് എന്തുകൊണ്ട് പ്രധാനമാണ്?',
    whatDoINeedToDo: 'ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?',
    whatHappensNext: 'അടുത്തതായി എന്ത് സംഭവിക്കും?',
  },

  ar: {
    brandName: 'CareFund',
    motto: 'الذكاء الاصطناعي يساعد. البشر يقررون.',
    mottoDesc: 'تستخدم CareFund الذكاء الاصطناعي للمساعدة في اكتشاف المعلومات الناقصة أو غير المتطابقة. القرارات النهائية يتخذها دائماً مراجعون بشريون معتمدون.',

    navVerifiedCases: 'الحالات المؤكدة',
    navRequestAssistance: 'طلب مساعدة',
    navHospitalPortal: 'بوابة المستشفى',
    navReviewerAudit: 'المراجعة والتدقيق',
    navHowItWorks: 'كيف يعمل CareFund',
    switchRole: 'تبديل الدور:',

    step1Title: 'تم تقديم المعلومات',
    step1Desc: 'تم تقديم معلوماتك وهي جاهزة للفحص الأولي.',
    step2Title: 'اكتمل فحص الذكاء الاصطناعي',
    step2Desc: 'تحققت CareFund من المعلومات المقدمة بحثاً عن أي بيانات ناقصة أو غير متطابقة.',
    step3Title: 'المراجعة البشرية',
    step3Desc: 'يقوم ممثل معتمد للمستشفى أو مراجع CareFund بمراجعة المعلومات يدوياً.',
    step4Title: 'القرار النهائي',
    step4Desc: 'يتخذ المراجع البشري المعتمد القرار النهائي الملزم.',

    totalTreatmentCost: 'إجمالي تكلفة العلاج المعتمدة',
    confirmedSupport: 'الدعم المالي المؤكد',
    verifiedFundingGap: 'فجوة التمويل المعتمدة',
    alreadyRaised: 'تم جمعه بالفعل',
    amountStillNeeded: 'المبلغ المتبقي المطلوب',
    stillNeededDesc: 'المبلغ المتبقي المطلوب بعد الدعم المؤكد والتبرعات الحالية.',

    btnApprove: 'الموافقة على الحالة',
    btnRequestMoreInfo: 'طلب معلومات إضافية',
    btnFurtherReview: 'إرسال لمزيد من المراجعة',
    btnReject: 'رفض الحالة',
    btnConfirmDecision: 'تأكيد القرار النهائي',
    btnCancel: 'إلغاء',
    btnDonateNow: 'تبرع الآن',
    btnViewDetails: 'عرض التفاصيل',
    btnSubmitRequest: 'تقديم طلب مساعدة',
    btnReviewCase: 'مراجعة الحالة',

    rejectionConfirmTitle: 'هل أنت متأكد من رغبتك في رفض هذه الحالة؟',
    rejectionReasonLabel: 'سبب القرار (مطلوب)',
    rejectionReasonPlaceholder: 'حدد السبب الدقيق لعدم إمكانية الموافقة على هذه الحالة...',
    rejectionRequiredError: 'سبب القرار إلزامي قبل الرفض.',

    locationSearchPlaceholder: 'ابحث بالمدينة أو المنطقة أو المستشفى...',
    stateLabel: 'الولاية / الإقليم',
    districtLabel: 'المنطقة',
    cityLabel: 'المدينة / البلدة',
    allDistricts: 'جميع المناطق الـ 38 وبودوتشيري',

    statusSubmitted: 'تم تقديم المعلومات',
    statusAIChecked: 'اكتمل فحص الذكاء الاصطناعي',
    statusHumanReview: 'المراجعة البشرية',
    statusApproved: 'تمت الموافقة',
    statusRequiresInfo: 'مطلوب معلومات إضافية',
    statusFurtherReview: 'مطلوب مزيد من المراجعة',
    statusRejected: 'مرفوض',
    statusFullyFunded: 'مكتمل التمويل',
    statusClosed: 'تم إغلاق الحالة',

    whatIsThis: 'ما هذا؟',
    whyDoesItMatter: 'لماذا هو مهم؟',
    whatDoINeedToDo: 'ما الذي يجب علي فعله؟',
    whatHappensNext: 'ماذا سيحدث بعد ذلك؟',
  },
};
