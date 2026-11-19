import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { PwaRegister } from '@/components/PwaRegister';
import './globals.css';
import faqs from '@/data/faqs.json';

export const metadata: Metadata = {
  metadataBase: new URL('https://zad-library.vercel.app'),
  title: 'زاد المسلم | تطبيقك ومكتبتك الإسلامية الشاملة',
  description:
    'تطبيق إسلامي شامل: مواقيت الصلاة والأذان، اتجاه القبلة، القرآن الكريم والتلاوات، الأذكار وحصن المسلم، السبحة الإلكترونية، الأربعون النووية، حاسبة الزكاة، والمكتبة الوقفية.',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://zad-library.vercel.app/',
  },
  verification: {
    google: 'HSmMS83miURFJ5PHJ1d23ybiA4O6wNrf83xy1hmmpto',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://zad-library.vercel.app/',
    siteName: 'زاد المسلم',
    title: 'زاد المسلم | تطبيقك ومكتبتك الإسلامية الشاملة',
    description: 'تطبيق إسلامي شامل: مواقيت الصلاة، القرآن الكريم، الأذكار، اتجاه القبلة، والمكتبة الوقفية.',
    images: [
      {
        url: '/icons/icon.svg',
        width: 512,
        height: 512,
        alt: 'زاد المسلم',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'زاد المسلم | تطبيقك ومكتبتك الإسلامية الشاملة',
    description: 'تطبيق إسلامي شامل: مواقيت الصلاة، القرآن الكريم، الأذكار، اتجاه القبلة، والمكتبة الوقفية.',
    images: ['/icons/icon.svg'],
  },
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

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'زاد المسلم',
  url: 'https://zad-library.vercel.app/',
  description:
    'تطبيق إسلامي شامل ومكتبة وقفية رقمية: القرآن الكريم، مواقيت الصلاة والأذان، اتجاه القبلة، الأذكار، وحاسبة الزكاة.',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'All',
  inLanguage: 'ar',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        <h1 className="sr-only">زاد المسلم — تطبيق ومكتبة إسلامية شاملة ومواقيت الصلاة والقرآن الكريم</h1>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
