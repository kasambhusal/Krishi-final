"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, Checkbox, message } from "antd";
import dayjs from "dayjs";
import { useNavigation } from "../../Context/NavigationContext";
import { Get, Post } from "../../Redux/API";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gallery from "./Gallery";
const { Option } = Select;

export default function NewsAdd({ handleCancel2, setReload }) {
  const { lge } = useNavigation();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [date, setDate] = useState(dayjs());
  const [active, setActive] = useState(true);
  const [breaking, setBreaking] = useState(false);
  const [disData, setDisData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("Token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await Get({
          url: "/category/category",
          headers,
        });
        setCategoryData(
          categoriesResponse.filter((cat) => cat.language === lge)
        );

        // Fetch authors
        const authorsResponse = await Get({ url: "/author/author", headers });
        setAuthorData(
          authorsResponse.filter((author) => author.language === lge)
        );
      } catch (error) {
        message.error("Error fetching data");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [lge]);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setGalleryImage(null);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleGalleryUpload = (myurl) => {
    setGalleryImage(myurl);
    setImagePreview(myurl);
    setSelectedImage(null);
  };
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("news_title", title);
    formData.append("news_sub_title", subtitle);
    formData.append("language", lge);
    formData.append("author_name", author);
    formData.append("category", category);
    formData.append("category_key", subcategory);
    formData.append("self_date", date.format("YYYY-MM-DD"));
    formData.append("active", active ? "true" : "false");
    formData.append("breaking_news", breaking ? "true" : "false");
    formData.append("news_post", disData);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (galleryImage) {
      formData.append("gallery_image", galleryImage);
    }

    try {
      const response = await Post({
        url: "/news/news",
        data: formData,
        headers,
      });

      if (response) {
        console.log(response);
        const sharePayload = {
          title: response.id.toString(),
          visit_count: 0,
        };

        const response2 = await Post({
          url: "/count/posts/4/",
          data: JSON.stringify(sharePayload),
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });
        const myShare = {
          id: response.id,
          share_count: 100,
        };

        const shareResponse = await Post({
          url: `/count/share/${response2.id}/store_share_count/`,
          data: JSON.stringify(myShare),
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        });

        toast.success(response.message);
        resetForm();
        handleCancel2();
        setReload(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          const messages = Array.isArray(value) ? value : [value];
          messages.forEach((message) => {
            toast.error(`${key}: ${message}`, {
              autoClose: 5000,
              closeOnClick: true,
              draggable: true,
              closeButton: true,
            });
          });
        });
      } else {
        toast.error(error.message || "An error occurred");
      }
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setAuthor(null);
    setCategory("");
    setSubcategory("");
    setDate(dayjs());
    setActive(true);
    setBreaking(false);
    setDisData("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const categoryChange = (value) => {
    setCategory(value);
    const selectedCategory = categoryData.find((cat) => cat.id === value);
    setSubCategoryData(
      selectedCategory ? selectedCategory.category_key || [] : []
    );
  };

  return (
    <Form onFinish={handleSubmit}>
      <ToastContainer position="top-right" autoClose={5000} />
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please select Title!" }]}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Item>
      <Form.Item label="Subtitle" name="subtitle">
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </Form.Item>
      <Form.Item
        label="Author"
        name="author"
        rules={[{ required: true, message: "Please select a Author!" }]}
      >
        <Select
          showSearch
          onChange={setAuthor}
          value={author}
          placeholder="Select an author"
          allowClear
          style={{ width: "100%" }}
        >
          {authorData.map((author) => (
            <Option key={author.id} value={author.id}>
              {author.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
        rules={[{ required: true, message: "Please select a Category!" }]}
      >
        <Select onChange={categoryChange} value={category}>
          {categoryData.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Subcategory">
        <Select onChange={setSubcategory} value={subcategory}>
          {subCategoryData.map((subCat) => (
            <Option key={subCat.id} value={subCat.id}>
              {subCat.category_key_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <div className="flex justify-evenly">
        <Form.Item label="Date">
          <input
            type="date"
            value={date.format("YYYY-MM-DD")}
            onChange={(e) => setDate(dayjs(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Active">
          <Checkbox
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </Form.Item>
        <Form.Item label="Is Breaking">
          <Checkbox
            checked={breaking}
            onChange={(e) => setBreaking(e.target.checked)}
          />
        </Form.Item>
      </div>
      <Form.Item
        label="Content"
        name="content"
        rules={[{ required: true, message: "This field can't be empty" }]}
      >
        <CKEditor
          editor={ClassicEditor}
          data={disData}
          className="p-[20px]"
          onChange={(event, editor) => setDisData(editor.getData())}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "blockQuote",
              "insertTable",
              "imageUpload",
            ],
          }}
        />
      </Form.Item>
      <Form.Item label="Upload Image">
        <input type="file" onChange={handleUpload} />
      </Form.Item>
      <Form.Item>
        <Button onClick={showModal}>Upload Image from Server</Button>
        <Modal
          title="Upload Image from Server"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          style={{ minWidth: "90vw" }}
        >
          <Gallery
            handleGalleryUpload={handleGalleryUpload}
            handleCancel={handleCancel}
          />
        </Modal>
      </Form.Item>
      {imagePreview && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </div>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-blue-500"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
