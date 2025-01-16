import React from "react";
import Story from "../../../../../Components/MainComponents/Story";
import { Mukta } from "next/font/google";
import { notFound } from "next/navigation";

const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

async function fetchPost(postId) {
  const response = await fetch(
    `https://cms.krishisanjal.com/krishi_cms/api/v1/public/news/get-news/${postId}`,
    { method: "GET", cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }
  return response.json();
}

function extractFirstParagraph(htmlString) {
  const match = htmlString.match(/<p>(.*?)<\/p>/);
  return match ? match[1].trim() : null;
}

function generateKeywords(newsTitle) {
  const words = newsTitle.split(" ");
  return words.join(", ");
}

export async function generateMetadata({ params }) {
  const { year, month, day, newsId } = params;
  const fullUrl = `https://krishisanjal.com/story/${year}/${month}/${day}/${newsId}`;

  try {
    const post = await fetchPost(newsId);
    const firstParagraph = extractFirstParagraph(post.news_post);
    const ogDescription = firstParagraph || post.news_title;

    return {
      title: post.news_title,
      description: ogDescription,
      keywords: generateKeywords(post.news_title),
      openGraph: {
        title: post.news_title,
        description: ogDescription,
        url: fullUrl,
        siteName: "Krishi Sanjal",
        images: [
          {
            url:
              post.image ||
              post.media_image ||
              "https://cms.krishisanjal.com/media/author/logo_2.jpg",
            width: 1260,
            height: 800,
          },
        ],
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Krishi Sanjal",
      description:
        "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
    };
  }
}

export default async function Page({ params }) {
  const { newsId } = params;
  try {
    const news = await fetchPost(newsId);
    return (
      <div className={`${mukta.className} antialiased`}>
        <Story news={news} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
