import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { APP_CONFIG } from "@/lib/constants";
import { getContextualKeywords } from "@/lib/seo-keywords";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dynamicKeywords = getContextualKeywords("/");

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    default: APP_CONFIG.title,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: dynamicKeywords,
  authors: APP_CONFIG.authors,
  creator: APP_CONFIG.creator,
  publisher: APP_CONFIG.publisher,
  alternates: {
    canonical: APP_CONFIG.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_CONFIG.url,
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
    images: [
      {
        url: APP_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${APP_CONFIG.name} - Real-time Chat & Team Collaboration Workspace`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    images: [APP_CONFIG.ogImage],
    creator: "@pulsechat",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": APP_CONFIG.name,
  "applicationCategory": "CommunicationApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "description": APP_CONFIG.description,
  "featureList": [
    "Real-time Socket.io bidirectional message stream",
    "DOM Virtualization for 1,000,000+ chat messages at 60fps",
    "Group conversation creation and admin controls",
    "Security rate-limiting and Content Security Policy headers",
    "Zero-flicker Dark and Light theme workspace",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function purgeNetlifyDrawer() {
                  var sel = ['netlify-drawer', '#netlify-modal-provider', '[data-netlify-deploy-preview]', 'iframe[src*="netlify"]', '.netlify-feedback-drawer', '#netlify-badge', '.netlify-badge', '.powered-by-netlify'];
                  sel.forEach(function(s) {
                    document.querySelectorAll(s).forEach(function(el) {
                      try { el.remove(); } catch(e) {}
                    });
                  });
                }
                if (typeof window !== 'undefined') {
                  window.addEventListener('DOMContentLoaded', purgeNetlifyDrawer);
                  window.addEventListener('load', purgeNetlifyDrawer);
                  try {
                    var obs = new MutationObserver(purgeNetlifyDrawer);
                    obs.observe(document.documentElement, { childList: true, subtree: true });
                  } catch(e) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen font-sans antialiased flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Providers>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
