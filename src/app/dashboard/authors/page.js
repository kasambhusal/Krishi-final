import React from "react";
import Authors from "../../Components/ChildComponent/DashboardComponents/Authors";

export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};
export default function page() {
  return (
    <div>
      <Authors />
    </div>
  );
}
