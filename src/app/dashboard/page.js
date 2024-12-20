import React from "react";
import Review from "../Components/ChildComponent/DashboardComponents/Review";

export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};

export default function dashboard() {
  return (
    <div>
      <Review />
    </div>
  );
}
