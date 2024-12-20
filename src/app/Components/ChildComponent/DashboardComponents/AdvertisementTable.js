"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdvertisementModify from "./AdvertisementModify";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

const AdvertisementTable = ({ reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [ifContent, setIfContent] = useState(false);
  const [largeGifUrl, setLargeGifUrl] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const { searchValue } = useNewsSearch();

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    const fetchAdvertisements = async () => {
      setLoading(true); // Start loading
      try {
        const hasContent = searchValue && /\S/.test(searchValue);
        setIfContent(hasContent);
        const url = hasContent
          ? `/search/search/?q=${searchValue}`
          : "/advertisement/advertisement";

        const response = await Get({
          url,
          headers: hasContent ? null : headers,
        });

        const responseData = hasContent
          ? response.advertisement || []
          : response || [];

        if (!responseData || (hasContent && !response.advertisement)) {
          throw new Error("Invalid response structure");
        }

        const sortedResponse = responseData
          .map((ad) => ({ ...ad }))
          .sort((a, b) => b.id - a.id);

        setDataSource(
          sortedResponse.map((ad, index) => ({ ...ad, key: index + 1 }))
        );
      } catch (error) {
        message.error(error.response?.data?.code);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchAdvertisements();
    setReload(false);
  }, [reload, searchValue, setReload]); // Include setReload here

  const showEditModal = (record) => {
    setSelectedAd(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const handleCancelEditModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const handleDelete = (adId) => {
    setAdToDelete(adId);
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
      await fetchAdvertisements();
    } catch (error) {
      message.error("Error deleting advertisement.");
    }
  };

  const handleGifClick = (imageUrl, record) => {
    setLargeGifUrl(imageUrl);
    setSelectedAd(record);
    setIsModalOpen(false);
  };

  const handleGifPreviewCancel = () => {
    setLargeGifUrl(null);
  };

  const columns = [
    {
      title: "S.N",
      dataIndex: "key",
    },
    {
      title: "Title",
      dataIndex: "ads_name",
    },
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
            width={100} // Set a width for the image
            height={100} // Set a height for the image
            style={{
              objectFit: "contain", // Ensure the image fits within the box
              borderRadius: "8px", // Optional: Add border radius for a better visual effect
            }}
            loading="lazy" // Lazy load the image
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => showEditModal(record)}
            className="bg-white text-black"
          >
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
        onOk={handleOk}
        onCancel={handleCancelEditModal}
        footer=""
        okButtonProps={{
          style: { color: "black", border: "1px solid #bdbbbb" },
        }}
      >
        <AdvertisementModify
          setReload={setReload}
          handleCancel={handleCancelEditModal}
          selectedAd={selectedAd}
        />
      </Modal>

      <Modal
        title="GIF Preview"
        visible={!!largeGifUrl}
        footer={null}
        onCancel={handleGifPreviewCancel}
        width={800}
      >
        {largeGifUrl && (
          <Image
            src={largeGifUrl}
            alt="Large GIF"
            width={800} // Adjust width as needed
            height={450} // Adjust height as needed
            style={{ objectFit: "contain", width: "100%" }}
            loading="lazy"
          />
        )}
      </Modal>

      <Modal
        title="Confirm Deletion"
        visible={isConfirmDeleteVisible}
        onOk={confirmDelete}
        onCancel={() => setIsConfirmDeleteVisible(false)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ style: { backgroundColor: "blue" } }}
      >
        <p>Are you sure you want to delete this advertisement?</p>
      </Modal>

      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        loading={loading} // Add loading prop here
      />
    </>
  );
};

export default AdvertisementTable;
