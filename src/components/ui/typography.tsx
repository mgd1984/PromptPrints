import React from 'react';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  className?: string;
  children: React.ReactNode;
}

const variantMapping = {
  h1: 'text-5xl font-extrabold',
  h2: 'text-4xl font-bold',
  h3: 'text-3xl font-semibold',
  h4: 'text-2xl font-medium',
  h5: 'text-xl font-medium',
  h6: 'text-lg font-medium',
  subtitle1: 'text-base font-semibold',
  subtitle2: 'text-sm font-medium',
  body1: 'text-base',
  body2: 'text-sm',
};

export const Typography: React.FC<TypographyProps> = ({ variant, className = '', children }) => {
  const Component = variant as keyof JSX.IntrinsicElements;
  const variantClassName = variantMapping[variant] || '';

  return (
    <Component className={`${variantClassName} ${className}`}>
      {children}
    </Component>
  );
};