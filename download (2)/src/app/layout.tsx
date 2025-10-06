import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Playfair_Display, Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Ashish Kumar',
  description: 'AI-powered virtual try-on for sarees.',
};

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased min-h-screen', playfairDisplay.variable, inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
