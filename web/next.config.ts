import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'danangfantasticity.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default withPayload(nextConfig);
