import Advertisement from "../../Components/ChildComponent/DashboardComponents/Advertisement";
import React from "react";

export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};

export default function page() {
  return (
    <div>
      <Advertisement />
    </div>
  );
}
