import React from "react";
import Contact from "../../Components/ChildComponent/DashboardComponents/Contact";

export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};
export default function page() {
  return (
    <div>
      <Contact />
    </div>
  );
}
