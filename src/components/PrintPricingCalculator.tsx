import React, { useState, useEffect } from 'react';

const PrintPricingCalculator = () => {
  const [size, setSize] = useState('13x19');
  const [quantity, setQuantity] = useState(1);
  const [paperCost, setPaperCost] = useState(0.1);
  const [inkCost, setInkCost] = useState(0.5);
  const [laborCost, setLaborCost] = useState(20);
  const [markup, setMarkup] = useState(30);
  const [previewColor, setPreviewColor] = useState('#4A90E2');
  const [resolution, setResolution] = useState(300);

  const sizes: { [key: string]: { width: number; height: number; name: string } } = {
    '13x19': { width: 13, height: 19, name: '13x19 (Portrait)' },
    '19x13': { width: 19, height: 13, name: '19x13 (Landscape)' },
    '12x12': { width: 12, height: 12, name: '12x12 (Square)' }
  };

  const calculatePrice = () => {
    const { width, height } = sizes[size];
    const area = width * height;
    const materialCost = (paperCost + inkCost) * area * quantity;
    const totalLaborCost = laborCost * (quantity / 100);
    const subtotal = materialCost + totalLaborCost;
    const markupAmount = subtotal * (markup / 100);
    const totalPrice = subtotal + markupAmount;
    return totalPrice.toFixed(2);
  };

  const getDpiRecommendation = () => {
    const { width, height } = sizes[size];
    const maxDimension = Math.max(width, height);
    if (maxDimension <= 12) return "300 DPI for excellent quality";
    if (maxDimension <= 16) return "240 DPI for very good quality";
    return "180 DPI for good quality";
  };

  const getActualDpi = () => {
    const { width, height } = sizes[size];
    const widthDpi = Math.round(resolution / width);
    const heightDpi = Math.round(resolution / height);
    return Math.min(widthDpi, heightDpi);
  };

  useEffect(() => {
    setPreviewColor('#' + Math.floor(Math.random()*16777215).toString(16));
  }, []);

  const PreviewImage = () => {
    const { width, height } = sizes[size];
    const aspectRatio = width / height;
    const maxWidth = 250;
    const maxHeight = 250;
    
    let previewWidth, previewHeight;
    
    if (aspectRatio > maxWidth / maxHeight) {
      previewWidth = maxWidth;
      previewHeight = maxWidth / aspectRatio;
    } else {
      previewHeight = maxHeight;
      previewWidth = maxHeight * aspectRatio;
    }

    return (
      <div className="w-full h-70 flex items-center justify-center bg-gray-100 rounded-lg mb-6">
        <div 
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            backgroundColor: previewColor,
            transition: 'all 0.3s ease',
          }}
          className="shadow-lg"
        />
      </div>
    );
  };

  const NumberInput = ({ label, value, onChange, min, max, step, unit }: {
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number,
    max: number,
    step: number,
    unit: string
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-24 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span className="text-sm text-gray-500 w-12">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto shadow-xl bg-white rounded-lg">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Print Pricing Calculator</h2>
        <div className="w-full">
          <div className="grid w-full grid-cols-4 mb-8 border-b border-gray-200">
            <button className="py-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800">Size</button>
            <button className="py-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800">Quantity</button>
            <button className="py-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800">Pricing</button>
            <button className="py-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800">Resolution</button>
          </div>
          <div className="space-y-6">
            <PreviewImage />
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(sizes).map(([key, { name }]) => (
                <div key={key} className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    value={key} 
                    checked={size === key} 
                    onChange={() => setSize(key)} 
                    id={key} 
                    className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" 
                  />
                  <label htmlFor={key} className="text-sm font-medium text-gray-700">{name}</label>
                </div>
              ))}
            </div>
            <NumberInput label="Quantity" value={quantity} onChange={setQuantity} min={1} max={10} step={1} unit="pcs" />
            <NumberInput label="Paper Cost" value={paperCost} onChange={setPaperCost} min={0} max={10} step={0.01} unit="$/in²" />
            <NumberInput label="Ink Cost" value={inkCost} onChange={setInkCost} min={0} max={10} step={0.01} unit="$/in²" />
            <NumberInput label="Labor Cost" value={laborCost} onChange={setLaborCost} min={0} max={1000} step={1} unit="$/100" />
            <NumberInput label="Markup" value={markup} onChange={setMarkup} min={0} max={100} step={1} unit="%" />
            <NumberInput label="Resolution" value={resolution} onChange={setResolution} min={72} max={1200} step={1} unit="px" />
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              <p className="font-semibold">DPI Recommendation:</p>
              <p>{getDpiRecommendation()}</p>
              <p className="font-semibold mt-4">Actual DPI:</p>
              <p>{getActualDpi()} DPI</p>
            </div>
          </div>
        </div>
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
          <p className="text-4xl font-bold text-center text-white">Total Price: ${calculatePrice()}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintPricingCalculator;