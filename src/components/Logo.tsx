import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", showTagline = false }) => {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={import.meta.env.VITE_LOGO_URL}
        alt="C Square Cafe"
        className={className}
        onError={(e) => {
          // Fallback to a professional restaurant logo from Unsplash
          e.currentTarget.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=200&q=80';
        }}
      />
      {showTagline && (
        <p className="mt-2 text-sm font-medium tracking-wider text-brown-900">
          TASTE FEEL REPEAT
        </p>
      )}
    </div>
  );
};