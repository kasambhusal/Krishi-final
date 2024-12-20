"use client";
import { Table, Statistic, message } from "antd";
import React, { useState, useEffect } from "react";
import { Get } from "../../Redux/API";
import { useCount } from "../../Context/CountContext";
import { useNavigation } from "../../Context/NavigationContext";
import { formatNumber } from "../../JS/formatNumber";

export default function Review() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { count } = useCount();
  const { lge } = useNavigation();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 400,
    },
    {
      title: "Views",
      dataIndex: "views_count",
      key: "views_count",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
  ];

  // Fetch visitor count
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await Get({ url: "/count/total-count/" });
        setVisitorCount(response.total_visit_count || 0);
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  // Fetch top 5 news based on views count for the selected language
  useEffect(() => {
    const fetchTopNews = async () => {
      setLoading(true);
      try {
        const viewsResponse = await count;

        if (!Array.isArray(viewsResponse)) {
          console.error("Invalid viewsResponse:", viewsResponse);
          return;
        }

        // Log views response
        // console.log("Views Response:", viewsResponse);

        // Sort views response by visit count
        const sortedViews = viewsResponse.sort(
          (a, b) => b.visit_count - a.visit_count
        );
        const token = localStorage.getItem("Token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await Get({
          url: "/news/news",
          headers: headers,
        });
        // Log whole news response
        // console.log("Whole News Response:", response);
        const wholeNews = response.filter(
          (item) => item.language === lge && item.active
        );

        // Map the sorted views to news items
        const tableData = sortedViews
          .map((view) => {
            const matchingNews = wholeNews.find(
              (news) => String(news.id) === String(view.title) // Ensure both sides are strings
            );

            return matchingNews
              ? {
                  key: matchingNews.id,
                  title: matchingNews.news_title,
                  views_count: view.visit_count,
                  category: matchingNews.category_name,
                }
              : null;
          })
          .filter((item) => item !== null)
          .slice(0, 5); // Ensure only the top 5 items are returned

        setTopNews(tableData);
      } catch (error) {
        console.error("Error fetching top news:", error?.response?.data?.code);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("Token");
          message.error(error.response?.data?.code);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopNews();
  }, [count, lge]);

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-100 p-6 rounded-lg shadow-md">
      {/* Number of Visitors */}
      <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
        <div className="bg-white p-6 rounded-lg shadow-lg flex-1 mx-2">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Number of Visitors
          </h2>
          <span className="text-4xl text-green-600 font-semibold">
            <Statistic
              value={formatNumber(visitorCount)}
              valueStyle={{ color: "#3f8600" }}
            />
          </span>
        </div>
      </div>

      {/* Top 5 Most Viewed News */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Top 5 Most Viewed News
        </h2>
        <Table
          dataSource={topNews.length > 0 ? topNews : []} // Ensure the table gets an empty array if no data
          columns={columns}
          pagination={false}
          rowClassName="hover:bg-green-50"
          scroll={{ x: "max-content" }}
          loading={loading}
        />
        {topNews.length === 0 && !loading && <p>Loading ...</p>}{" "}
        {/* Display a message when there's no data */}
      </div>
    </div>
  );
}
