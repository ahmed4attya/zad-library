import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'زاد المسلم | تطبيقك ومكتبتك الإسلامية الشاملة',
  description:
    'تطبيق إسلامي شامل: مواقيت الصلاة والأذان، اتجاه القبلة، القرآن الكريم والتلاوات، الأذكار وحصن المسلم، السبحة الإلكترونية، الأربعون النووية، حاسبة الزكاة، والمكتبة الوقفية.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'زاد المسلم',
  },
};

export const viewport: Viewport = {
  themeColor: '#14573A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-t="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@400;500;600;700;800;900&display=swap"
        />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
