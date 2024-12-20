"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CategoryModify from "./CategoryModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import { Route } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const columns = (showModal, handleDelete) => [
  {
    title: "Display order",
    dataIndex: "order",
  },
  {
    title: "Category",
    dataIndex: "category_name",
  },
  {
    title: "Subcategory",
    dataIndex: "subcategory_key_name",
  },
  {
    title: "Display Order",
    dataIndex: "display_order",
  },
  {
    title: "Lge",
    dataIndex: "lge",
  },
  {
    title: "Active",
    dataIndex: "active",
    render: (active) => (active ? "Yes" : "No"),
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
        <Button type="danger" onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      </div>
    ),
  },
];

const CategoryTable = ({ reload, setReload }) => {
  const { router } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { lge } = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { searchValue } = useNewsSearch();
  // Confirmation modal states for deletion
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const showModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // Memoizing fetchData to prevent re-creations on each render
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/category/category";

      const response = await Get({
        url,
        headers: hasContent ? undefined : headers,
      });

      const responseData = hasContent
        ? response.category || []
        : response || [];

      if (!responseData || (hasContent && !response.category)) {
        throw new Error("Invalid response structure");
      }

      const filteredResponse = responseData
        .filter((item) => item.language === lge)
        .sort((a, b) => b.id - a.id);

      const transformedData = filteredResponse.map((item) => ({
        key: item.id,
        order: item.display_order,
        category_name: item.category_name,
        subcategory_key_name: item.category_key?.length || "0", // Safely check for length
        display_order: item.display_order,
        lge: item.language,
        active: item.active,
      }));

      setDataSource(transformedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error(error.response?.data?.code);
      if (error.response?.data?.code === "token_not_valid") {
        localStorage.removeItem("Token");
      }
    } finally {
      setLoading(false);
    }
  }, [searchValue, lge]); // Added lge and searchValue as dependencies for fetchData

  // Handle delete button click
  const handleDelete = (record) => {
    setCategoryToDelete(record); // Set the category to delete
    setIsConfirmDeleteVisible(true); // Show confirmation modal
  };

  // Confirm deletion
  const confirmDelete = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({
        url: `/category/category/${categoryToDelete.key}`,
        headers,
      });
      message.success("Category deleted successfully.");
      setDataSource((prev) =>
        prev.filter((item) => item.key !== categoryToDelete.key)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category.");
    } finally {
      setIsConfirmDeleteVisible(false); // Close the confirmation modal
      setCategoryToDelete(null); // Reset the category to delete
      fetchData(); // Refresh the data after deletion
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when reload, lge, or searchValue changes
    setReload(false); // Reset reload after fetching data
  }, [reload, lge, searchValue, fetchData, setReload]); // Added fetchData and setReload to dependencies

  return (
    <>
      <Table
        columns={columns(showModal, handleDelete)}
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        loading={loading}
      />

      {/* Modify Category Modal */}
      <Modal
        title="Modify Category"
        open={isModalOpen}
        onOk={resetModal}
        onCancel={resetModal}
        footer=""
        okButtonProps={{ style: { color: "black" } }}
      >
        <CategoryModify
          modifyObj={selectedCategory}
          fetchData={fetchData}
          handleCancel={resetModal}
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
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </>
  );
};

export default CategoryTable;
