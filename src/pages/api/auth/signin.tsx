import React from 'react';
import dynamic from 'next/dynamic';

export const runtime = 'edge';

const NetlifyAuthClient = dynamic(() => import('../../../components/NetlifyAuthClient'), { ssr: false });

export default function SignIn() {
  const handleAuth = (user: any) => {
    window.location.href = '/';
  };

  return <NetlifyAuthClient onAuth={handleAuth} />;
}