import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forefathers Karaoke | Private Karaoke Rooms in Morristown, NJ",
  description:
    "Private karaoke rooms in Morristown, NJ. BYOB & BYOF friendly. Book your revolutionary singing experience today!",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${raleway.variable} antialiased`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {process.env.NODE_ENV === "production" && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="d7255fe1-b4d2-419d-87cf-88b1a00e88ed"
          />
        )}
        {children}
      </body>
    </html>
  );
}
