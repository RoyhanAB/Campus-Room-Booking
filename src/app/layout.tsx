import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Peminjaman Ruangan UNTIRTA",
  description: "Sistem peminjaman ruangan Universitas Sultan Ageng Tirtayasa",
  icons: {
    icon: [
      { url: '/logo.ico', type: 'image/x-icon' },
    ],
    shortcut: '/logo.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
