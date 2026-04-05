import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "@near-wallet-selector/modal-ui/styles.css";
import "./globals.css";
import { NearWalletProvider } from "@/app/features/wallet/context/near-wallet-provider";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kenrou Investments",
  description: "A polished NEAR-native investment interface with wallet-first access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <NearWalletProvider>{children}</NearWalletProvider>
      </body>
    </html>
  );
}
