import React from "react";
import { Mukta } from "next/font/google";
import CategoryPage from "../../Components/MainComponents/CategoryPage";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

export async function generateMetadata({ params }) {
  return {
    title: `${decodeURIComponent(params.categoryName) || "unknown"} | KrishiSanjal`,
    description:
      "KrishiSanjal empowers Nepalese farmers with agricultural knowledge and resources.",
  };
}
async function fetchData(categoryName) {
  try {
    const [categoryResponse, subCategoryResponse] = await Promise.all([
      fetch(
        "https://cms.krishisanjal.com/krishi_cms/api/v1/public/category/get-category"
      ),
      fetch(
        "https://cms.krishisanjal.com/krishi_cms/api/v1/public/category-key/get-categoryKey"
      ),
    ]);

    const categoryData = await categoryResponse.json();
    const subCategoryData = await subCategoryResponse.json();

    const isValidCategory =
      categoryData.some(
        (item) => item.category_name === decodeURIComponent(categoryName)
      ) ||
      subCategoryData.some(
        (item) => item.category_key_name === decodeURIComponent(categoryName)
      );

    return {
      categoryName,
      isValidCategory,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      categoryName,
      isValidCategory: false,
    };
  }
}

export default async function Page({ params }) {
  const { categoryName, isValidCategory } = await fetchData(
    params.categoryName
  );

  return (
    <div className={`${mukta.className} antialiased`}>
      <CategoryPage
        categoryName={decodeURIComponent(categoryName)}
        isValidCategory={isValidCategory}
      />
    </div>
  );
}
