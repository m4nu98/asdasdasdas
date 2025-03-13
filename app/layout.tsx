import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/components/cart-provider';
import { SessionProviderWrapper } from '@/components/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elegance Bags | Luxury Handbags & Accessories',
  description: 'Discover our exclusive collection of designer handbags, purses, and accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProviderWrapper>
          <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}