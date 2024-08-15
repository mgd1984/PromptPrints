import React, { useState, useEffect } from 'react';
// import netlifyAuth from '../netlifyAuth'; // Ensure the path is correct
import { useAuth0 } from '@auth0/auth0-react';  // Ensure the path is correct
import Link from 'next/link';
import Image from 'next/image';
import withAuth from '../components/withAuth';
import Label from '@/components/ui/typography/Label';
import { Input } from '@/components/ui/input';
import Tabs from '@/components/ui/tabs/Tabs';
import TabContent from '@/components/ui/tabContent/TabContent';
import RadioGroup from '@/components/ui/radioGroup/RadioGroup';
import NumberInput from '@/components/ui/numberInput/NumberInput';

export default function Create() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [inputParam, setInputParam] = useState('1');
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState('fal-ai/flux/dev');
  const [imageSize, setImageSize] = useState('landscape_4_3');
  // const [user, setUser] = useState<{ id: string } | null>(null);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const emojiSeries = ['🖼️', '🎨', '🖌️', '🖼️'];

  useEffect(() => {
    if (isAuthenticated) {
      setInputParam(user?.id || '');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const cachedImage = localStorage.getItem('generatedImage');
    if (cachedImage) {
      setGeneratedImage(cachedImage);
    }
  }, []);
  
  const generateImage = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }
  
    if (!prompt || !selectedModel || !inputParam || !imageSize) {
      setError('All fields must be filled out before generating an image.');
      return;
    }
  
    setIsGenerating(true);
    setError('');
    setGeneratedImage('');
  
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, inputParam, model: selectedModel, imageSize }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
  
      const result = await response.json();
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        localStorage.setItem('generatedImage', result.imageUrl);
  
        // Save the prompt to the database with Auth0 user ID
        await savePromptToDatabase(result.imageUrl, user.id);
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePromptToDatabase = async (imageUrl: string, user_id: string) => {
    try {
      const response = await fetch('/api/prompts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          content: prompt,
          status: 'generated',
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt to database');
      }

      const data = await response.json();
      console.log('Prompt saved:', data.prompt);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setError('Error saving prompt. Image generated but not saved.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="bg-gray-900 text-white w-64 h-screen fixed left-0 top-0 flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold mb-8">Navigation</h2>
        <ul className="w-full">
          <li className="w-full">
            <Link href="/">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">Home</div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/create">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">Prompt</div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/print">
              <div className="block py-3 px-6 w-full text-left hover:bg-gray-700 rounded transition duration-300">Print</div>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/payments">
              <div className="block py-3 px-6 w-full text-left bg-gray-700 rounded transition duration-300">
                Pay
              </div>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 flex flex-col min-h-screen ml-64 p-8">
        {isGenerating ? (
          <div className="flex-grow flex items-center justify-center mb-8">
            <div className="max-w-4xl w-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center" style={{ paddingTop: '56.25%' }}>
              <div className="text-6xl animate-spin">
                {emojiSeries[currentEmojiIndex]}
              </div>
            </div>
          </div>
        ) : (
          generatedImage && (
            <div className="flex-grow flex items-center justify-center mb-8">
              <div className="max-w-4xl w-full bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <Image
                    src={generatedImage}
                    alt="Generated Image"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      setError('Failed to load the generated image. Please try again.');
                    }}
                  />
                </div>
              </div>
            </div>
          )
        )}

        <div className={`w-full max-w-2xl mx-auto ${generatedImage ? 'mt-auto' : 'mt-20'}`}>
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-full border-none outline-none text-left pr-16"
              placeholder="Enter your prompt"
            />
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <label htmlFor="model" className="block text-sm font-medium text-gray-300">Select Model</label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-800 text-white"
            >
              <option value="fal-ai/flux/dev">fal-ai/flux/dev</option>
              <option value="fal-ai/flux/pro">fal-ai/flux/pro</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor='image_size' className="block text-sm font-medium text-gray-300">Select Image Size</label>
            <select
              id='image_size'
              value={imageSize}
              onChange={(e) => setImageSize(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-800 text-white"
            >
              <option value='square_hd'>Square HD</option>
              <option value='square'>Square</option>
              <option value='portrait_4_3'>Portrait 4:3</option>
              <option value='portrait_16_9'>Portrait 16:9</option>
              <option value='landscape_4_3'>Landscape 4:3</option>
              <option value='landscape_16_9'>Landscape 16:9</option>
            </select>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="text-center mt-8">
            <Link href={`/print?imageUrl=${encodeURIComponent(generatedImage)}`}>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                Proceed to Print
              </button>
            </Link>
          </div>
        )}

        <footer className="text-center mt-8 w-full p-6">
          <a href="https://blackforestlabs.ai" className="text-gray-500 hover:text-purple-500 transition duration-300">
            Powered by BFL's FLUX.1 Model Fam
          </a>
        </footer>
      </div>

      {showTooltip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-3xl w-full mx-auto transition-transform transform scale-100 hover:scale-105">
            <h3 className="text-3xl font-bold mb-6">Our Process</h3>
            <p className="text-lg leading-relaxed">
              Start by entering a descriptive and creative prompt in the field below. Our system will generate an image based on your input, optimized for specific standard print sizes to ensure high-quality results. These sizes have been carefully chosen to guarantee that your prints are produced with clarity and precision on our professional-grade printers.
              <br /><br />
              Once your image is generated, you'll have the option to make additional customizations, such as adjusting colors or fine-tuning the composition. When you're happy with the final design, click "Click to Print" to complete your order.
              <br /><br />
              Note: We are committed to delivering exceptional quality by standardizing our print sizes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
