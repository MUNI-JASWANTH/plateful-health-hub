
import React from 'react';

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" fill="#4CAF50" />
      <circle cx="50" cy="50" r="35" fill="white" />
      <path d="M35 40C35 35 40 30 50 30C60 30 65 35 65 40C65 50 50 60 50 60" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 60V70" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 40C30 40 35 50 50 50C65 50 70 40 70 40" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const LogoFull: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <LogoIcon className="mr-2" />
      <span className="font-bold text-2xl text-plateful-primary">Plateful</span>
    </div>
  );
};

export default LogoIcon;
