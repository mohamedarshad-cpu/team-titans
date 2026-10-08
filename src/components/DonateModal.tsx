import React, { useState } from 'react';
import { MedicalCase, DonationRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { X, ShieldCheck, Heart, Building2, CheckCircle2, Download, ArrowRight } from 'lucide-react';

interface DonateModalProps {
  caseItem?: MedicalCase;
  medicalCase?: MedicalCase;
  isOpen?: boolean;
  onClose: () => void;
  onDonateSuccess: (donation: DonationRecord) => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({
  caseItem: propCaseItem,
  medicalCase: propMedicalCase,
  isOpen = true,
  onClose,
  onDonateSuccess,
}) => {
  const caseItem = propCaseItem || propMedicalCase;
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('Ramesh Sundaram');
  const [donorEmail, setDonorEmail] = useState<string>('ramesh.s@example.com');
  const [panNumber, setPanNumber] = useState<string>('ABCDE1234F');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Net Banking' | 'Card'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);

  if (!isOpen || !caseItem) return null;

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const handleSelectQuick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedReceipt: DonationRecord = {
        receiptId: `CF-RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        caseId: caseItem.id,
        patientName: caseItem.patientName,
        amount: amount,
        donorName: donorName || 'Anonymous Donor',
        timestamp: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        paymentMethod: `${paymentMethod} (Escrow Route)`,
        hospitalRecipient: caseItem.hospital,
        status: 'Payment Confirmed',
      };

      setReceipt(generatedReceipt);
      setIsSubmitting(false);
      onDonateSuccess(generatedReceipt);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h3 className="cf-card-heading text-neutral-900 text-lg">
              {receipt ? 'Donation Confirmed & Verified' : 'Donate to Verified Treatment'}
            </h3>
            <p className="cf-secondary text-xs mt-0.5">
              Case ID: <span className="font-semibold text-neutral-800">{caseItem.id}</span> · {caseItem.treatment}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {receipt ? (
            /* Success Receipt View */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="cf-card-heading text-emerald-900 text-lg">
                  Payment Confirmed to Hospital Escrow
                </h4>
                <p className="cf-secondary text-emerald-800 text-xs mt-1">
                  Your funds are ring-fenced for direct hospital billing settlement.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="cf-secondary text-xs">Receipt Number</span>
                  <span className="font-mono font-semibold text-neutral-900">{receipt.receiptId}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="cf-secondary text-xs">Verified Patient</span>
                  <span className="font-semibold text-neutral-900">{receipt.patientName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="cf-secondary text-xs">Designated Hospital</span>
                  <span className="font-semibold text-neutral-900">{receipt.hospitalRecipient}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="cf-secondary text-xs">Amount Contributed</span>
                  <span className="cf-financial-number text-xl text-neutral-900">
                    {formatINR(receipt.amount)}
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-200">
                  <span className="cf-secondary text-xs">Date & Time</span>
                  <span className="text-neutral-700">{receipt.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="cf-secondary text-xs">Hospital Settlement Status</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {receipt.status}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-200/70 text-xs text-red-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  <strong>80G Tax Exemption Eligible:</strong> A formal tax receipt and hospital settlement reconciliation report has been generated for your records.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Receipt ${receipt.receiptId} saved for ${receipt.donorName}.`)}
                  className="cf-btn-secondary flex-1"
                >
                  <Download className="w-4 h-4" />
                  Save Donation Receipt
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cf-btn-primary flex-1"
                >
                  View Case Updates
                </button>
              </div>
            </div>
          ) : (
            /* Donation Input Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Patient Summary Header */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="cf-card-heading text-sm text-neutral-900">{caseItem.patientName}</p>
                  <p className="cf-secondary text-xs flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    {caseItem.hospital}
                  </p>
                </div>
                <div className="text-right">
                  <p className="cf-secondary text-xs text-neutral-500">Amount Still Needed</p>
                  <p className="cf-financial-number text-lg text-red-600">
                    {formatINR(caseItem.stillNeeded)}
                  </p>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="cf-label block mb-1.5">
                  Select Donation Amount (₹ INR)
                </label>
                <p className="cf-secondary text-xs mb-2.5">
                  Choose a preset or enter a specific amount to reduce the medical funding gap.
                </p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {quickAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSelectQuick(val)}
                      className={`h-11 rounded-lg border text-sm font-semibold transition-all ${
                        amount === val && !customAmount
                          ? 'bg-red-600 text-white border-red-600 shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {formatINR(val)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="text"
                    placeholder="Or enter custom amount in Rupees"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full h-11 pl-8 pr-4 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-3 pt-1 border-t border-neutral-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="cf-label block text-xs mb-1">Donor Name</label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="cf-label block text-xs mb-1">Email for Receipt</label>
                    <input
                      type="email"
                      required
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="cf-label block text-xs mb-1">PAN Card Number (For 80G Tax Exemption)</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                  />
                  <span className="cf-secondary text-[11px] text-neutral-500 mt-1 block">
                    Optional. Required under Indian tax law to claim Section 80G deduction certificate.
                  </span>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="pt-1">
                <label className="cf-label block text-xs mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Net Banking', 'Card'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                        paymentMethod === method
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Disclaimer */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Direct Hospital Transfer:</strong> Your donation of {formatINR(amount)} will be credited to {caseItem.hospitalAccountReference}.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cf-btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || amount <= 0}
                  className="cf-btn-primary flex-1"
                >
                  {isSubmitting ? (
                    'Confirming Payment...'
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      Donate Now ({formatINR(amount)})
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
