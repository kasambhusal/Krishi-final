"use client";
import { useState, useEffect } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdvertisementModify from "./AdvertisementModify";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image";
import { useNavigation } from "../../Context/NavigationContext";

const AdvertisementTable = ({ reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [ifContent, setIfContent] = useState(false);
  const [largeGifUrl, setLargeGifUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { searchValue } = useNewsSearch();
  const { lge } = useNavigation();

  const fetchAdvertisements = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      const headers = { Authorization: `Bearer ${token}` };
      const hasContent = searchValue && /\S/.test(searchValue);
      setIfContent(hasContent);

      const offset = (page - 1) * pageSize;
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : `/advertisement/advertisement?language=${lge}&limit=${pageSize}&offset=${offset}`;

      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });

      const responseData = hasContent
        ? response.advertisement || []
        : response.results || [];

      if (!responseData) throw new Error("Invalid response structure");

      const sortedResponse = responseData
        .map((ad) => ({ ...ad }));

      setDataSource(
        sortedResponse.map((ad, index) => ({ ...ad, key: offset + index + 1 }))
      );

      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: hasContent ? sortedResponse.length : response.count || 0,
      });
    } catch (error) {
      message.error(error.response?.data?.code);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
    setReload(false);
  }, [reload, searchValue, lge]);

  const handleTableChange = (pagination) => {
    fetchAdvertisements(pagination.current, pagination.pageSize);
  };

  const showEditModal = (record) => {
    setSelectedAd(record);
    setIsModalOpen(true);
  };

  const handleDelete = (adId) => {
    setAdToDelete(adId);
    setReload(true);
    setIsConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({
        url: `/advertisement/advertisement/${adToDelete}`,
        headers,
      });
      message.success("Advertisement deleted successfully.");
      setIsConfirmDeleteVisible(false);
      setAdToDelete(null);
    } catch {
      message.error("Error deleting advertisement.");
    }
  };

  const handleGifClick = (imageUrl, record) => {
    setLargeGifUrl(imageUrl);
    setSelectedAd(record);
    setIsModalOpen(false);
  };

  const columns = [
    { title: "S.N", dataIndex: "key" },
    { title: "Title", dataIndex: "ads_name" },
    { title: "Lge", dataIndex: "language" },
    {
      title: "Image",
      dataIndex: "ads_image",
      render: (image, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleGifClick(image, record)}
        >
          <Image
            src={
              ifContent ? `https://cms.krishisanjal.com${image}` : `${image}`
            }
            alt="Advertisement"
            width={100}
            height={100}
            style={{ objectFit: "contain", borderRadius: "8px" }}
            loading="lazy"
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="primary" onClick={() => showEditModal(record)}>
            <EditOutlined />
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Modify Advertisement"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer=""
      >
        <AdvertisementModify setReload={setReload} selectedAd={selectedAd} />
      </Modal>

      <Modal
        title="GIF Preview"
        open={!!largeGifUrl}
        footer={null}
        onCancel={() => setLargeGifUrl(null)}
        width={800}
      >
        {largeGifUrl && (
          <Image
            src={largeGifUrl || "/placeholder.svg"}
            alt="Large GIF"
            width={800}
            height={450}
            style={{ objectFit: "contain" }}
            loading="lazy"
          />
        )}
      </Modal>

      <Modal
        title="Confirm Deletion"
        open={isConfirmDeleteVisible}
        onOk={confirmDelete}
        onCancel={() => setIsConfirmDeleteVisible(false)}
      >
        <p>Are you sure you want to delete this advertisement?</p>
      </Modal>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
        loading={loading}
      />
    </>
  );
};

export default AdvertisementTable;
