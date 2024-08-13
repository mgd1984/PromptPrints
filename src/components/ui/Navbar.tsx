// File: src/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { Typography } from '../ui/typography';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Typography variant="h4" className="font-bold">MyApp</Typography>
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <Link href="/" className="hover:underline">Home</Link>
            </Link>
          </li>
          <li>
            <Link href="/create">
              <Link href="/create" className="hover:underline">Prompt</Link>
            </Link>
          </li>
          <li>
            <Link href="/print">
              <Link href="/print" className="hover:underline">Print</Link>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;