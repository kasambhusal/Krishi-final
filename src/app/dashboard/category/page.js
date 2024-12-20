import React from "react";
import Category from "../../Components/ChildComponent/DashboardComponents/Category";

export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};
export default function page() {
  return (
    <div>
      <Category />
    </div>
  );
}
