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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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
  const [selectedPdf, setSelectedPdf] = useState(null);

  const token = localStorage.getItem("Token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await Get({
          url: "/category/category", // Update with the new endpoint
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

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("news_title", title);
    formData.append("news_sub_title", subtitle);
    formData.append("language", lge);
    formData.append("author_name", author);
    formData.append("self_date", date.format("YYYY-MM-DD"));
    formData.append("active", active ? "true" : "false");
    formData.append("breaking_news", breaking ? "true" : "false");
    formData.append("news_post", disData);

    // Append categories and category_keys as individual entries
    if (Array.isArray(categories)) {
      categories.forEach((catId) => formData.append("categories", catId));
    }
    if (Array.isArray(subcategories)) {
      subcategories.forEach((subCatId) =>
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
    setCategories([]);
    setSubcategories([]);
    setDate(dayjs());
    setActive(true);
    setBreaking(false);
    setDisData("");
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedPdf(null);
  };

  return (
    <Form onFinish={handleSubmit}>
      <ToastContainer position="top-right" autoClose={5000} />
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter the Title!" }]}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Item>
      <Form.Item label="Subtitle" name="subtitle">
        <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
      </Form.Item>
      <Form.Item
        label="Author"
        name="author"
        rules={[{ required: true, message: "Please select an Author!" }]}
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
        name="categories"
        rules={[
          { required: true, message: "Please select at least one Category!" },
        ]}
      >
        <Select
          mode="multiple"
          onChange={categoryChange}
          value={categories}
          placeholder="Select categories"
          allowClear
          style={{ width: "100%" }}
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
          onChange={setSubcategories}
          value={subcategories}
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
      <Form.Item
        label="Content"
        name="content"
        rules={[{ required: true, message: "This field can't be empty" }]}
      >
        <CKEditor
          editor={ClassicEditor}
          data={disData}
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
        <Button onClick={() => setIsModalOpen(true)}>
          Upload Image from Server
        </Button>
        <Modal
          title="Upload Image from Server"
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
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
          <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
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
