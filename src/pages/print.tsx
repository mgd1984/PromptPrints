import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Label from '@/components/ui/typography/Label';
import { Input } from '@/components/ui/input';
import Tabs from '@/components/ui/tabs/Tabs';
import TabContent from '@/components/ui/tabContent/TabContent';
import RadioGroup from '@/components/ui/radioGroup/RadioGroup'; 
import NumberInput from '@/components/ui/numberInput/NumberInput';
import PrintJobForm from '@/components/printJobForm';
import usePrintPage from '../hooks/usePrintPage';
import withAuth from '@/components/withAuth';

const PrintPage = () => {
  useSession();
  const {
    imageUrl,
    error,
    size,
    setSize,
    quantity,
    setQuantity,
    paperType,
    setPaperType,
    handlePrintJob,
    calculatePrice,
    handlePayment,
  } = usePrintPage();

  const sizes = {
    small: { name: 'Small' },
    medium: { name: 'Medium' },
    large: { name: 'Large' },
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-l from-gray-900 to-gray-800 text-white">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-48 h-screen fixed left-0 top-0 flex flex-col items-center py-6">
        <h2 className="text-2xl font-bold mb-4">Navigation</h2>
        <ul className="w-full">
          <li className="w-full">
            <Link href="/">
              <div className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded transition duration-300">Home</div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/create">
              <div className="block py-2 px-4 w-full text-left hover:bg-gray-700 rounded transition duration-300">Prompt</div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/print">
              <div className="block py-2 px-4 w-full text-left bg-gray-700 rounded transition duration-300">Print</div>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 ml-48 p-4">
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Print Your Image</h2>
          {error ? (
            <div className="text-center text-red-500 mb-4">{error}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Image Preview */}
              <div className="w-full">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="bg-white shadow-lg rounded-lg p-4">
                    <div className="bg-gray-50 rounded-lg border-2 border-gray-300 p-4">
                      <div className="border-4 border-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt="Print Preview"
                          layout="responsive"
                          width={300}
                          height={300}
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <PrintJobForm {...{onSubmit: handlePrintJob}} />
              {/* Print Options and Pricing */}
              <div className="w-full flex flex-col">
                <Tabs tabs={[
                  { value: 'size', label: 'Size' },
                  { value: 'paper', label: 'Paper' },
                  { value: 'quantity', label: 'Quantity' },
                ]}>
                  <TabContent value="size">
                    <RadioGroup
                      options={Object.entries(sizes).map(([value, { name }]) => ({ value, label: name }))}
                      value={size}
                      onChange={setSize}
                    />
                  </TabContent>
                  <TabContent value="paper">
                    <RadioGroup
                      options={[
                        { value: 'matte', label: 'Matte' },
                        { value: 'glossy', label: 'Glossy' }
                      ]}
                      value={paperType}
                      onChange={setPaperType}
                    />
                  </TabContent>
                  <TabContent value="quantity">
                    <NumberInput 
                      label="Quantity" 
                      value={quantity} 
                      onChange={setQuantity} 
                      min={1} 
                      max={100} 
                      step={1} 
                      unit="pcs" 
                    />
                  </TabContent>
                </Tabs>

                <div className="mt-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
                    <p className="text-l font-bold text-center text-white">${calculatePrice()}</p>
                  </div>

                  <div id="card-container" className="mt-4 bg-white p-4 rounded-lg"></div>

                  <button
                    onClick={handlePayment}
                    className="w-full py-2 text-white bg-gradient-to-r from-purple-600 to-blue-700 rounded-md hover:from-green-700 hover:to-green-800 flex items-center justify-center transition-all duration-200 mt-4"
                  >
                    Order Print
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-4 w-full p-2">
          <a href="https://blackforestlabs.ai" className="text-gray-500 hover:text-purple-500 transition duration-300">
            Powered by BFL's FLUX.1 Model Fam
          </a>
        </footer>
      </div>
    </div>
  );
};

export default withAuth(PrintPage);