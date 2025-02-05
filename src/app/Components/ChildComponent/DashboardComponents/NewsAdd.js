"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Select, Checkbox, message } from "antd";
import dayjs from "dayjs";
import { useNavigation } from "../../Context/NavigationContext";
import { Get, Post } from "../../Redux/API";
import CKEditor from "./CKEditor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Gallery from "./Gallery";
const { Option } = Select;

export default function NewsAdd({ handleCancel2, setReload }) {
  const { lge } = useNavigation();
  const [form] = Form.useForm();
  const [editorData, setEditorData] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const token = localStorage.getItem("Token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await Get({
          url: "/category/category",
          headers,
        });
        setCategoryData(
          categoriesResponse.filter((cat) => cat.language === lge)
        );

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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setGalleryImage(null);
    }
  };

  const handleGalleryUpload = (myurl) => {
    setGalleryImage(myurl);
    setImagePreview(myurl);
    setSelectedImage(null);
  };

  const categoryChange = (selectedCategories) => {
    setCategories(selectedCategories);
    const selectedCategoryData = categoryData.filter((cat) =>
      selectedCategories.includes(cat.id)
    );
    const allSubcategories = selectedCategoryData.flatMap(
      (cat) => cat.category_key || []
    );
    setSubCategoryData(allSubcategories);
  };

  const handleEditorChange = (data) => {
    setEditorData(data);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("news_title", values.title);
    formData.append("news_sub_title", values.subtitle);
    formData.append("language", lge);
    formData.append("author_name", values.author);
    formData.append("self_date", values.date.format("YYYY-MM-DD"));
    formData.append("active", values.active ? "true" : "false");
    formData.append("breaking_news", values.breaking ? "true" : "false");
    formData.append("news_post", editorData);

    if (Array.isArray(values.categories)) {
      values.categories.forEach((catId) =>
        formData.append("categories", catId)
      );
    }
    if (Array.isArray(values.subcategories)) {
      values.subcategories.forEach((subCatId) =>
        formData.append("category_keys", subCatId)
      );
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (galleryImage) {
      formData.append("media_image", galleryImage);
    }
    if (selectedPdf) {
      formData.append("pdf_document", selectedPdf);
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        title: "",
        subtitle: "",
        author: null,
        categories: [],
        subcategories: [],
        date: dayjs(),
        active: true,
        breaking: false,
        content: "",
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the Title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Subtitle" name="subtitle">
        <Input />
      </Form.Item>
      <Form.Item
        label="Author"
        name="author"
        rules={[{ required: true, message: "Please select an Author!" }]}
      >
        <Select
          showSearch
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
        name="categories"
        rules={[
          { required: true, message: "Please select at least one Category!" },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Select categories"
          allowClear
          style={{ width: "100%" }}
          onChange={(value) => {
            categoryChange(value);
            form.setFieldsValue({ subcategories: [] });
          }}
        >
          {categoryData.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Subcategory" name="subcategories">
        <Select
          mode="multiple"
          placeholder="Select subcategories"
          allowClear
          style={{ width: "100%" }}
        >
          {subCategoryData.map((subCat) => (
            <Option key={subCat.id} value={subCat.id}>
              {subCat.category_key_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Date" name="date">
        <input
          type="date"
          onChange={(e) => form.setFieldsValue({ date: dayjs(e.target.value) })}
        />
      </Form.Item>
      <Form.Item label="Active" name="active" valuePropName="checked">
        <Checkbox />
      </Form.Item>
      <Form.Item label="Is Breaking" name="breaking" valuePropName="checked">
        <Checkbox />
      </Form.Item>
      <Form.Item
        label="Content"
        name="content"
        rules={[{ required: true, message: "This field can't be empty" }]}
      >
        <CKEditor onChange={handleEditorChange} />
      </Form.Item>
      <Form.Item label="Upload Image">
        <input type="file" onChange={handleUpload} />
      </Form.Item>
      <Form.Item>
        <Button onClick={() => setIsModalOpen(true)}>
          Upload Image from Server
        </Button>
        <Modal
          title="Upload Image from Server"
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          className="min-w-[80vw] min-h-[80vh]"
        >
          <Gallery
            handleGalleryUpload={handleGalleryUpload}
            handleCancel={handleCancel}
          />
        </Modal>
      </Form.Item>
      <Form.Item label="Upload PDF">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedPdf(e.target.files[0])}
        />
      </Form.Item>
      {imagePreview && (
        <div>
          <h3>Image Preview:</h3>
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Preview"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {selectedPdf && (
        <div>
          <h3>Selected PDF:</h3>
          <p>{selectedPdf.name}</p>
        </div>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
