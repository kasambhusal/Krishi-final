// app/layout.js or app/layout.tsx

"use client";
import "./globals.css";

import { Suspense } from "react";
import React, { useEffect, useState } from "react";
import ClientSideNav from "./Components/MainComponents/ClientSideNav";
import Footer from "./Components/MainComponents/Footer";
import { usePathname } from "next/navigation";
import { NavigationProvider } from "./Components/Context/NavigationContext";
import { AuthorProvider } from "./Components/Context/AuthorContext";
import { CountProvider } from "./Components/Context/CountContext";
import { ThemeProvider } from "./Components/Context/ThemeContext";
import { NewsSearchProvider } from "./Components/Context/searchNewsContext";
import { GoogleTagManager } from "@next/third-parties/google"; // Import Google Tag Manager

import Head from "next/head";

const GTM_ID = "GTM-P8XNQCHW"; // Replace with your actual GTM ID

export default function RootLayout({ children }) {
  const [isNav, setIsNav] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Correct the condition
    setIsNav(!pathname.includes("/dashboard"));
  }, [pathname]); // Add `pathname` as a dependency to re-run the effect when it changes.

  return (
    <html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          href="https://cms.krishisanjal.com/media/author/logo_2.jpg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#12801e" />
        <meta
          name="description"
          content="KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources."
        />
        <meta property="twitter:site" content="@Krishisanjal" />
        <meta property="twitter:title" content="Home" />
        <meta property="twitter:url" content="https://www.krishisanjal.com/" />
        <meta name="robots" content="max-image-preview:large" />
        <meta property="og:title" content="KrishiSanjal - Empowering Farmers" />
        <meta
          property="og:description"
          content="KrishiSanjal provides vital agricultural information and resources to farmers in Nepal."
        />
        <meta
          property="og:image"
          content="https://cms.krishisanjal.com/media/author/logo_2.jpg"
        />

        <meta property="fb:app_id" content="1090711906078716" />

        <meta property="og:url" content="https://krishisanjal.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="KrishiSanjal - Empowering Farmers"
        />
        <meta
          name="twitter:description"
          content="Providing agricultural resources to farmers across Nepal."
        />
        <meta
          name="twitter:image"
          content="https://cms.krishisanjal.com/media/author/logo_2.jpg"
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <body >
        <React.StrictMode>
          <NavigationProvider>
            <CountProvider>
              <AuthorProvider>
                <ThemeProvider>
                  <NewsSearchProvider>
                    <GoogleTagManager gtmId={GTM_ID} />{" "}
                    <div className="sticky top-[-201px] sm:top-[-121px] z-50">
                      <Suspense fallback={<div>Loading...</div>}>
                        <ClientSideNav />
                      </Suspense>
                    </div>
                    <div>{children}</div>
                    {isNav && <Footer />}
                  </NewsSearchProvider>
                </ThemeProvider>
              </AuthorProvider>
            </CountProvider>
          </NavigationProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
