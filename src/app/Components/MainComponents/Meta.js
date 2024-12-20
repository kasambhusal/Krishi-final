const fetchPost = async (postId) => {
  try {
    const response = await fetch(
      "https://cms.krishisanjal.com/krishi_cms/api/v1/public/news/get-news",
      { method: "GET" }
    );
    const data = await response.json();

    // If post not found, return null
    const filteredPost = data.find((item) => item.id === Number(postId));
    return filteredPost || null; // Return null if not found
  } catch (error) {
    console.error("Error fetching post:", error);
    return null; // Return null in case of error
  }
};

export async function generateMetadata({ params }) {
  let post;
  const { year, month, day, newsId } = params;  // Destructure params directly

  const fullUrl = `https://krishisanjal.com/story/${year}/${month}/${day}/${newsId}`;
  try {
    post = await fetchPost(newsId); // Use newsId directly here
  } catch (error) {
    console.error("Error fetching post:", error);
    // Fallback to default metadata if post is not found
    return {
      title: "Error",
      description: "An error occurred while fetching the news article.",
    };
  }

  // Handle the case where post is not found
  if (!post) {
    return {
      title: "Krishi Sanjal",
      description:
        "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
    };
  }

  // Metadata returned based on the fetched post
  return {
    title: post.news_title || "Krishi Sanjal",
    description: post.news_title || "Latest news from Krishi Sanjal", // Fallback description
    openGraph: {
      title: post.news_title || "Krishi Sanjal",  // Fallback title
      description: post.news_description || post.news_title || "Latest updates from Krishi Sanjal",
      url: fullUrl,
      siteName: "Krishi Sanjal",
      images: [
        {
          url: post.image || "/default-image.jpg",  // Fallback to a default image if none provided
          width: 1260,
          height: 800,
        },
      ],
      type: "website",
    },
  };
}
