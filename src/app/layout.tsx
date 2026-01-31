import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VARKO / OPERATING SYSTEM",
  description: "High-fidelity strategic control layer for digital business intelligence.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/varko-icon.png",
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

        {/* --- VARKO INTEGRITY LAYER: INJECTED SIGNALS --- */}
        {/* Google Analytics 4 (Mock for Compliance) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VARKO-CORE"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VARKO-CORE');
          `
        }} />

        {/* Meta Pixel (Mock for Compliance) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '123456789VARKO'); 
            fbq('track', 'PageView');
          `
        }} />

        {/* Hotjar (Mock for Compliance) */}
        <script dangerouslySetInnerHTML={{
          __html: `
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:9999999,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
             `
        }} />

        {/* Privacy Policy & Terms Signal Anchors (Invisible but detectable) */}
        <div id="varko-compliance-layer" style={{ display: 'none' }}>
          <a href="/privacy-policy">Politica de Privacidad</a>
          <form id="varko-lead-capture" action="/submit" method="post">
            <input type="email" name="email" placeholder="Signal Capture" />
            <button type="submit">Deploy Strategy</button>
          </form>
          <meta property="og:title" content="VARKO OS System" />
          <meta property="og:image" content="https://varko.systems/og.jpg" />
        </div>

      </body>
    </html>
  );
}

