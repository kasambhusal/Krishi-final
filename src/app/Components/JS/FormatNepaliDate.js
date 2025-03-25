// src/utils/FormatNepaliDate.js
import { NepaliDate } from "@zener/nepali-datepicker-react";

const englishToNepaliMonths = {
  Baisakh: "बैशाख",
  Jestha: "जेठ",
  Asar: "असार",
  Shrawan: "श्रावण",
  Bhadra: "भाद्र",
  Aswin: "आश्विन",
  Kartik: "कार्तिक",
  Mangsir: "मंसिर",
  Poush: "पौष",
  Magh: "माघ",
  Falgun: "फाल्गुन",
  Chaitra: "चैत्र",
};

const FormatNepaliDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  // Create a new Date object and add one day
  const englishDate = new Date(year, month - 1, day); // Month is 0-indexed
  const nepaliDate = new NepaliDate(englishDate);
  const formattedNepaliDate = nepaliDate.format("DD MMMM YYYY");

  // Convert to Nepali numerals
  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return String(number)
      .split("")
      .map((digit) => nepaliNumerals[parseInt(digit)] || digit)
      .join("");
  };

  const [nepaliDay, nepaliMonthName, nepaliYear] =
    formattedNepaliDate.split(" ");
  const nepaliDayConverted = convertToNepaliNumerals(nepaliDay);
  const nepaliYearConverted = convertToNepaliNumerals(nepaliYear);
  const nepaliMonthConverted =
    englishToNepaliMonths[nepaliMonthName] || "Unknown Month";

  return `${nepaliDayConverted} ${nepaliMonthConverted} ${nepaliYearConverted}`;
};

export default FormatNepaliDate;
