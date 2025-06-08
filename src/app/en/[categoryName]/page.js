import { Mukta } from "next/font/google";
import CategoryPage from "../../Components/MainComponents/CategoryPage";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

export const metadata = {
  title: "KrishiSanjal | CategoryPage",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};

async function fetchInitialNews(categoryName, language = "en") {
  try {
    const response = await fetch(
      `https://cms.krishisanjal.com/krishi_cms/api/v1/public/news/get-news-by-category?q=${encodeURIComponent(categoryName)}&language=${language}&limit=10&offset=0`,
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const newsResults = data.results || [];

    return {
      categoryName: decodeURIComponent(categoryName),
      isValidCategory: newsResults.length > 0,
      initialNews: newsResults,
      hasMore: newsResults.length === 10, // If we got 10 items, there might be more
      totalCount: data.count || newsResults.length,
    };
  } catch (error) {
    console.error("Error fetching initial news:", error);
    return {
      categoryName: decodeURIComponent(categoryName),
      isValidCategory: false,
      initialNews: [],
      hasMore: false,
      totalCount: 0,
    };
  }
}

export default async function Page({ params }) {
  const { categoryName, isValidCategory, initialNews, hasMore, totalCount } =
    await fetchInitialNews(params.categoryName);

  return (
    <div className={`${mukta.className} antialiased`}>
      <CategoryPage
        categoryName={categoryName}
        isValidCategory={isValidCategory}
        initialNews={initialNews}
        hasMore={hasMore}
        totalCount={totalCount}
      />
    </div>
  );
}
