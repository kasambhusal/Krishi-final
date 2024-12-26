"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Checkbox, message, Modal } from "antd";
import dayjs from "dayjs";
import { Get, Put } from "../../Redux/API";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "next/image"; // Import Image component from next/image
import Gallery from "./Gallery";

const { Option } = Select;

export default function NewsModify({ modifyObj, handleCancel2, fetchData }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState(null);
  const [lge, setLge] = useState("");
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [date, setDate] = useState(null);
  const [active, setActive] = useState();
  const [breaking, setBreaking] = useState();
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

  useEffect(() => {
    const fetchCategory = async () => {
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
    };

    const fetchAuthorData = async () => {
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
    fetchCategory();
    fetchAuthorData();
  }, [modifyObj]);

  useEffect(() => {
    if (modifyObj) {
      setTitle(modifyObj.news_title || "");
      setSubtitle(modifyObj.news_sub_title || "");
      setAuthor(modifyObj.author_name || null);
      setCategory(modifyObj.category ? parseInt(modifyObj.category, 10) : null);
      setSubcategory(
        modifyObj.category_key ? parseInt(modifyObj.category_key, 10) : null
      );
      setLge(modifyObj.language);
      setDate(modifyObj.self_date ? dayjs(modifyObj.self_date) : null);
      setActive(modifyObj.active || false);
      setBreaking(modifyObj.breaking_news);
      setDisData(modifyObj.news_post || "");
      setImagePreview(modifyObj.media_image || modifyObj.image || null);
      setPdfPreview(modifyObj.pdf_document || null);
    }
  }, [modifyObj]);

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
      setPdfPreview(previewUrl); // Use a URL string
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

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("news_title", title);
    formData.append("news_sub_title", subtitle);
    formData.append("language", lge);
    formData.append("author_name", author);
    formData.append("category", category);

    // Ensure category_key is sent correctly
    formData.append("category_key", subcategory !== null ? subcategory : "");

    if (date) {
      formData.append("self_date", dayjs(date).format("YYYY-MM-DD"));
    } else {
      message.error("Please select a valid date.");
      setLoading(false);
      return;
    }

    formData.append("active", active ? "true" : "false");
    formData.append("breaking_news", breaking ? "true" : "false");

    formData.append("news_post", disData);
    if (selectedImage) {
      formData.append("image", selectedImage);
      formData.append("media_image", "");
    }
    if (galleryImage) {
      formData.append("media_image", galleryImage);
      // const emptyFile = new File([""], "empty.txt", { type: "text/plain" });
      formData.append("image", "");
    }
    if (selectedPdf) {
      formData.append("pdf_document", selectedPdf);
    }
    const token = localStorage.getItem("Token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (modifyObj) {
        await Put({
          url: `/news/news/${modifyObj.key}`,
          data: formData,
          headers,
        });
        message.success("News updated successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error on news publish");
    } finally {
      handleCancel2();
      fetchData();
      setLoading(false);
    }
  };

  const categoryChange = (value) => {
    setCategory(value ? parseInt(value, 10) : null);
    const selectedCategory = categoryData.find(
      (mycategory) => mycategory.id === value
    );
    setSubCategoryData(
      selectedCategory ? selectedCategory.category_key || [] : []
    );
  };

  const subCategoryChange = (value) => {
    setSubcategory(value ? parseInt(value, 10) : null);
  };
  const titleChange = (e) => {
    setTitle(e.target.value);
  };
  const subtitleChange = (e) => {
    setSubtitle(e.target.value);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Title">
        <Input value={title} onChange={titleChange} />
      </Form.Item>
      <Form.Item label="Subtitle">
        <Input value={subtitle} onChange={subtitleChange} />
      </Form.Item>
      <Form.Item label="Author">
        <Select
          showSearch
          onChange={setAuthor}
          value={author}
          placeholder="Select an author"
          allowClear
        >
          {authorData.map((author) => (
            <Option key={author.id} value={author.id}>
              {author.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Category">
        <Select onChange={categoryChange} value={category} allowClear>
          {categoryData.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Subcategory">
        <Select onChange={subCategoryChange} value={subcategory} allowClear>
          {subCategoryData.map((subCat) => (
            <Option key={subCat.id} value={subCat.id}>
              {subCat.category_key_name}{" "}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <div className="flex flex-wrap justify-evenly">
        <Form.Item label="Date">
          <input
            type="date"
            onChange={(e) => {
              const selectedDate = e.target.value;
              setDate(selectedDate ? dayjs(selectedDate) : null);
            }}
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
      <div className="w-full flex  flex-col sm:flex-row justify-evenly">
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
            width={300} // Set width
            height={200} // Set height
            style={{ objectFit: "cover" }} // Ensure image covers the area
          />
        </div>
      )}
      <Form.Item label="Upload PDF" className="mt-[25px]">
        <input type="file" accept=".pdf" onChange={handlePdfUpload} />
      </Form.Item>
      {pdfPreview && (
        <div style={{ marginTop: "10px" }} className="my-3">
          <h2 className="text-green-800 font-bold">PDF Overview:</h2>
          <a href={pdfPreview} target="_blank">
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
