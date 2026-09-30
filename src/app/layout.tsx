import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AuraShop | Premium Minimalist Tech Accessories & Gear",
  description: "Discover a curated catalog of high-fidelity audio equipment, machined keyframes, smartwatches, and weatherproof urban gear. Minimal design, maximal precision.",
  keywords: ["premium tech", "minimalist design", "mechanical keyboard", "audiophile headphones", "smartwatch", "urban backpack"],
  openGraph: {
    title: "AuraShop | Premium Minimalist Tech Accessories & Gear",
    description: "Discover a curated catalog of high-fidelity audio equipment, machined keyframes, smartwatches, and weatherproof urban gear.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
