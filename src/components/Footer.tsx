import { CareFundLogo } from './CareFundLogo';
import { Lock, Building2, PhoneCall, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-1 space-y-3">
            <CareFundLogo size="md" />
            <p className="cf-secondary text-xs text-neutral-600 leading-relaxed">
              Transparent medical crowdfunding platform connecting patients, verified hospitals, and donors with strict verification and direct escrow settlements.
            </p>
            <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-600">
              <span className="font-semibold text-neutral-900 block mb-0.5">Core Trust Principle</span>
              AI assists verification. Humans make critical decisions.
            </div>
          </div>

          {/* Col 2: Hospital Verification Network */}
          <div className="space-y-2.5">
            <h4 className="cf-card-heading text-sm text-neutral-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-red-600" />
              Verified Hospital Partners
            </h4>
            <ul className="cf-secondary text-xs space-y-1.5 text-neutral-600">
              <li>Apollo Hospitals, Greams Road, Chennai</li>
              <li>Cancer Institute (WIA), Adyar, Chennai</li>
              <li>MIOT International, Manapakkam</li>
              <li>Institute of Child Health (ICH), Egmore</li>
              <li>Govt Multi Super Speciality, Omandurar</li>
            </ul>
          </div>

          {/* Col 3: Donor Safeguards */}
          <div className="space-y-2.5">
            <h4 className="cf-card-heading text-sm text-neutral-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-red-600" />
              Donor Safeguards
            </h4>
            <ul className="cf-secondary text-xs space-y-1.5 text-neutral-600">
              <li>Direct hospital account settlements (0% cash to individuals)</li>
              <li>Transparent funding gap calculation</li>
              <li>Itemized hospital invoice reconciliation</li>
              <li>80G Tax Exemption receipts</li>
              <li>Strict patient privacy protection</li>
            </ul>
          </div>

          {/* Col 4: Verified Desk Contact */}
          <div className="space-y-2.5">
            <h4 className="cf-card-heading text-sm text-neutral-900">Hospital Liaison Desk</h4>
            <p className="cf-secondary text-xs text-neutral-600">
              Assisting patients, clinical coordinators, and donors across Tamil Nadu.
            </p>
            <div className="cf-secondary text-xs space-y-1.5 pt-1 text-neutral-700">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-neutral-500" />
                <span>+91 44 2829 0124 (Chennai Desk)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>verification@carefund.org.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 CareFund Medical Trust. All medical cases verified with partner hospitals in Chennai, India.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Hospital Verification Charter</span>
            <span>Escrow Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
