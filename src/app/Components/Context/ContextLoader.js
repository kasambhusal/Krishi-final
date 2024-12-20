import React, { useState, useEffect } from "react";
import { useNavigation } from "./NavigationContext";
import { useNews } from "./NewsContext";
import { useAds } from "./AdsContext";
import { useAuthors } from "./AuthorContext";
import { useCount } from "./CountContext";
import { useTheme } from "./ThemeContext";
import { useNewsSearch } from "./searchNewsContext";
import LoadingAnimation from "../ChildComponent/Others/LoadingAnimation";

export function ContextLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const news = useNews();
  const ads = useAds();
  const authors = useAuthors();
  const count = useCount();
  const theme = useTheme();
  const newsSearch = useNewsSearch();

  useEffect(() => {
    const checkContexts = () => {
      if (
        navigation &&
        news &&
        ads &&
        authors &&
        count &&
        theme &&
        newsSearch
      ) {
        setIsLoading(false);
      }
    };

    checkContexts();
  }, [navigation, news, ads, authors, count, theme, newsSearch]);

  if (isLoading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    ); // You can replace this with a more sophisticated loading component
  }

  return children;
}
