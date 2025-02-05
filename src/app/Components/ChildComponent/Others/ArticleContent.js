import React from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import PDFViewer from "../Others/PDFViewer";
import { useTheme } from "../../Context/ThemeContext";

const ArticleContent = React.memo(({ news }) => {
  const { themeColor, bgColor } = useTheme();
  const renderHtmlContent = (htmlString) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlString);
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedHtml || "<p>No content to display.</p>",
        }}
        className="content"
        style={{ lineHeight: "1.6", wordWrap: "break-word" }}
      />
    );
  };

  return (
    <div className="flex flex-col gap-[20px] w-full news-content">
      {(news.image || news.media_image) && (
        <Image
          src={news.image || news.media_image}
          alt={news.news_title}
          width={1200}
          height={600}
          style={{
            border: `2px dotted ${themeColor}`,
            borderRadius: "5px",
          }}
          className="w-full"
        />
      )}
      <div style={{ backgroundColor: bgColor, width: "100%" }}>
        {renderHtmlContent(news.news_post)}
      </div>
      {news.table_html && renderHtmlContent(news.table_html)}
      {news.pdf_document && <PDFViewer pdfUrl={news.pdf_document} />}
    </div>
  );
});

export default ArticleContent;
