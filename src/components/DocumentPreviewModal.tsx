import React from 'react';
import { UploadedMedicalDoc } from '../types/carefund';
import { X, FileText, Download, Trash2, RefreshCw, ShieldCheck, Calendar, HardDrive, CheckCircle2 } from 'lucide-react';

interface DocumentPreviewModalProps {
  document: UploadedMedicalDoc | null;
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onReplaceClick: (id: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onRemove,
  onReplaceClick,
}) => {
  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-neutral-900 truncate">
                Document Preview
              </h3>
              <p className="text-xs text-neutral-500 truncate">
                {doc.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-500 block text-[11px]">File Name</span>
              <span className="font-semibold text-neutral-900 truncate block" title={doc.name}>
                {doc.name}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[11px]">Format</span>
              <span className="font-semibold text-neutral-900 uppercase">
                {doc.fileType}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[11px]">File Size</span>
              <span className="font-semibold text-neutral-900">
                {doc.size}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[11px]">Upload Date</span>
              <span className="font-semibold text-neutral-900">
                {doc.uploadDate}
              </span>
            </div>
          </div>

          {/* Visual Document Viewer Simulation */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-100/50 p-4 sm:p-6 flex flex-col items-center justify-center">
            {doc.dataUrl ? (
              doc.fileType.toLowerCase().includes('pdf') ? (
                <div className="w-full bg-white rounded-lg border border-neutral-300 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
                    <span className="font-serif font-bold text-sm text-neutral-900">Official Hospital Record Document</span>
                    <span className="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">Ref: MED-CERT-2026</span>
                  </div>
                  <div className="space-y-2 text-xs text-neutral-600">
                    <p className="font-semibold text-neutral-800">Department of Clinical Services & Patient Admissions</p>
                    <p>This certifies that the medical report and clinical documentation are uploaded for review and patient assistance evaluation.</p>
                    <div className="p-3 bg-neutral-50 rounded border border-neutral-200 font-mono text-[11px]">
                      Document: {doc.name} (Uploaded: {doc.uploadDate})
                    </div>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Authorized Signature & Seal Attached</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Readable File
                    </span>
                  </div>
                </div>
              ) : (
                <img
                  src={doc.dataUrl}
                  alt={doc.name}
                  className="max-h-80 w-auto rounded-lg shadow-sm border border-neutral-200 object-contain bg-white"
                />
              )
            ) : (
              <div className="w-full bg-white rounded-lg border border-neutral-300 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-neutral-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-sm text-neutral-900">{doc.category}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    Verified Digital Upload
                  </span>
                </div>

                <div className="space-y-2 text-xs text-neutral-600">
                  <p className="font-semibold text-neutral-800">
                    File: <span className="font-mono text-neutral-900">{doc.name}</span>
                  </p>
                  <p className="leading-relaxed">
                    This document was uploaded by the patient/family user. CareFund reviewers and hospital liaison teams will examine this file during Step 3 & 4 verification.
                  </p>
                  <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-[11px] space-y-1">
                    <p className="font-semibold text-neutral-800">Verification Guidelines:</p>
                    <p>• Make sure the patient name on this document matches the assistance request.</p>
                    <p>• Ensure the official hospital seal and doctor registration number are visible.</p>
                    <p>• Ensure estimated procedure costs match the itemized tariff statement.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Tamper-evident verification stamp</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clear & Readable
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs text-neutral-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Your Medical Documents Are Private</p>
              <p className="text-neutral-600 text-[11px] mt-0.5">
                This document is never made public or visible to donors. It is only accessible to authorized clinical reviewers and network hospital staff.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onRemove(doc.id);
              onClose();
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Document</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onReplaceClick(doc.id);
                onClose();
              }}
              className="cf-btn-secondary text-xs cursor-pointer py-2 px-3"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cf-btn-primary text-xs cursor-pointer py-2 px-4"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
