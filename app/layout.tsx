import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/components/providers/LocationProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationModal } from "@/components/layout/LocationModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { StickyCartBar } from "@/components/cart/StickyCartBar";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rent Cameras & Lenses in Chennai, Bengaluru & Coimbatore | FlexGear",
    template: "%s | FlexGear Camera Rentals",
  },
  description:
    "Get branded DSLR, Cinema Cameras, GoPro cameras, lights, audio and lenses for rent in Chennai, Bengaluru, Coimbatore and Hyderabad. Book online or visit our store. Open 24/7.",
  keywords: [
    "camera rental Chennai",
    "lens rental Bengaluru",
    "camera hire Coimbatore",
    "Sony FX3 rental",
    "Nanlite rental",
    "film production equipment rental India",
    "DJI drone rental",
    "DSLR rental",
  ],
  authors: [{ name: "FlexGear Rentals" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://flexgear.rentals",
    title: "Rent Cameras & Lenses in Chennai, Bengaluru & Coimbatore | FlexGear",
    description: "Get branded DSLR, Cinema cameras, and lenses for rent. Book online or visit our store.",
    siteName: "FlexGear",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#f3f3f3] font-sans text-gray-900 antialiased flex flex-col selection:bg-lenstiger selection:text-white">
        <ToastProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <LocationModal />
              <CartDrawer />
              <StickyCartBar />
            </CartProvider>
          </LocationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
