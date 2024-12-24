import React from "react";
import MyVideo from "../Components/MainComponents/MyVideo";
export async function generateMetadata() {
  return {
    title: "KrishiSanjal | Videos",
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}
export default function page() {
  return <MyVideo />;
}
