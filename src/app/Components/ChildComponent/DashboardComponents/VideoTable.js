"use client";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Get, Delete } from "../../Redux/API";
import { useNavigation } from "../../Context/NavigationContext";

const columns = (handleDelete) => [
  {
    title: "S.N",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Video Url",
    dataIndex: "video_url",
  },
  {
    title: "Lge",
    dataIndex: "lge",
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button type="danger" onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];

const VideoTable = ({ reload, setReload }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const { lge } = useNavigation();
  // Fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("Token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await Get({ url: "/gallery/video-gallery", headers });
        const response2 = response
          .filter((item) => item.language === lge)
          .sort((a, b) => b.id - a.id);
        const formattedData = response2.map((item) => ({
          key: item.id,
          name: item.title_name,
          video_url: item.video_url,
          lge: item.language,
        }));
        setDataSource(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error(error.response?.data?.code);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setReload(false);
  }, [lge, reload]);

  // Handle the delete action and show confirmation modal
  const handleDelete = (record) => {
    setContactToDelete(record); // Set the contact to delete
    setIsConfirmDeleteVisible(true); // Show confirmation modal
  };

  // Confirm the deletion action
  const confirmDelete = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({
        url: `/gallery/video-gallery/${contactToDelete.key}`,
        headers,
      });
      // Remove the deleted contact from the dataSource
      setDataSource((prev) =>
        prev.filter((item) => item.key !== contactToDelete.key)
      );
      message.success("Video deleted successfully.");
    } catch (error) {
      console.error("Error deleting contact:", error);
      message.error("Failed to delete contact!");
    } finally {
      setIsConfirmDeleteVisible(false); // Close the confirmation modal
      setContactToDelete(null); // Reset the contact to delete
    }
  };

  return (
    <>
      <Table
        columns={columns(handleDelete)}
        dataSource={dataSource}
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      {/* Confirm Deletion Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isConfirmDeleteVisible}
        onOk={confirmDelete}
        onCancel={() => setIsConfirmDeleteVisible(false)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ style: { backgroundColor: "blue" } }}
      >
        <p>Are you sure you want to delete this contact?</p>
        <p>
          <strong>{contactToDelete?.name}</strong>
        </p>
      </Modal>
    </>
  );
};

export default VideoTable;
