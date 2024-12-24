import React from "react";
import Member from "../Components/MainComponents/Members";

export async function generateMetadata() {
  return {
    title: "KrishiSanjal | Members",
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}

export default function page() {
  return (
    <div>
      <Member />
    </div>
  );
}
