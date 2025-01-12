import React from "react";
import { Mukta } from "next/font/google";
import CategoryPage from "../Components/MainComponents/CategoryPage";

// Importing Mukta font from Google Fonts
const mukta = Mukta({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
});

export const metadata = {
  title: "Lokpati | Category Page",
  description: "Category Page of Lokpati",
  icons: {
    icon: "https://cms.lokpati.com/media/author/favicon-lokpati.png",
  },
};

async function fetchData(categoryName) {
  try {
    const [categoryResponse, subCategoryResponse] = await Promise.all([
      fetch(
        "https://cms.krishisanjal.com/krishi_cms/api/v1/public/category/get-category",{
          cache: "no-store"
        }
      ),
      fetch(
        "https://cms.krishisanjal.com/krishi_cms/api/v1/public/category-key/get-categoryKey",
        {
          cache:"no-cache"
        }
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
