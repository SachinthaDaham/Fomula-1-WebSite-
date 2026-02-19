/**
 * Root Layout — app/layout.js
 *
 * Wraps every page with the global HTML shell, fonts, and metadata.
 */

import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";

export const metadata = {
  title: "F1 Manager — Absolute Pro HUD",
  description:
    "A production-quality F1 intelligence platform built with Next.js 14 App Router. Full historical archive, live telemetry, and premium HUD aesthetics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — Inter for clean, modern typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
