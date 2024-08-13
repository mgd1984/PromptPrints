// import { useSession } from 'next-auth/react';
import Link from 'next/link';
import netlifyIdentity from 'netlify-identity-widget'; // Import the netlifyIdentity module
import Image from 'next/image'; // Import the Image component
import { useEffect, useState } from 'react'; // Import useState for managing tooltip state

interface User {
  // Define the properties of the User type here
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showTooltip, setShowTooltip] = useState(false); // State for managing tooltip visibility

  useEffect(() => {
    netlifyIdentity.on('init', (user) => {
      setUser(user);
    });
    netlifyIdentity.init();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-gradient">
          Gener8or Studio
        </h1>
        {/* <p className="text-2xl mb-8 text-gray-400">Prompt-to-Print, Promptly</p> */}

        <Image
          src="/images/img7.png" // Replace with the correct image path
          alt="Description of image"
          width={800} // Set the width of the image
          height={600} // Set the height of the image
          className="mx-auto"
        />

        <div className="my-8"></div> {/* Add some room after the image */}
        
        {user ? (
          <Link href="/create">
            <button className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75">
              Start a New Print
            </button>
          </Link>
        ) : (
          <Link href="/auth/signin">
            <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
              Sign In
            </button>
          </Link>
        )}
      </div>

      {showTooltip && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-3xl w-full mx-auto transition-transform transform scale-100 hover:scale-105">
            <h3 className="text-3xl font-bold mb-6">Our Process</h3>
            <div className="text-lg leading-relaxed">
              <p>Start by entering a descriptive and creative prompt in the field below. Our system will generate an image based on your input, optimized for specific standard print sizes to ensure high-quality results. These sizes have been carefully chosen to guarantee that your prints are produced with clarity and precision on our professional-grade printers.</p>
              <br />
              <p>Once your image is generated, you’ll have the option to make additional customizations, such as adjusting colors or fine-tuning the composition. When you’re happy with the final design, click "Click to Print" to complete your order.</p>
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
        <img width="40" height="30" src="https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk.png" className="custom-logo" alt="Black Forest Labs" decoding="async" srcSet="https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk.png 2372w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-300x228.png 300w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-1024x778.png 1024w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-768x584.png 768w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-1536x1168.png 1536w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-2048x1557.png 2048w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-500x380.png 500w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-800x608.png 800w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-1280x973.png 1280w, https://blackforestlabs.ai/wp-content/uploads/2024/07/bfl_logo_retraced_blk-1920x1459.png 1920w" sizes="(max-width: 57px) 100vw, 57px" style={{ filter: 'invert(100%)' }} />
      </footer>
    </div>
  );
}