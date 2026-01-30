import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VARKO / OPERATING SYSTEM",
  description: "High-fidelity strategic control layer for digital business intelligence.",
  icons: {
    icon: "/favicon.ico",
  }
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--signal-blue), transparent)', zIndex: 9999, opacity: 0.5 }} />
        {children}
      </body>
    </html>
  );
}

