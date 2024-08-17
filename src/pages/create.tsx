import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import Image from 'next/image';
import withAuth from '../components/withAuth';
import { Input } from '@/components/ui/input';
import dotenv from 'dotenv';

dotenv.config();

function Create() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [inputParam, setInputParam] = useState('1');
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState('fal-ai/flux/dev');
  const [imageSize, setImageSize] = useState('landscape_4_3');
  const { isAuthenticated, user } = useAuth0();
  const emojiSeries = ['🖼️', '🎨', '🖌️', '🖼️'];

  useEffect(() => {
    if (isAuthenticated) {
      setInputParam(user?.sub || '');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const cachedImage = localStorage.getItem('generatedImage');
    if (cachedImage) {
      setGeneratedImage(cachedImage);
    }
  }, []);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % emojiSeries.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateImage = async () => {
    if (!isAuthenticated) {
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
      // Check token balance
      const tokenCheckResponse = await fetch('/api/tokens/check-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.sub, tokens_required: 1 }), // Assuming 1 token per image generation
      });

      if (!tokenCheckResponse.ok) {
        const tokenCheckError = await tokenCheckResponse.json();
        throw new Error(tokenCheckError.error || 'Failed to check token balance');
      }

      // Generate image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FAL_KEY}`, // Access the FAL_KEY from the environment variable
        },
        body: JSON.stringify({ prompt, inputParam, model: selectedModel, imageSize }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      if (result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        localStorage.setItem('generatedImage', result.imageUrl);
        await savePromptToDatabase(result.imageUrl, user?.sub);
      } else {
        setError('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError((error as Error).message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const savePromptToDatabase = async (imageUrl: string, user_id: string = '') => {
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
            <Link href="/" passHref>
              <div className="block py-2 px-4 text-center hover:bg-gray-700">Home</div>
            </Link>
          </li>
          {/* Add more navigation items here */}
        </ul>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Create</h1>
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="mb-4"
        />
        <button
          onClick={generateImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isGenerating}
        >
          {isGenerating ? emojiSeries[currentEmojiIndex] : 'Generate Image'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {generatedImage && (
          <div className="mt-8">
            <Image src={generatedImage} alt="Generated" width={500} height={500} />
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Create);