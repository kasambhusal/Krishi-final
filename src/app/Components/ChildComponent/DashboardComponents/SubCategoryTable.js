"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SubCategoryModify from "./SubCategoryModify";
import { useNavigation } from "../../Context/NavigationContext";
import { useNewsSearch } from "../../Context/searchNewsContext";
import { Get, Delete } from "../../Redux/API";
import { useRouter } from "next/navigation";

const columns = (showModal, handleDelete) => [
  {
    title: "S.N",
    dataIndex: "key",
  },
  {
    title: "Sub-category Name",
    dataIndex: "category_key_name",
  },
  {
    title: "Category Name",
    dataIndex: "category_name",
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
          onClick={() => showModal(record)} // Pass the record to the showModal function
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

const SubCategoryTable = ({ reload, setReload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { lge } = useNavigation();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); // State to hold the selected subcategory
  const [loading, setLoading] = useState(true); // Loading state
  const { searchValue } = useNewsSearch();
  const { router } = useRouter();
  // Confirmation modal states for deletion
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);

  // Memoize fetchData to prevent unnecessary re-creations of the function
  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching data
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const hasContent = searchValue && /\S/.test(searchValue);
      const url = hasContent
        ? `/search/search/?q=${searchValue}`
        : "/category/sub-category";

      const response = await Get({
        url,
        headers: hasContent ? null : headers,
      });

      const responseData = hasContent
        ? response.sub_category || []
        : response || [];

      if (!responseData || (hasContent && !response.sub_category)) {
        throw new Error("Invalid response structure");
      }

      const filteredResponse = responseData.filter(
        (item) => item.language === lge
      );
      const transformedData = filteredResponse.map((item) => ({
        key: item.id,
        category_name: item.category_name,
        category_key_name: item.category_key_name || "N/A",
        active: item.active,
        category: item.category,
      }));
      setDataSource(transformedData);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      message.error(error.response?.data?.code);
      message.error(error.response?.data?.code);
      if (error.response?.data?.code === "token_not_valid") {
        localStorage.removeItem("Token");
      }
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  }, [lge, searchValue]); // Add dependencies for fetchData (lge, searchValue)

  // UseEffect for initial mount and reload, lge, or searchValue changes
  useEffect(() => {
    fetchData();
    setReload(false); // Reset the reload state after data fetch
  }, [fetchData, reload, setReload]); // Ensure all dependencies are properly included

  // Handle delete button click
  const handleDelete = (record) => {
    setSubCategoryToDelete(record); // Set the subcategory to delete
    setIsConfirmDeleteVisible(true); // Show confirmation modal
  };

  // Confirm deletion
  const confirmDelete = async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await Delete({
        url: `/category/sub-category/${subCategoryToDelete.key}`,
        headers,
      });
      message.success("Sub-category deleted successfully.");
      setDataSource((prev) =>
        prev.filter((item) => item.key !== subCategoryToDelete.key)
      );
    } catch (error) {
      console.error("Error deleting sub-category:", error);
      message.error("Failed to delete sub-category.");
    } finally {
      setIsConfirmDeleteVisible(false); // Close the confirmation modal
      setSubCategoryToDelete(null); // Reset the subcategory to delete
      fetchData(); // Refresh the data after deletion
    }
  };

  // Show modal for modifying the selected sub-category
  const showModal = (subcategory) => {
    setSelectedSubCategory(subcategory); // Set the selected subcategory
    setIsModalOpen(true);
  };

  // Close modal without saving
  const handleOk = () => {
    setIsModalOpen(false);
    setSelectedSubCategory(null); // Reset selected subcategory
  };

  // Close modal without saving
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedSubCategory(null); // Reset selected subcategory
  };

  return (
    <>
      <Table
        columns={columns(showModal, handleDelete)} // Pass showModal and handleDelete to columns
        dataSource={dataSource}
        scroll={{ x: "max-content" }}
        loading={loading} // Show loading spinner while data is being fetched
      />

      {/* Modify Sub-category Modal */}
      <Modal
        title="Modify Sub-category"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=" "
      >
        <SubCategoryModify
          modifyObj={selectedSubCategory}
          fetchData={fetchData}
          handleCancel={handleCancel}
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
        <p>Are you sure you want to delete this sub-category?</p>
      </Modal>
    </>
  );
};

export default SubCategoryTable;
