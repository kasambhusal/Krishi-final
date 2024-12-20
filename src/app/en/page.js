import { Mukta } from "next/font/google";
import Main from "../../app/Main";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"], // You can choose subsets based on your needs
  variable: "--font-mukta",
});

export const metadata = {
  title: "KrishiSanjal",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function App() {
  return (
    <div className={`${mukta.className} antialiased`}>
      <Main />
    </div>
  );
}
