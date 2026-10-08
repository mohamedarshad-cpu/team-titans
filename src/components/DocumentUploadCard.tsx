import React, { useRef, useState } from 'react';
import { UploadedMedicalDoc } from '../types/carefund';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Eye,
  RefreshCw,
  Trash2,
  AlertCircle,
  FileCheck2,
  FileCode,
} from 'lucide-react';

interface DocumentUploadCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  isRequired: boolean;
  uploadedDoc?: UploadedMedicalDoc;
  demoFileName?: string;
  onUpload: (doc: UploadedMedicalDoc) => void;
  onRemove: (id: string) => void;
  onViewPreview: (doc: UploadedMedicalDoc) => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  id,
  category,
  title,
  description,
  isRequired,
  uploadedDoc,
  demoFileName = 'Document_Signed.pdf',
  onUpload,
  onRemove,
  onViewPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  const maxBytes = 10 * 1024 * 1024; // 10MB

  const handleFileProcess = (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(ext)) {
      setErrorMessage('Please upload a PDF, JPG, JPEG or PNG file.');
      return;
    }

    if (file.size > maxBytes) {
      setErrorMessage('Maximum file size: 10 MB per document.');
      return;
    }

    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newDoc: UploadedMedicalDoc = {
        id,
        category,
        name: file.name,
        fileType: ext.toUpperCase(),
        size: sizeStr,
        uploadDate: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        dataUrl,
        isRequired,
        status: 'Uploaded',
        description,
      };
      onUpload(newDoc);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleUseDemo = () => {
    setErrorMessage(null);
    const ext = demoFileName.split('.').pop()?.toLowerCase() || 'pdf';
    const newDoc: UploadedMedicalDoc = {
      id,
      category,
      name: demoFileName,
      fileType: ext.toUpperCase(),
      size: '1.4 MB',
      uploadDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      isRequired,
      status: 'Uploaded',
      description,
    };
    onUpload(newDoc);
  };

  return (
    <div
      className={`p-5 rounded-xl border transition-all ${
        uploadedDoc
          ? 'bg-white border-neutral-200 shadow-xs'
          : isRequired
          ? 'bg-white border-red-200 hover:border-red-300'
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {/* Card Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="cf-card-heading text-neutral-900 font-semibold text-sm">
              {title}
            </h4>
            {isRequired ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                Required
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                Optional
              </span>
            )}
          </div>
          <p className="cf-secondary text-xs text-neutral-600 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* State A: Document has been uploaded */}
      {uploadedDoc ? (
        <div className="mt-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-neutral-900 truncate" title={uploadedDoc.name}>
                  {uploadedDoc.name}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  ✓ Uploaded
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {uploadedDoc.fileType} · {uploadedDoc.size} · Uploaded on {uploadedDoc.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
            <button
              type="button"
              onClick={() => onViewPreview(uploadedDoc)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* State B: Not yet uploaded */
        <div className="mt-3">
          <div className="border border-dashed border-neutral-300 rounded-xl p-4 text-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
            <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-neutral-800">
              PDF, JPG, JPEG or PNG
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Maximum file size: 10 MB per document
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cf-btn-primary text-xs py-1.5 px-3.5 cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload {category}</span>
              </button>
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 px-2 py-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
              >
                Use Demo File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
