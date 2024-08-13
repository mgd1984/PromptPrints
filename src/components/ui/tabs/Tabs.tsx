// src/components/ui/tabs/Tabs.tsx
import React, { useState } from 'react';

interface TabsProps {
    tabs: { value: string; label: string }[]; // Remove the icon property from the tabs array
    children: React.ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].value);

    return (
        <div>
            <div className="flex space-x-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-3 py-2 flex items-center space-x-2 ${activeTab === tab.value ? 'border-b-2 border-indigo-500' : ''}`}
                    >
                        <span>{tab.label}</span> {/* Remove the tab.icon JSX */}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {React.Children.map(children, (child) =>
                    React.isValidElement(child) && child.props.value === activeTab ? child : null
                )}
            </div>
        </div>
    );
};

export default Tabs;
