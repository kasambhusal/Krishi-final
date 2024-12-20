// src/utils/FormatEnglishDate.js
const FormatEnglishDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export default FormatEnglishDate;
