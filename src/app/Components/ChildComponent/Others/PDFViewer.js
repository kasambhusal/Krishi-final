import React from "react";
import { Button, Card } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  const fileName = pdfUrl.split("/").pop(); // Extract file name from URL

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "20px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FilePdfOutlined style={{ fontSize: "2rem", color: "#d9534f" }} />
        <div>
          <h4 style={{ margin: 0 }}>{fileName}</h4>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
            PDF Document
          </p>
        </div>
      </div>
      <Button
        type="primary"
        style={{
          marginTop: "10px",
          backgroundColor: "#007bff",
          borderColor: "#007bff",
          borderRadius: "5px",
        }}
        href={pdfUrl}
        target="_blank"
        icon={<FilePdfOutlined />}
      >
        View PDF
      </Button>
    </Card>
  );
};

export default PDFViewer;
