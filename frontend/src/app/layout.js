import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./index.scss";
import UiProviders from "@/app/UiProviders";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_SECURE_URL ||
  "https://int.billifty.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Billifty",
  description: "Billifty invoicing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UiProviders>{children}</UiProviders>
      </body>
    </html>
  );
}
