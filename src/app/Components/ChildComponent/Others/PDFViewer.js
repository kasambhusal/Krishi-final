import React from "react";
import { Button, Card } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  const fileName = pdfUrl.split("/").pop(); // Extract file name from URL

  return (
    <div className="my-[30px]">
      <a href={pdfUrl} target="_blank" className="text-[#0a540b] font-bold">
        {fileName}
      </a>
    </div>
  );
};

export default PDFViewer;
