import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ResponsiveFinancialChart = () => {
  const containerRef = useRef(null);

  // State for chart data and statistics
  const [data, setData] = useState([]);
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [monthlyPurchase, setMonthlyPurchase] = useState(0);
  const [latestPurchase, setLatestPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for responsive parameters
  const [chartHeight, setChartHeight] = useState(300);
  const [barSize, setBarSize] = useState(20);
  const [containerWidth, setContainerWidth] = useState(0);

  // Base API URL - adjust according to your server
  const API_BASE_URL = 'http://localhost:3000/api';

  // Function to fetch data from APIs
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all statistics
      const [totalRes, monthlyRes, latestRes, chartRes] = await Promise.all([
        fetch(`${API_BASE_URL}/total-s`),
        fetch(`${API_BASE_URL}/monthly-s`),
        fetch(`${API_BASE_URL}/latest`),
        fetch(`${API_BASE_URL}/chart-data`)
      ]);

      // Check if all requests were successful
      if (!totalRes.ok || !monthlyRes.ok || !latestRes.ok || !chartRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const totalData = await totalRes.json();
      const monthlyData = await monthlyRes.json();
      const latestData = await latestRes.json();
      const chartData = await chartRes.json();

      // Set state with fetched data

      setTotalPurchase(totalData.total_purchase || 0);
      setMonthlyPurchase(monthlyData.monthly_total || 0);
      setLatestPurchase(latestData);
      setData(chartData || []);

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);

      // Set default data in case of error
      setData([
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 },
        { month: "May", amount: 0 },
        { month: "Jun", amount: 0 },
        { month: "Jul", amount: 0 },
        { month: "Aug", amount: 0 },
        { month: "Sep", amount: 0 },
        { month: "Oct", amount: 0 },
        { month: "Nov", amount: 0 },
        { month: "Dec", amount: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();

    // Optional: Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);

    return () => clearInterval(interval);
  }, []);

  // Function to detect container width changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Adjust chart parameters based on data length and container width
  useEffect(() => {
    let baseBarSize = containerWidth >= 768 ? 70 : 30;

    if (data.length > 50) {
      setChartHeight(180);
      setBarSize(containerWidth >= 768 ? 12 : 10); // 10 แทน 6 เดิม
    } else if (data.length > 30) {
      setChartHeight(200);
      setBarSize(containerWidth >= 768 ? 20 : 15); // 15 แทน 10 เดิม
    } else if (data.length > 15) {
      setChartHeight(250);
      setBarSize(containerWidth >= 768 ? 25 : 20); // 20 แทน 15 เดิม
    } else {
      setBarSize(baseBarSize);
    }

    if (containerWidth < 500) {
      setChartHeight((prev) => Math.max(prev - 20, 220));
      setBarSize((prev) => Math.max(prev, 18)); // ตั้งขั้นต่ำไว้ที่ 18
    }
    if (containerWidth < 350) {
      setChartHeight(180);
      setBarSize(15); // ไม่ต่ำกว่า 15
    }
  }, [data.length, containerWidth]);

  const getXAxisTickConfig = () => {
    if (containerWidth < 350) {
      return {
        fontSize: 8,
        interval: "preserveStartEnd",
        angle: -60,
        height: 60,
        textAnchor: "end",
      };
    } else if (data.length > 20 || containerWidth < 500) {
      return {
        fontSize: 8,
        interval: "preserveStartEnd",
        angle: -45,
        height: 50,
        textAnchor: "end",
      };
    } else if (data.length > 12) {
      return {
        fontSize: 10,
        interval: "preserveStartEnd",
        angle: -45,
        height: 50,
        textAnchor: "end",
      };
    }
    return {
      fontSize: 10,
      interval: 0,
      angle: 0,
      height: 50,
      textAnchor: "middle",
    };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full" ref={containerRef}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex flex-col w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
            ການຜະລິດ
          </h2>
          <button
            onClick={fetchData}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            refest
          </button>
        </div>

        {error && (
          <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            Error: {error}
          </div>
        )}

        <div className="mb-1 text-xs md:text-sm text-gray-500">
          {data.length > 12
            ? `Showing ${data.length} data points (compressed view)`
            : "ຕໍ່ເດືອນ"}
        </div>

        <div className="w-full" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="140%">
            <BarChart
              data={data}
              margin={{
                top: 22,
                right: 5,
                left: 10,
                bottom: getXAxisTickConfig().angle !== 0 ? 40 : 1,
              }}
            >
              <XAxis dataKey="month" tick={getXAxisTickConfig()} />
              <YAxis
                tick={{ fontSize: containerWidth < 700 ? 8 : 13 }}
                width={containerWidth < 350 ? 40 : 50}
              />
              <Tooltip
                formatter={(value) => [`${formatCurrency(value)} ₭`, 'ຍອດລວມ']}
              />
              <Bar
                dataKey="amount"
                fill="#6366f1"
                barSize={barSize}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-16">
          <div className="border rounded-lg p-2">
            <p className="text-xs text-gray-500">ທັງໝົດ</p>
            <p className="text-sm font-semibold">
              {formatCurrency(totalPurchase)} ₭
            </p>
          </div>
          <div className="border rounded-lg p-2">
            <p className="text-xs text-gray-500">ເດືອນນີ້</p>
            <p className="text-sm font-semibold">
              {formatCurrency(monthlyPurchase)} ₭
            </p>
          </div>
          <div className="border rounded-lg p-2">
            <p className="text-xs text-gray-500">ຊື້ລ່າສຸດ</p>
            <p className="text-sm font-semibold">
              {latestPurchase ? formatCurrency(latestPurchase.total) : '0'} ₭
            </p>
            <p className="text-xs text-gray-400">
              {latestPurchase ? formatDate(latestPurchase.date_purchase) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveFinancialChart;