import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Insert or update user information in the database via API route
      fetch('/api/upsertUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).catch((error) => {
        console.error('Error upserting user:', error);
      });
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-gradient">
          Gener8or Studio
        </h1>

        <Image
          src="/images/img7.png"
          alt="Description of image"
          width={800}
          height={600}
          className="mx-auto"
        />

        <div className="my-8"></div>

        {isAuthenticated ? (
          <>
            <Link href="/create">
              <button className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
                Start a New Print
              </button>
            </Link>
            <button
              onClick={() => logout()}
              className="ml-4 bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Sign In
          </button>
        )}
      </div>

      {showTooltip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-3xl w-full mx-auto transition-transform transform scale-100 hover:scale-105">
            <h3 className="text-3xl font-bold mb-6">Our Process</h3>
            <div className="text-lg leading-relaxed">
              <p>Start by entering a descriptive and creative prompt in the field below. Our system will generate an image based on your input, optimized for specific standard print sizes to ensure high-quality results. These sizes have been carefully chosen to guarantee that your prints are produced with clarity and precision on our professional-grade printers.</p>
              <br />
              <p>Once your image is generated, you'll have the option to make additional customizations, such as adjusting colors or fine-tuning the composition. When you're happy with the final design, click "Click to Print" to complete your order.</p>
              <br />
              <p>Note: We are committed to delivering exceptional quality by standardizing our print sizes and optimizing the production process. As our platform grows, we plan to offer more printing options, including a wider range of sizes, materials, and finishes, to provide even greater creative flexibility.</p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
      >
        ?
      </button>

      <footer className="text-center mt-8 absolute bottom-0 w-full p-6">
        <a href="https://blackforestlabs.ai" className="text-gray-500 hover:text-purple-400 transition duration-300">
          Powered by BFL's FLUX.1 Model Fam
        </a>
        <img 
          width="40" 
          height="30" 
          src="https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk.png" 
          className="custom-logo" 
          alt="Black Forest Labs" 
          decoding="async" 
          style={{ filter: 'invert(100%)' }} 
        />
      </footer>
    </div>
  );
}