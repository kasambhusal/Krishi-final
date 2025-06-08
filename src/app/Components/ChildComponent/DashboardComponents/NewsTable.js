"use client";
import { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, message, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import NewsModify from "./NewsModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image";
import ArticleContent from "../Others/ArticleContent";

const NewsTable = ({ reload, setReload, isActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const { searchValue } = useNewsSearch();
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = useCallback(
    async (page = pagination.current, pageSize = pagination.pageSize) => {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const hasContent = searchValue && /\S/.test(searchValue);
        const offset = (page - 1) * pageSize;

        const url = hasContent
          ? `/search/search/?q=${searchValue}`
          : isActive
            ? `/news/news?language=${lge}&limit=${pageSize}&offset=${offset}&active=${isActive}`
            : `/news/news?language=${lge}&active=${isActive}`;

        const response = await Get({
          url,
          headers: hasContent ? null : headers,
        });

        const responseData = hasContent
          ? response.news
          : response.results || response;

        const transformedData = responseData.map((item, index) => ({
          key: item.id,
          serialNumber: offset + index + 1,
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
          category_names: item.category_names
            ? item.category_names.join(", ")
            : "",
          sub_category_names: item.sub_category_names
            ? item.sub_category_names.join(", ")
            : "",
        }));

        setDataSource(transformedData);
        setPagination({
          ...pagination,
          current: page,
          pageSize: pageSize,
          total: hasContent ? transformedData.length : response.count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("Token");
          message.error("Not a valid token");
        }
      } finally {
        setLoading(false);
      }
    },
    [lge, searchValue, isActive]
  );

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, searchValue, isActive, lge]);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

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
      dataIndex: "serialNumber",
      width: 50,
    },
    {
      title: "News Title",
      dataIndex: "news_title",
      width: 200,
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
            src={text || "/placeholder.svg"}
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
      title: "Categories",
      dataIndex: "category_names",
      width: 200,
    },
    {
      title: "Subcategories",
      dataIndex: "sub_category_names",
      width: 200,
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

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title="Modify News"
        open={isModalOpen}
        onCancel={() => handleCancel("edit")}
        footer={null}
        className="min-w-[80vw]"
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
              <ArticleContent news={selectedNews} image={false} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NewsTable;
