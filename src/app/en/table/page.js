import React from "react";
import Table from "../../Components/MainComponents/Table";
export async function generateMetadata() {
  return {
    title: "KrishiSanjal | Table",
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}
export default function page() {
  return <Table />;
}
