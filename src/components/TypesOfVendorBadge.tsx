import React from 'react';

export interface TypesOfVendorProps {
  className?: string;
  label?: string;
  selectedTypes?: string[];
  onToggleType?: (type: string) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VENDOR_TYPES = [
  'Music',
  'Art',
  'Craft',
  'Food',
  'Commercial'
] as const;

export type VendorType = typeof VENDOR_TYPES[number];

/**
 * Green checkbox SVG matching the user screenshot:
 * A light square with green border and distinct green checkmark
 */
export const GreenCheckboxIcon: React.FC<{ checked?: boolean; className?: string }> = ({ 
  checked = true, 
  className = "w-4 h-4" 
}) => (
  <svg 
    className={`${className} inline-block shrink-0 transition-transform duration-150`} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Square box with green border */}
    <rect 
      x="1" 
      y="1" 
      width="14" 
      height="14" 
      rx="2" 
      className={checked ? "stroke-emerald-600 fill-emerald-50/70 dark:fill-emerald-950/40" : "stroke-gray-300 fill-white"} 
      strokeWidth="1.75" 
    />
    {/* Checkmark inside */}
    {checked && (
      <path 
        d="M3.75 8.25L6.5 11L12.25 5" 
        className="stroke-emerald-600" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    )}
  </svg>
);

export const TypesOfVendorBadge: React.FC<TypesOfVendorProps> = ({
  className = '',
  label = 'Types of Vendor:',
  selectedTypes,
  onToggleType,
  interactive = false,
  size = 'md'
}) => {
  const isChecked = (type: string) => {
    if (!selectedTypes) return true; // Default all checked like in screenshot
    return selectedTypes.includes(type);
  };

  const textSize = size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-sm' : 'text-xs';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4';

  return (
    <div className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 ${textSize} ${className}`}>
      {label && (
        <span className="font-bold text-[#1f2937] dark:text-[#2d2926] shrink-0 tracking-tight">
          {label}
        </span>
      )}
      
      <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
        {VENDOR_TYPES.map((type) => {
          const checked = isChecked(type);
          
          if (interactive && onToggleType) {
            return (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleType(type);
                }}
                className={`inline-flex items-center gap-1 font-semibold transition-all px-1 py-0.5 rounded cursor-pointer ${
                  checked 
                    ? 'text-[#111827] hover:text-emerald-700' 
                    : 'text-gray-400 opacity-60 hover:opacity-100 line-through'
                }`}
                title={`Filter by ${type}`}
              >
                <GreenCheckboxIcon checked={checked} className={iconSize} />
                <span>{type}</span>
              </button>
            );
          }

          return (
            <span 
              key={type} 
              className="inline-flex items-center gap-1 font-semibold text-[#111827] select-none"
            >
              <GreenCheckboxIcon checked={checked} className={iconSize} />
              <span>{type}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
