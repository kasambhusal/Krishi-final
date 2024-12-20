"use client";
import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigation } from "../../Context/NavigationContext";
import AuthorModify from "./AuthorModify";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import Image from "next/image"; // Importing Image component

const columns = (showModal, handleDelete) => [
  {
    title: "ID",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Mobile Number",
    dataIndex: "phone_no",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Social_media url",
    dataIndex: "social_media",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (text) =>
      // Conditionally render the Image only if the URL is valid
      text ? (
        <Image
          src={text}
          alt="Author"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }} // Optional: Add some styling like border-radius for circle image
        />
      ) : (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
          }}
        ></div> // Placeholder if no image
      ),
  },

  {
    title: "Action",
    dataIndex: "action",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          type="primary"
          onClick={() => showModal(record)} // Pass record to showModal
          className="bg-white text-black"
        >
          <EditOutlined />
        </Button>
        <Button type="danger" onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];

const AuthorsTable = ({ reload, setReload }) => {
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState(null); // State to hold the selected author
  const { searchValue } = useNewsSearch();

  // useEffect(() => {

  //   fetchData();
  // }, [reload, lge, searchValue]); // Added lge and searchValue as dependencies

  useEffect(() => {
    fetchData();
    setReload(false);
  }, [reload, lge, searchValue, setReload]); // Added setReload as a dependency
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/author/author";

      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });

      const responseData = hasContent ? response.author || [] : response || [];

      if (!responseData || (hasContent && !response.author)) {
        throw new Error("Invalid response structure");
      }

      const filteredResponse = responseData.filter(
        (author) => author.language === lge
      );

      const formattedData = filteredResponse.map((item) => ({
        key: item.id,
        id: item.id,
        name: item.name,
        phone_no: item.phone_no,
        address: item.address,
        email: item.author_email,
        image: hasContent
          ? `https://cms.krishisanjal.com${item.image}` || ""
          : item.image || "",
        social_media: item.social_media_url,
      }));

      setDataSource(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(error.response?.data?.code);
    } finally {
      setLoading(false);
    }
  };
  const showModal = (record) => {
    setCurrentAuthor(record); // Set the selected author
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
      title: "Are you sure you want to delete this author?",
      content: `Name: ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("Token");
          const headers = { Authorization: `Bearer ${token}` };
          await Delete({ url: `/author/author/${record.key}`, headers });
          setDataSource((prev) =>
            prev.filter((item) => item.key !== record.key)
          );
          message.success("Author deleted successfully");
        } catch (error) {
          console.error("Error deleting author:", error);
          message.error("Failed to delete author!");
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
        title="Modify Author"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="min-w-[55vw]"
        footer=""
        okButtonProps={{
          style: { color: "black", border: "1px solid #bdbbbb" },
        }}
      >
        <AuthorModify
          modifyObj={currentAuthor} // Pass the selected author object
          fetchData={fetchData}
          handleCancel={handleCancel}
        />
      </Modal>
    </>
  );
};

export default AuthorsTable;
