import React from 'react';
import Tabs from '@/components/ui/tabs/Tabs';
import TabContent from '@/components/ui/tabContent/TabContent';

const DetailsTabs = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Details</h2>
      <Tabs tabs={[
        { value: 'model', label: 'Model' },
        { value: 'printer', label: 'Printer' },
        { value: 'paper', label: 'Paper' },
        { value: 'ink', label: 'Ink' }
      ]}>
        <TabContent value="model">
          <p className="text-gray-400 mb-2">Our FLUX.1 model is state-of-the-art, designed for fast and high-quality image generation. It supports various configurations to suit different needs, from quick iterations to professional-grade outputs.</p>
        </TabContent>
        <TabContent value="printer">
          <p className="text-gray-400 mb-2">We use top-of-the-line printers that ensure high resolution and color accuracy. Our printers are maintained regularly to provide the best quality prints for your images.</p>
        </TabContent>
        <TabContent value="paper">
          <p className="text-gray-400 mb-2">Our prints are made on premium quality paper that enhances the vibrancy and longevity of your images. We offer various paper types, including glossy, matte, and fine art paper.</p>
        </TabContent>
        <TabContent value="ink">
          <p className="text-gray-400 mb-2">We use high-quality inks that provide rich colors and sharp details. Our inks are fade-resistant, ensuring that your prints remain vibrant for years to come.</p>
        </TabContent>
      </Tabs>
    </div>
  );
};

export default DetailsTabs;