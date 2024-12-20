import Login from "../../Components/MainComponents/Login";
import React from "react";
export const metadata = {
  title: "KrishiSanjal | Dashboard",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};
export default function page() {
  return (
    <div>
      <Login />
    </div>
  );
}
