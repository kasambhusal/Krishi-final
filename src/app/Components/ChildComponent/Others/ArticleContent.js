import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import PDFViewer from "../Others/PDFViewer";
import { useTheme } from "../../Context/ThemeContext";

const ArticleContent = React.memo(({ news, image = true }) => {
  const { themeColor, bgColor } = useTheme();

  const renderYouTubeEmbed = (url) => {
    const videoId = url.split("v=")[1];
    return (
      <div className="aspect-w-16 aspect-h-9 my-4">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  };

  const renderHtmlContent = (htmlString) => {
    if (!htmlString) return <p>No content to display.</p>;

    const sanitizedHtml = DOMPurify.sanitize(htmlString, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

    // Replace YouTube links with embeds
    const contentWithEmbeds = sanitizedHtml.replace(
      /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/g,
      (match) => renderYouTubeEmbed(match)
    );

    return (
      <div
        dangerouslySetInnerHTML={{ __html: contentWithEmbeds }}
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
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </figure>
      ) : null}

      <div
        style={{ backgroundColor: bgColor }}
        className="p-4 rounded-lg "
      >
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
