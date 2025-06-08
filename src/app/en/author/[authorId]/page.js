import { Mukta } from "next/font/google";
import IndividualAuthor from "../../../Components/MainComponents/IndividualAuthor";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

export const metadata = {
  title: "KrishiSanjal | AuthorPage",
  description:
    "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
};

async function fetchAuthorData(authorId, language = "en") {
  try {
    const [authorResponse, newsResponse] = await Promise.all([
      fetch(
        `https://cms.krishisanjal.com/krishi_cms/api/v1/public/author/get-authors?id=${authorId}`,
        {
          next: { revalidate: 600 }, // Revalidate every 10 minutes
        }
      ),
      fetch(
        `https://cms.krishisanjal.com/krishi_cms/api/v1/public/news/get-news?language=${language}&author-id=${authorId}&limit=10&offset=0`,
        {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        }
      ),
    ]);

    if (!authorResponse.ok || !newsResponse.ok) {
      throw new Error("Failed to fetch author data");
    }

    const authorData = await authorResponse.json();
    const newsData = await newsResponse.json();

    const author = authorData && authorData.length > 0 ? authorData[0] : null;
    const newsResults = newsData.results || [];

    return {
      authorId,
      author,
      isValidAuthor: author !== null,
      initialNews: newsResults,
      hasMore: newsResults.length === 10,
      totalNewsCount: newsData.count || newsResults.length,
    };
  } catch (error) {
    console.error("Error fetching author data:", error);
    return {
      authorId,
      author: null,
      isValidAuthor: false,
      initialNews: [],
      hasMore: false,
      totalNewsCount: 0,
    };
  }
}

export default async function Page({ params }) {
  const {
    authorId,
    author,
    isValidAuthor,
    initialNews,
    hasMore,
    totalNewsCount,
  } = await fetchAuthorData(params.authorId);

  return (
    <div className={`${mukta.className} antialiased`}>
      <IndividualAuthor
        authorId={authorId}
        author={author}
        isValidAuthor={isValidAuthor}
        initialNews={initialNews}
        hasMore={hasMore}
        totalNewsCount={totalNewsCount}
      />
    </div>
  );
}
