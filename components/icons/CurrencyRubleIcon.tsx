import React from 'react';

export const CurrencyRubleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H8.25m0-5.25V21m0-11.25V3m4.125 0h2.25m-2.25 18H10.5m-2.25 0h2.25m0 0h2.25m-4.5-9h4.5"
    />
  </svg>
);
