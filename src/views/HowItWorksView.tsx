import React from 'react';
import { ShieldCheck, HeartHandshake, Building2, CheckCircle2, Lock, Eye, AlertCircle, ArrowDown, UserCheck } from 'lucide-react';
import { WhereMoneyGoesCard } from '../components/WhereMoneyGoesCard';
import { PrivacyNoticeCard } from '../components/PrivacyNoticeCard';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import { FourStepReviewStepper } from '../components/FourStepReviewStepper';

export const HowItWorksView: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Standard Page Structure: Title & Description */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>The CareFund Standard of Healthcare Trust</span>
        </div>
        <h1 className="cf-title text-neutral-900 tracking-tight">
          How CareFund Protects Patients, Donors & Hospitals
        </h1>
        <p className="cf-body text-neutral-600 max-w-2xl mx-auto text-base">
          A transparent medical crowdfunding platform designed by healthcare professionals. AI assists with initial screening, but authorized humans make every critical decision.
        </p>
      </div>

      <TrustMessageBanner />

      {/* Rule 7: Every Screen Must Explain Itself */}
      <section className="cf-card bg-neutral-50/80 border-neutral-200">
        <h3 className="cf-card-heading text-neutral-900 text-sm font-semibold uppercase tracking-wider mb-3">
          CareFund Platform Governance Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What is this?
            </span>
            <p className="font-semibold text-neutral-900">Healthcare Trust Charter</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              The ethical and financial governance rules governing every rupee raised on CareFund.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              Why does it matter?
            </span>
            <p className="font-semibold text-neutral-900">Zero Financial Diversion</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Protects donors against unverified claims and ensures patient treatments are fully funded.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What do I need to do?
            </span>
            <p className="font-semibold text-neutral-900">Review the Trust Chain</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Understand our human verification, mathematical gap formula, and hospital escrow rules.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] font-semibold text-neutral-500 block uppercase mb-1">
              What happens next?
            </span>
            <p className="font-semibold text-neutral-900">Audit & Case Closure</p>
            <p className="cf-secondary text-neutral-600 mt-0.5">
              Every completed case is audited against verified hospital discharge billing receipts.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Core Trust Model: Human Decision Control (Rule 1) */}
      <section className="cf-card space-y-5">
        <div className="border-b border-neutral-100 pb-3">
          <h2 className="cf-section-heading text-neutral-900">
            1. Core Principle: Human Must Always Make the Final Decision
          </h2>
          <p className="cf-body text-neutral-600 mt-1">
            AI can never approve or reject a medical case. In CareFund, AI assists with initial screening; authorized humans have the sole authority to decide.
          </p>
        </div>

        {/* Workflow Diagram as specified in Prompt */}
        <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
          <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
            Official Decision Control Flow:
          </p>
          
          <div className="space-y-2 text-xs font-medium">
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-800">1. Patient submits hospital estimate & clinical records</span>
              <span className="text-neutral-500 text-[11px]">Intake</span>
            </div>
            <div className="text-center text-neutral-400">↓</div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-800">2. AI assists with initial screening & checks format integrity</span>
              <span className="text-neutral-500 text-[11px]">Advisory Check</span>
            </div>
            <div className="text-center text-neutral-400">↓</div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-800">3. System highlights possible inconsistencies for human attention</span>
              <span className="text-amber-700 text-[11px]">Flagging Only</span>
            </div>
            <div className="text-center text-neutral-400">↓</div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-800">4. Authorized human reviewer & hospital representative check the records</span>
              <span className="text-neutral-700 text-[11px]">Clinical Examination</span>
            </div>
            <div className="text-center text-neutral-400">↓</div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-300 flex items-center justify-between">
              <span className="text-red-900 font-bold">5. HUMAN MAKES THE FINAL DECISION (Approve / Reject / More Info)</span>
              <span className="text-red-700 font-semibold text-[11px] bg-red-100 px-2 py-0.5 rounded">Binding Authority</span>
            </div>
            <div className="text-center text-neutral-400">↓</div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-800">6. System records the decision, reviewer name, role, and reason</span>
              <span className="text-emerald-700 text-[11px]">Audit Logged</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Canonical 4-Step Review System */}
      <section className="space-y-3">
        <div className="border-b border-neutral-100 pb-2">
          <h2 className="cf-section-heading text-neutral-900">
            2. The 4-Step Review System
          </h2>
          <p className="cf-body text-neutral-600 mt-1">
            Every case follows four clear stages before community support begins:
          </p>
        </div>
        <FourStepReviewStepper
          currentStage={3}
          decisionMaker="Dr. Priya Raman (Chief Medical Social Worker)"
          decisionDate="Live Audit Queue"
          decisionReason="Clinical estimate counter-signed by hospital surgical team."
        />
      </section>

      {/* 3. The Transparent Financial Formula (Rule 14) */}
      <section className="cf-card space-y-4">
        <h2 className="cf-section-heading text-neutral-900">2. The Transparent Financial Formula</h2>
        <p className="cf-body text-neutral-600 leading-relaxed">
          CareFund never shows confusing calculations. We enforce one strict formula:
        </p>

        <div className="p-5 bg-neutral-900 text-white rounded-xl space-y-3 font-mono text-xs sm:text-sm">
          <p className="text-red-400 font-bold uppercase tracking-wider text-xs font-sans">
            Verified Funding Gap Calculation:
          </p>
          <div className="p-3 bg-neutral-800/80 rounded-lg text-emerald-400 font-semibold leading-relaxed">
            Verified Funding Gap = Total Verified Treatment Cost − Confirmed Support − Existing Donations
          </div>
          <p className="text-neutral-400 text-xs font-sans">
            Confirmed Support includes: Confirmed Insurance, Approved Government Schemes (e.g. CMCHIS), Hospital Assistance, and Patient Family Contribution.
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700">
          <strong>Non-negotiable rule:</strong> Only CONFIRMED/APPROVED support reduces the funding gap.
        </div>
      </section>

      {/* 3. The Complete Verification Trust Chain (Rule 21) */}
      <section className="cf-card space-y-4">
        <h2 className="cf-section-heading text-neutral-900">3. The 11-Step Verification Trust Chain</h2>
        <div className="space-y-2.5 text-xs">
          {[
            { step: '1. Patient Information', desc: 'Patient or family submits medical diagnosis and admission records.' },
            { step: '2. AI Initial Screening', desc: 'Automated format check checks dates and math. Flags potential items for review.' },
            { step: '3. Authorized Hospital Verification', desc: 'Hospital social work desk confirms surgical procedure and cost breakdown.' },
            { step: '4. Human Review if Required', desc: 'Clinical desk examines government grant overlaps and line items.' },
            { step: '5. Human Final Decision', desc: 'Authorized human officer signs off with binding approval.' },
            { step: '6. Verified Funding Gap', desc: 'Strict shortfall is locked and published for public community support.' },
            { step: '7. Donor Support', desc: 'Community contributes directly via UPI or Net Banking.' },
            { step: '8. Verified Medical Expense', desc: 'Funds ring-fenced for itemized surgery, ICU, and pharmacy billing.' },
            { step: '9. Payment Confirmation', desc: 'Direct bank transfer executed into verified hospital escrow account.' },
            { step: '10. Reconciliation', desc: 'Hospital bill receipt matched with disbursed funding amount.' },
            { step: '11. Case Closure', desc: 'Patient discharged, audit trail completed, and final ledger closed.' },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div>
                <p className="font-semibold text-neutral-900">{item.step}</p>
                <p className="cf-secondary text-neutral-600 text-[11px]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Where Does the Money Go? */}
      <WhereMoneyGoesCard hospitalName="Accredited Hospital Partner, Chennai" />

      {/* 5. Privacy Protection */}
      <PrivacyNoticeCard />
    </div>
  );
};
