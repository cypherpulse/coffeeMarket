import React from 'react';

interface CoffeeBeanIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const CoffeeBeanIcon: React.FC<CoffeeBeanIconProps> = ({ className = '', size = 24, style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    {...props}
  >
    <path d="M12 2C8.5 2 5.5 4.5 4.5 8C3.5 11.5 5 15 8 17.5C11 20 15 20.5 18 18.5C21 16.5 22 12.5 20.5 9C19 5.5 15.5 2 12 2ZM12 4C14.5 4 17 6 18 8.5C19 11 18.5 14 16.5 16C14.5 18 11.5 18.5 9.5 17C7.5 15.5 6.5 13 7 10.5C7.5 8 9.5 4 12 4Z"/>
    <path d="M10 7C9 8 8.5 10 9 12C9.5 14 11 15.5 12.5 15.5C14 15.5 15 14 15 12.5C15 11 14 9 12.5 8C11 7 10.5 6.5 10 7Z" opacity="0.6"/>
  </svg>
);

interface BitcoinIconProps {
  className?: string;
  size?: number;
}

export const BitcoinIcon: React.FC<BitcoinIconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.5 11.5V6.5H13.5C14.5 6.5 15.5 7 15.5 8.5C15.5 10 14.5 10.5 13.5 10.5H12V11.5H11.5ZM11.5 13V17.5H14C15 17.5 16 16.5 16 15.25C16 14 15 13 14 13H12V13H11.5Z"/>
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM14 19H12.5V21H11V19H9.5V21H8V19H6V17.5H8V6.5H6V5H8V3H9.5V5H11V3H12.5V5H14C16 5 17.5 6.5 17.5 8.5C17.5 9.5 17 10.5 16 11C17 11.5 18 12.5 18 14.5C18 17 16 19 14 19Z"/>
  </svg>
);

interface CoffeeCupIconProps {
  className?: string;
  size?: number;
}

export const CoffeeCupIcon: React.FC<CoffeeCupIconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    {/* Cup body */}
    <path
      d="M6 12H22V26C22 28.2091 20.2091 30 18 30H10C7.79086 30 6 28.2091 6 26V12Z"
      fill="currentColor"
    />
    {/* Cup handle */}
    <path
      d="M22 14H24C26.2091 14 28 15.7909 28 18V18C28 20.2091 26.2091 22 24 22H22"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    {/* Steam lines */}
    <g className="animate-steam opacity-60">
      <path
        d="M10 4C10 4 11 6 10 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
    <g className="animate-steam-delay opacity-60">
      <path
        d="M14 2C14 2 15 5 14 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
    <g className="animate-steam-delay-2 opacity-60">
      <path
        d="M18 4C18 4 19 6 18 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const SteamEffect: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="absolute left-1/4 animate-steam">
      <div className="w-1 h-4 bg-steam/40 rounded-full blur-sm" />
    </div>
    <div className="absolute left-1/2 animate-steam-delay -translate-x-1/2">
      <div className="w-1 h-5 bg-steam/30 rounded-full blur-sm" />
    </div>
    <div className="absolute right-1/4 animate-steam-delay-2">
      <div className="w-1 h-4 bg-steam/40 rounded-full blur-sm" />
    </div>
  </div>
);
