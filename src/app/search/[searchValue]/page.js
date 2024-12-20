import React from "react";
import SearchPage from "../../en/search/[searchValue]/page";
export async function generateMetadata({ params }) {
  return {
    title: `KrishiSanjal | Search: ${decodeURIComponent(params.searchValue) || "unknown"}`,
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}
export default function page() {
  return <SearchPage />;
}
