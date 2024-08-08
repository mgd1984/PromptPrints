// File: src/components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ children }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm">
      {children}
    </p>
  );
};