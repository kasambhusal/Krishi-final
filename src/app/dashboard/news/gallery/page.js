import React from "react";
import Gallery from "../../../Components/ChildComponent/DashboardComponents/Gallery";
export const metadata = {
  title: "KrishiSanjal | Gallery",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};
export default function page() {
  return (
    <div>
      <Gallery />
    </div>
  );
}
