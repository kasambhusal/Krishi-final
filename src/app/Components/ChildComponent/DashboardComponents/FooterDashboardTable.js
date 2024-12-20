"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import MemberModify from "./MemberModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image"; // Import Image from next/image

// Columns definition with delete button and edit button
const columns = (showModal, handleDelete) => [
  {
    title: "S.N",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Designation",
    dataIndex: "designation",
  },
  {
    title: "Language",
    dataIndex: "lge",
  },
  {
    title: "Display Order",
    dataIndex: "display_order",
  },
  {
    title: "Social Media Link",
    dataIndex: "social_media_url",
    render: (url) => (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    ),
  },
  {
    title: "Image",
    dataIndex: "img",
    render: (src) => (
      <Image
        src={src}
        alt="Member"
        width={50}
        height={50}
        style={{ objectFit: "cover" }} // Ensures the image fills the space correctly
      />
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          type="primary"
          onClick={() => showModal(record)}
          className="bg-white text-black"
        >
          <EditOutlined />
        </Button>
        <Button type="danger" danger onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];

const FooterDashboardTable = ({ reload, setReload }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lge } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const { searchValue } = useNewsSearch();

  // Confirm modal state for delete
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Fetch data based on searchValue or reload state
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/member/member";

      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });

      const responseData = hasContent ? response.member || [] : response || [];

      if (!responseData || (hasContent && !response.member)) {
        throw new Error("Invalid response structure");
      }

      const filteredResponse = responseData.sort((a, b) => b.id - a.id);

      const formattedData = filteredResponse.map((item) => ({
        key: item.id,
        name: item.name,
        designation: item.designation,
        display_order: item.display_order,
        social_media_url: item.social_media_url,
        lge: item.language,
        description: item.description,
        img: hasContent
          ? `https://cms.krishisanjal.com${item.image}`
          : item.image,
      }));

      setDataSource(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(error.response?.data?.code);
    } finally {
      setLoading(false);
    }
  }, [searchValue]); // Removed `lge` from the dependency array as it's not directly used in the callback

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, searchValue, fetchData, setReload]); // Added missing dependencies

  // Show edit modal
  const showModal = (record) => {
    setCurrentMemberId(record.key);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    fetchData(); // Refresh the data after adding or editing
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Handle delete button click
  const handleDelete = (record) => {
    setMemberToDelete(record); // Set member to be deleted
    setIsConfirmDeleteVisible(true); // Show confirmation modal
  };

  // Confirm delete action
  const confirmDelete = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({ url: `/member/member/${memberToDelete.key}`, headers });
      setDataSource((prev) =>
        prev.filter((item) => item.key !== memberToDelete.key)
      );
      message.success("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
      message.error("Failed to delete member!");
    } finally {
      setIsConfirmDeleteVisible(false);
      setMemberToDelete(null);
      fetchData(); // Refresh the data after deletion
    }
  };

  return (
    <>
      <Table
        columns={columns(showModal, handleDelete)}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        loading={loading}
      />

      <Modal
        title="Modify Member"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=" "
        okButtonProps={{
          style: {
            color: "black",
            border: "1px solid #bdbbbb",
          },
        }}
      >
        <MemberModify
          fetchData={fetchData}
          handleCancel={handleCancel}
          modifyObj={dataSource.find(
            (member) => member.key === currentMemberId
          )} // Pass the selected member
        />
      </Modal>

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
        <p>Are you sure you want to delete this member?</p>
      </Modal>
    </>
  );
};

export default FooterDashboardTable;
