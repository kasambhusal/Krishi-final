"use client";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Get, Delete } from "../../Redux/API";
import MemberModify from "./MemberModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";

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
    render: (text) => (
      <img src={text} alt="Member" style={{ width: 50, height: 50 }} />
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

const MemberTable = ({ reload, setReload }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lge } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const { searchValue } = useNewsSearch();
  const token = localStorage.getItem("Token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, searchValue]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // const response = await Get({ url: "/member/member", headers });
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/member/member";

      const response = await Get({
        url,
        headers: hasContent ? undefined : headers,
      });

      // console.log("API Response:", response); // Log the response
      const responseData = hasContent ? response.member || [] : response || [];

      if (!responseData || (hasContent && !response.member)) {
        throw new Error("Invalid response structure");
      }
      const filteredResponse = responseData
        // .filter((member) => member.language === lge)
        .sort((a, b) => b.id - a.id);
      const formattedData = filteredResponse.map((item) => ({
        key: item.id,
        name: item.name,
        designation: item.designation,
        display_order: item.display_order, // Added display_order
        social_media_url: item.social_media_url, // Added social_media_url
        lge: item.language,
        description: item.description,
        img: hasContent
          ? `https://cms.krishisanjal.com${item.image}`
          : item.image,
      }));
      setDataSource(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load members!");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this member?",
      content: `Name: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await Delete({ url: `/member/member/${record.key}`, headers });
          setDataSource((prev) =>
            prev.filter((item) => item.key !== record.key)
          );
          message.success("Member deleted successfully");
        } catch (error) {
          console.error("Error deleting member:", error);
          message.error("Failed to delete member!");
        } finally {
          fetchData(); // Refresh the data after deletion
        }
      },
    });
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
        footer=""
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
    </>
  );
};

export default MemberTable;
