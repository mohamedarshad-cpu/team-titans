import React from 'react';

interface InfoBlockProps {
  title: string;
  value: React.ReactNode;
  explanation: string;
  highlight?: boolean;
  className?: string;
}

/**
 * Standard 3-part information structure:
 * 1. TITLE: Simple and meaningful
 * 2. VALUE / STATUS: The actual important information
 * 3. SHORT EXPLANATION: One simple sentence explaining what it means
 */
export const InfoBlock: React.FC<InfoBlockProps> = ({
  title,
  value,
  explanation,
  highlight = false,
  className = '',
}) => {
  return (
    <div
      className={`cf-card flex flex-col justify-between transition-all ${
        highlight
          ? 'border-red-200 bg-red-50/40'
          : 'border-neutral-200 bg-white'
      } ${className}`}
    >
      <div>
        <p className="cf-secondary font-medium uppercase tracking-wider text-xs mb-1.5 text-neutral-500">
          {title}
        </p>
        <div className={`cf-financial-number ${highlight ? 'text-red-700' : 'text-neutral-900'} mb-2`}>
          {value}
        </div>
      </div>
      <p className="cf-secondary text-neutral-600 border-t border-neutral-100 pt-2 mt-auto">
        {explanation}
      </p>
    </div>
  );
};
