"use client";
import { Table, Statistic, message } from "antd";
import { useState, useEffect } from "react";
import { Get } from "../../Redux/API";
import { useNavigation } from "../../Context/NavigationContext";
import { formatNumber } from "../../JS/formatNumber";
import { useRouter } from "next/navigation";
import { useCount } from "../../Context/CountContext";

export default function Review() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [topNews, setTopNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lge } = useNavigation();
  const router = useRouter();
  const { count } = useCount();

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

  // Fetch top news using the new API endpoint
  useEffect(() => {
    const fetchTopNews = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("Token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch popular news from the new API endpoint
        const newsResponse = await Get({
          url: `/news/news/get-popular-news?language=${lge}&limit=5`,
          headers: headers,
        });

        // Get view counts from context
        const viewsResponse = await count;

        if (!Array.isArray(viewsResponse)) {
          console.error("Invalid viewsResponse:", viewsResponse);
          return;
        }

        // Extract news data from response.results
        const popularNews = newsResponse.results || [];

        // Create a map of view counts by news ID
        const viewsMap = {};
        viewsResponse.forEach((view) => {
          viewsMap[String(view.title)] = view.visit_count || 0;
        });

        // Map the response to the table data format with view counts
        const tableData = popularNews.map((news) => ({
          key: news.id,
          title: news.news_title,
          views_count: viewsMap[String(news.id)] || 0,
          category: news.category_names?.[0] || "",
        }));

        setTopNews(tableData);
      } catch (error) {
        console.error("Error fetching top news:", error?.response?.data?.code);
        if (error?.response?.data?.code === "token_not_valid") {
          localStorage.removeItem("Token");
          message.error(error.response?.data?.code);
          router.push("/dashboard/login");
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
          dataSource={topNews.length > 0 ? topNews : []}
          columns={columns}
          pagination={false}
          rowClassName="hover:bg-green-50"
          scroll={{ x: "max-content" }}
          loading={loading}
        />
        {topNews.length === 0 && !loading && <p>Loading ...</p>}
      </div>
    </div>
  );
}
