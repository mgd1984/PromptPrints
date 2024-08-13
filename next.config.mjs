import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

nextConfig.images = {
  domains: ['fal.media'],
};

export default nextConfig;
