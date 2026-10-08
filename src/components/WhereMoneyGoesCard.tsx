import { ArrowRight, ShieldCheck, HeartHandshake, Building2, Receipt, CheckCheck } from 'lucide-react';

interface WhereMoneyGoesCardProps {
  hospitalName?: string;
  className?: string;
}

export const WhereMoneyGoesCard: React.FC<WhereMoneyGoesCardProps> = ({
  hospitalName = 'Verified Hospital, Chennai',
  className = '',
}) => {
  const steps = [
    {
      label: 'Donor',
      description: 'You contribute directly toward the verified funding gap.',
      icon: <HeartHandshake className="w-4 h-4 text-red-600" />,
    },
    {
      label: 'CareFund Escrow',
      description: 'Funds are securely ring-fenced in a non-interest patient trust account.',
      icon: <ShieldCheck className="w-4 h-4 text-red-600" />,
    },
    {
      label: 'Verified Medical Expense',
      description: 'Approved against real surgical, ICU, and pharmacy estimate items.',
      icon: <Receipt className="w-4 h-4 text-red-600" />,
    },
    {
      label: 'Verified Hospital',
      description: `Disbursed directly to ${hospitalName}. Zero cash handed to intermediaries.`,
      icon: <Building2 className="w-4 h-4 text-red-600" />,
    },
    {
      label: 'Reconciliation & Closure',
      description: 'Final hospital bill is checked, logged, and audited.',
      icon: <CheckCheck className="w-4 h-4 text-red-600" />,
    },
  ];

  return (
    <div className={`cf-card ${className}`}>
      <div className="border-b border-neutral-100 pb-3 mb-4">
        <h4 className="cf-card-heading text-neutral-900">Where Does Your Donation Go?</h4>
        <p className="cf-secondary mt-0.5">
          100% of community contributions go directly to verified hospital accounts for actual patient treatment.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-200/80"
          >
            <div className="w-7 h-7 rounded-full bg-white border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              {st.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="cf-card-heading text-sm font-semibold text-neutral-900">
                  {idx + 1}. {st.label}
                </span>
                {idx < steps.length - 1 && (
                  <span className="cf-secondary text-neutral-400 text-xs hidden sm:inline">
                    <ArrowRight className="w-3 h-3 inline" />
                  </span>
                )}
              </div>
              <p className="cf-body text-xs text-neutral-600 mt-0.5 leading-relaxed">
                {st.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-red-50/60 rounded-lg border border-red-200/70 text-xs text-red-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
        <p className="leading-snug">
          <strong>Direct Hospital Settlement Guarantee:</strong> Patient families never receive raw cash payouts, eliminating financial diversion.
        </p>
      </div>
    </div>
  );
};
