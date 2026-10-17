import { defaultRootMetadata } from '@/lib/seo/metadata';
import type { RootLayoutProps } from '@/types/seo';

export const metadata = defaultRootMetadata();

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
