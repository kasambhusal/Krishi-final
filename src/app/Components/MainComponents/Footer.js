import React from "react";
import MyFooter from "./MyFooter";
import { Mukta } from "next/font/google";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"], // You can choose subsets based on your needs
  variable: "--font-mukta",
});

export default function Footer() {
  return (
    <div className={`${mukta.className} antialiased`}>
      <MyFooter />
    </div>
  );
}
