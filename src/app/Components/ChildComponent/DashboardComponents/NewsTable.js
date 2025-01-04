"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, message, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import NewsModify from "./NewsModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image";

const NewsTable = ({ reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const { searchValue } = useNewsSearch();
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/news/news";

      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });
      const responseData = hasContent ? response.news : response;
      const requiredData = responseData
        .filter((item) => item.language === lge)
        .sort((a, b) => {
          if (b.self_date !== a.self_date) {
            return b.self_date.localeCompare(a.self_date);
          }
          return b.id - a.id;
        });
      const transformedData = requiredData.map((item) => ({
        key: item.id,
        language: item.language,
        news_title: item.news_title,
        news_sub_title: item.news_sub_title,
        author_name: item.author_name,
        news_post: item.news_post,
        self_date: item.self_date,
        image: hasContent
          ? `https://cms.krishisanjal.com${item.media_image || item.image}`
          : item.media_image || item.image,
        active: item.active,
        breaking_news: item.breaking_news,
        pdf_document: item.pdf_document,

        category: item.category,
        category_name: item.category_name,
        category_key: item.category_key,
      }));
      setDataSource(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error?.response?.data?.code === "token_not_valid") {
        localStorage.removeItem("Token");
        message.error("Not a valid token");
      }
    } finally {
      setLoading(false);
    }
  }, [lge, searchValue]);

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [fetchData, setReload, reload, searchValue]);

  const showModal = (news, modalType) => {
    setSelectedNews(news);
    switch (modalType) {
      case "edit":
        setIsModalOpen(true);
        break;
      case "delete":
        setIsDeleteModalOpen(true);
        break;
      case "preview":
        setIsPreviewModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCancel = (modalType) => {
    switch (modalType) {
      case "edit":
        setIsModalOpen(false);
        break;
      case "delete":
        setIsDeleteModalOpen(false);
        break;
      case "preview":
        setIsPreviewModalOpen(false);
        break;
      default:
        break;
    }
    setSelectedNews(null);
  };

  const handleDelete = async () => {
    if (!selectedNews) return;
    setDeleteLoading(true);
    const newsId = selectedNews.key;
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({ url: `/news/news/${newsId}`, headers });
      message.success("News item deleted successfully!");
      setDeleteLoading(false);
      handleCancel("delete");
      await fetchData();
    } catch (error) {
      console.error("Error deleting news:", error);
      message.error("Failed to delete news item!");
    } finally {
      setDeleteLoading(false);
      handleCancel("delete");
    }
  };

  const columns = [
    {
      title: "S.N",
      dataIndex: "key",
      render: (_, __, index) => index + 1,
      width: 50,
    },
    {
      title: "News Title",
      dataIndex: "news_title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "News Sub Title",
      dataIndex: "news_sub_title",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "self_date",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (text) =>
        text ? (
          <Image
            src={text}
            alt="News"
            width={80}
            height={50}
            className="w-[80px] h-[50px]"
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 50,
              backgroundColor: "#f0f0f0",
            }}
          ></div>
        ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Edit">
            <Button
              type="primary"
              onClick={() => showModal(record, "edit")}
              className="bg-white text-black"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="danger" onClick={() => showModal(record, "delete")}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="Preview">
            <Button type="default" onClick={() => showModal(record, "preview")}>
              <EyeOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
      width: 150,
    },
  ];

  const renderHtmlContent = (htmlString) => {
    const parseOembed = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Find all <oembed> tags
      const oembedElements = doc.querySelectorAll("oembed");
      oembedElements.forEach((oembed) => {
        const url = oembed.getAttribute("url");

        if (url) {
          let embedUrl = url;

          // Handle YouTube URLs
          if (url.includes("youtube.com/watch")) {
            const videoId = new URL(url).searchParams.get("v");
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
          }

          // Replace <oembed> with an <iframe>
          const iframe = document.createElement("iframe");
          iframe.setAttribute("src", embedUrl);
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "true");
          iframe.style.width = "100%";
          iframe.style.height = "400px";
          oembed.replaceWith(iframe);
        }
      });

      return doc.body.innerHTML;
    };

    // Parse and replace <oembed> tags in the HTML string
    const processedHtml = parseOembed(htmlString);

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: processedHtml || "<p>No content to display.</p>",
        }}
        className="content"
        style={{ lineHeight: "1.6", wordWrap: "break-word" }}
      />
    );
  };
  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Modify News"
        open={isModalOpen}
        onCancel={() => handleCancel("edit")}
        footer={null}
        className="min-w-[60vw]"
      >
        <NewsModify
          modifyObj={selectedNews}
          fetchData={fetchData}
          handleCancel2={() => handleCancel("edit")}
        />
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        okButtonProps={{
          style: { backgroundColor: "blue" },
          loading: deleteLoading,
        }}
        onCancel={() => handleCancel("delete")}
        confirmLoading={deleteLoading}
      >
        <p>Are you sure you want to delete this news item?</p>
      </Modal>
      <Modal
        title="News Preview"
        open={isPreviewModalOpen}
        onCancel={() => handleCancel("preview")}
        footer={null}
        width="90vw"
      >
        {selectedNews && (
          <div>
            <div className="flex flex-col gap-[20px] max-w-full">
              <div style={{ width: "100%" }}>
                {renderHtmlContent(selectedNews.news_post)}
              </div>
              {selectedNews.table_html &&
                renderHtmlContent(selectedNews.table_html)}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsTable;
