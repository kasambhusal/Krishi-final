"use client";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
} from "next-share";
import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookMessengerIcon,
} from "next-share"; // Import icons from react-share
import { Post } from "../../Redux/API";

const Share = ({ newsTitle, id, shareCount }) => {
  const [newsUrl, setNewsUrl] = useState(""); // Store the URL in state

  // Dynamically set the URL after the component mounts (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setNewsUrl(window.location.href); // Set the current URL of the page
    }
  }, []);

  const handleShare = async () => {
    const share_count = shareCount + 1; // Adjust the count as needed
    const myShare = { share_count };

    try {
      await Post({
        url: `/count/share/${id}/store_share_count/`,
        data: myShare,
      });
    } catch (error) {
      console.error("Error updating share count:", error);
    }
  };

  return (
    <div className="flex gap-[10px]">
      <div className="flex items-center justify-center gap-[5px]">
        <h2 className="text-[20px] font-bold text-[#8a8986]">
          {shareCount || "0"}
        </h2>
        <h2 className="text-[12px] text-[#8a8986]">Shares</h2>
      </div>

      <div className="flex gap-[10px]">
        <FacebookShareButton
          url={newsUrl}
          quote={newsTitle}
          onClick={handleShare}
          title={newsTitle}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FacebookIcon
            size={30}
            round={true}
            className="duration-[0.3s] hover:scale-[1.3]"
          />
        </FacebookShareButton>

        <TwitterShareButton
          url={newsUrl}
          title={newsTitle}
          onClick={handleShare}
          style={{ display: "flex", alignItems: "center" }}
        >
          <TwitterIcon
            size={30}
            round={true}
            className="duration-[0.3s] hover:scale-[1.3]"
          />
        </TwitterShareButton>

        <WhatsappShareButton
          url={newsUrl}
          title={newsTitle}
          onClick={handleShare}
          style={{ display: "flex", alignItems: "center" }}
        >
          <WhatsappIcon
            size={30}
            round={true}
            className="duration-[0.3s] hover:scale-[1.3]"
          />
        </WhatsappShareButton>

        <FacebookMessengerShareButton
          url={newsUrl}
          title={newsTitle}
          onClick={handleShare}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FacebookMessengerIcon
            size={30}
            round={true}
            className="duration-[0.3s] hover:scale-[1.3]"
          />
        </FacebookMessengerShareButton>
      </div>
    </div>
  );
};

export default Share;
