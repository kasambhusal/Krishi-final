"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Select, Checkbox, message, Modal } from "antd";
import dayjs from "dayjs";
import { Get, Put } from "../../Redux/API";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "next/image";
import Gallery from "./Gallery";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

export default function NewsModify({ modifyObj, handleCancel2, fetchData }) {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState(null);
  const [lge, setLge] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [date, setDate] = useState(null);
  const [active, setActive] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [disData, setDisData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const fetchCategory = useCallback(async () => {
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await Get({ url: "/category/category", headers });
      const filteredResponse = response.filter(
        (category) => category.language === `${modifyObj.language}`
      );
      setCategoryData(filteredResponse);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, [modifyObj.language]);

  const fetchSubcategories = useCallback(async (selectedCategories) => {
    if (selectedCategories.length === 0) {
      setSubCategoryData([]);
      return;
    }
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const promises = selectedCategories.map((catId) =>
        Get({ url: `/category/category/${catId}`, headers })
      );
      const responses = await Promise.all(promises);
      const allSubcategories = responses.flatMap(
        (response) => response.category_key || []
      );
      setSubCategoryData(allSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategory();

    const fetchAuthorData = async () => {
      const token = localStorage.getItem("Token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await Get({ url: "/author/author", headers });
        const filteredResponse = response.filter(
          (author) => author.language === `${modifyObj.language}`
        );
        setAuthorData(filteredResponse);
      } catch (error) {
        console.log("Error fetching authors" + error);
      }
    };

    fetchAuthorData();
  }, [modifyObj, fetchCategory]);

  useEffect(() => {
    if (modifyObj && categoryData.length > 0) {
      setTitle(modifyObj.news_title || "");
      setSubtitle(modifyObj.news_sub_title || "");
      setAuthor(modifyObj.author_name || null);
      setLge(modifyObj.language);
      setDate(modifyObj.self_date ? dayjs(modifyObj.self_date) : dayjs());
      setActive(modifyObj.active || false);
      setBreaking(modifyObj.breaking_news || false);
      setDisData(modifyObj.news_post || "");
      setImagePreview(modifyObj.media_image || modifyObj.image || null);
      setPdfPreview(modifyObj.pdf_document || null);

      // Map category names to IDs
      const categoryIds = categoryData
        .filter((cat) =>
          modifyObj.category_names.split(", ").includes(cat.category_name)
        )
        .map((cat) => cat.id);
      setCategories(categoryIds);
      fetchSubcategories(categoryIds);

      form.setFieldsValue({
        title: modifyObj.news_title || "",
        subtitle: modifyObj.news_sub_title || "",
        author: modifyObj.author_name || null,
        categories: categoryIds,
        date: modifyObj.self_date ? dayjs(modifyObj.self_date) : dayjs(),
        active: modifyObj.active || false,
        breaking: modifyObj.breaking_news || false,
      });
    }
  }, [modifyObj, categoryData, fetchSubcategories, form]);

  useEffect(() => {
    if (subCategoryData.length > 0 && modifyObj) {
      const subcategoryIds = subCategoryData
        .filter((subCat) =>
          modifyObj.sub_category_names
            .split(", ")
            .includes(subCat.category_key_name)
        )
        .map((subCat) => subCat.id);
      setSubcategories(subcategoryIds);
      form.setFieldsValue({ subcategories: subcategoryIds });
    }
  }, [subCategoryData, modifyObj, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setGalleryImage("");
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const previewUrl = URL.createObjectURL(file);
      setPdfPreview(previewUrl);
      setSelectedPdf(file);
    } else {
      message.error("Please upload a PDF file");
    }
  };

  const handleGalleryUpload = (myurl) => {
    setGalleryImage(myurl);
    setImagePreview(myurl);
    setSelectedImage("");
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("news_title", values.title);
    formData.append("news_sub_title", values.subtitle);
    formData.append("language", lge);
    formData.append("author_name", values.author);

    values.categories.forEach((catId) => formData.append("categories", catId));
    values.subcategories.forEach((subCatId) =>
      formData.append("category_keys", subCatId)
    );

    formData.append("self_date", values.date.format("YYYY-MM-DD"));
    formData.append("active", values.active ? "true" : "false");
    formData.append("breaking_news", values.breaking ? "true" : "false");
    formData.append("news_post", disData);

    if (selectedImage) {
      formData.append("image", selectedImage);
      formData.append("media_image", "");
    }
    if (galleryImage) {
      formData.append("media_image", galleryImage);
      formData.append("image", "");
    }
    if (selectedPdf) {
      formData.append("pdf_document", selectedPdf);
    }

    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await Put({
        url: `/news/news/${modifyObj.key}`,
        data: formData,
        headers,
      });

      if (response) {
        message.success("News updated successfully");
        handleCancel2();
        fetchData();
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
      console.error("Error updating news:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryChange = (selectedCategories) => {
    setCategories(selectedCategories);
    fetchSubcategories(selectedCategories);
    form.setFieldsValue({ subcategories: [] });
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{ categories: [], subcategories: [] }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <Form.Item name="title" label="Title">
        <Input />
      </Form.Item>
      <Form.Item name="subtitle" label="Subtitle">
        <Input />
      </Form.Item>
      <Form.Item name="author" label="Author">
        <Select showSearch placeholder="Select an author" allowClear>
          {authorData.map((author) => (
            <Option key={author.id} value={author.id}>
              {author.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="categories" label="Category">
        <Select
          mode="multiple"
          onChange={categoryChange}
          placeholder="Select categories"
          allowClear
        >
          {categoryData.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="subcategories" label="Subcategory">
        <Select mode="multiple" placeholder="Select subcategories" allowClear>
          {subCategoryData.map((subCat) => (
            <Option key={subCat.id} value={subCat.id}>
              {subCat.category_key_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div className="flex flex-wrap justify-evenly">
        <Form.Item name="date" label="Date">
          <input type="date" />
        </Form.Item>
        <Form.Item name="active" label="Active" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="breaking" label="Is Breaking" valuePropName="checked">
          <Checkbox />
        </Form.Item>
      </div>
      <Form.Item label="Content">
        <div className="my-7">
          <CKEditor
            editor={ClassicEditor}
            data={disData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDisData(data);
            }}
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
        </div>
      </Form.Item>
      <div className="w-full flex flex-col sm:flex-row justify-evenly">
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
            style={{ minWidth: "90vw", overflow: "hidden" }}
          >
            <Gallery
              handleGalleryUpload={handleGalleryUpload}
              handleCancel={handleCancel}
            />
          </Modal>
        </Form.Item>
      </div>
      {imagePreview && (
        <div style={{ marginTop: "10px" }}>
          <h2 className="text-green-800 font-bold">Image Preview :</h2>
          <Image
            src={imagePreview}
            alt="Preview"
            width={300}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <Form.Item label="Upload PDF" className="mt-[25px]">
        <input type="file" accept=".pdf" onChange={handlePdfUpload} />
      </Form.Item>
      {pdfPreview && (
        <div style={{ marginTop: "10px" }} className="my-3">
          <h2 className="text-green-800 font-bold">PDF Overview:</h2>
          <a href={pdfPreview} target="_blank" rel="noopener noreferrer">
            {pdfPreview}
          </a>
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
