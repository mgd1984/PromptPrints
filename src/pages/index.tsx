import { useSession } from 'next-auth/react';
import Link from 'next/link';
import netlifyIdentity from 'netlify-identity-widget'; // Import the netlifyIdentity module

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-extrabold mb-6 text-white">Gener8or Studio</h1>
        <p className="text-xl mb-8">Prompt-to-Print, Promptly</p>

        {session ? (
          <Link href="/create">
            <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
              Start a New Print
            </button>
          </Link>
        ) : (
          <Link href="/auth/signin">
            <button
              onClick={() => {
                (netlifyIdentity as any).open();
              }}
              className="bg-green-700 hover:bg-green-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Sign In
            </button>
          </Link>
        )}
      </div>

      <footer className="text-center mt-8 absolute bottom-0 w-full p-10">
        <a href="https://blackforestlabs.ai" className="text-gray-500 hover:text-purple-500">Powered by BFL's FLUX.1 Model Fam</a>
      </footer>
    </div>
  );
}
