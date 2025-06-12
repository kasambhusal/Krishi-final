"use client";
import React from "react";
import dynamic from "next/dynamic";

const News = dynamic(
  () => import("../../Components/ChildComponent/DashboardComponents/News"),
  {
    ssr: false,
    loading: () => <p>Loading....</p>,
  }
);
import { Mukta } from "next/font/google";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

// export const metadata = {
//   title: "KrishiSanjal | Dashboard",
//   description:
//     "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
// };
export default function page() {
  return (
    <div className={`${mukta.className} antialiased`}>
      <News />
    </div>
  );
}
