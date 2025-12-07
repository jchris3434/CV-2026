import createMDX from '@next/mdx';
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
  
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{hostname: 'cdn.sanity.io'}]
  }
};

const withMDX = createMDX();

export default withNextIntl(withMDX(nextConfig));