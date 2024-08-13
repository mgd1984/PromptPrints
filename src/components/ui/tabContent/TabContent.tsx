// src/components/ui/tabContent/TabContent.tsx
import React from 'react';

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({ value, children }) => {
  return <div>{children}</div>;
};

export default TabContent;