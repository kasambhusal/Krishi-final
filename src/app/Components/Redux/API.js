import axios from "axios";
// const Base_Url = "https://cms.bhandarirajan7.com.np/krishi_cms/api/v1"; // Set your base URL here
const Base_Url = "https://cms.bhuvanpaudel.com.np/krishi_cms/api/v1"; // Set your base URL here

// GET request
export async function Get({ url, headers = {}, props = "" }) {
  try {
    const response = await axios.get(Base_Url + url, { headers }, props);
    return response.data;
  } catch (error) {
    console.error("Error while making GET request:", error);
    throw error;
  }
}

// POST request
export async function Post({ url, data = {}, headers = {} }) {
  try {
    const response = await axios.post(Base_Url + url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while making POST request:", error);
    throw error;
  }
}

// PUT request
export async function Put({ url, data = {}, headers = {} }) {
  try {
    const response = await axios.put(Base_Url + url, data, { headers }); // Correctly passing headers
    return response.data;
  } catch (error) {
    console.error("Error while making PUT request:", error);
    throw error;
  }
}

// PATCH request (partial update)
export async function Patch({ url, data = {}, config = {} }) {
  try {
    const response = await axios.patch(Base_Url + url, data, config);
    return response.data;
  } catch (error) {
    console.error("Error while making PATCH request:", error);
    throw error;
  }
}
export async function Delete({ url, headers }) {
  try {
    const response = await axios.delete(Base_Url + url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error while making DELETE request:", error);
    throw error;
  }
}
