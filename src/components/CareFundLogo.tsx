import React from 'react';

interface CareFundLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
}

export const CareFundLogo: React.FC<CareFundLogoProps> = ({
  className = '',
  size = 'md',
  subtitle,
}) => {
  const sizeConfig = {
    sm: {
      text: 'text-base',
      plusIcon: 'w-3.5 h-3.5',
    },
    md: {
      text: 'text-xl',
      plusIcon: 'w-4.5 h-4.5',
    },
    lg: {
      text: 'text-2xl',
      plusIcon: 'w-5.5 h-5.5',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center tracking-tight font-bold text-neutral-900 select-none">
        <span className={`${config.text} font-bold text-neutral-900 tracking-tight`}>CareFund</span>
        <span
          className="inline-flex items-center justify-center ml-1 text-red-600 font-bold leading-none select-none"
          title="CareFund +"
          aria-label="CareFund Plus"
        >
          {/* Professional plus symbol with crisp geometric proportions */}
          <svg
            className={`${config.plusIcon} inline-block fill-current text-red-600 transition-transform`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
            />
          </svg>
        </span>
      </div>
      {subtitle && (
        <span className="text-xs font-medium text-neutral-500 border-l border-neutral-300 pl-2 ml-0.5">
          {subtitle}
        </span>
      )}
    </div>
  );
};
