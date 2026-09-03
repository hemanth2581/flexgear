import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { RentalProvider } from '../context/RentalContext';
import { AuthGate } from '../components/auth/AuthGate';
import { TopProgressBar } from '../components/layout/TopProgressBar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'FlexGear — Cinema & Production Camera Equipment Rental Platform',
  description: 'Rent RED, ARRI, Sony FX3, Canon C70 cinema cameras, anamorphic prime lenses, lighting, and audio systems with direct Firebase OTP and instant deposit escrow refund.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-surface-0 text-white font-sans antialiased min-h-screen flex flex-col selection:bg-accent selection:text-surface-0">
        <TopProgressBar />
        <AuthProvider>
          <CartProvider>
            <RentalProvider>
              <AuthGate>{children}</AuthGate>
            </RentalProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

