import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import he from "he"; // Make sure to install it: npm install he
import PDFViewer from "../Others/PDFViewer";
import { useTheme } from "../../Context/ThemeContext";

const ArticleContent = React.memo(({ news, image = true }) => {
  const { bgColor } = useTheme();

  const renderHtmlContent = (htmlString) => {
    if (!htmlString) return <p>No content to display.</p>;

    // Step 1: Decode HTML entities
    const decodedHtml = he.decode(htmlString);

    // Step 2: Add inline styles to iframe
    const styledHtml = decodedHtml.replace(
      /<iframe/g,
      '<iframe style="max-width:100%; max-height:400px; width:100%; border-radius:10px;"'
    );

    // Step 3: Sanitize HTML allowing iframe and necessary attributes
    const sanitizedHtml = DOMPurify.sanitize(styledHtml, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: [
        "allow",
        "allowfullscreen",
        "frameborder",
        "scrolling",
        "src",
        "height",
        "width",
        "title",
        "style",
        "referrerpolicy",
      ],
    });

    return (
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className="content prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
        style={{ lineHeight: "1.6", wordWrap: "break-word" }}
      />
    );
  };

  return (
    <article className="flex flex-col gap-6 w-full news-content">
      {(news.image || news.media_image) && image ? (
        <figure className="relative aspect-video">
          <Image
            src={news.image || news.media_image}
            alt={news.news_title}
            fill
            className="rounded-lg object-cover"
          />
        </figure>
      ) : null}

      <div style={{ backgroundColor: bgColor }} className="p-4 rounded-lg ">
        {renderHtmlContent(news.news_post)}
      </div>

      {news.table_html && (
        <div className="overflow-x-auto">
          {renderHtmlContent(news.table_html)}
        </div>
      )}

      {news.pdf_document && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Related Document</h2>
          <PDFViewer pdfUrl={news.pdf_document} />
        </div>
      )}
    </article>
  );
});

ArticleContent.displayName = "ArticleContent";

export default ArticleContent;
