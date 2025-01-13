import './globals.css';
import { Inter, Montserrat } from 'next/font/google';
import { Header } from '@/components/header/Header';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata = {
  title: 'Travel Itinerary Generator',
  description: 'Create personalized travel itineraries with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-white">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
