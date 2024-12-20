import { Mukta } from "next/font/google";
import Main from "./Main";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

export const metadata = {
  title: "KrishiSanjal",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  keywords:
    "Nepalese farmers, agriculture, farming knowledge, agricultural resources, KrishiSanjal, farming tips, crop management",
  icons: {
    icon: "https://cms.krishisanjal.com/media/author/logo_2.jpg",
  },
  url: "https://krishisanjal.com",
  openGraph: {
    title: "Krishi Sanjal",
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
    siteName: "Krishi Sanjal",
    images: [
      {
        url: "https://cms.krishisanjal.com/media/author/logo_2.jpg",
        width: 1260,
        height: 800,
      },
    ],
    type: "website",
  },
};

export default function App() {
  return (
    <div className={`${mukta.className} antialiased`}>
      <Main />
    </div>
  );
}
