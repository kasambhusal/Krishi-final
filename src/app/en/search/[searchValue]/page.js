import React from "react";
import SearchPage from "../../../Components/MainComponents/SearchPage";
export async function generateMetadata({ params }) {
  return {
    title: `KrishiSanjal | Searchpage`,
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}
export default function page() {
  return <SearchPage />;
}
