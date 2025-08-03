import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the active component from the current path
  const activeComponent = location.pathname.substring(1) || "dashboard";

  // Toggle sidebar for desktop
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Toggle sidebar for mobile
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Handle navigation when component changes
  const setActiveComponent = (componentId) => {
    navigate(`/${componentId}`);
  };

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      {/* Desktop Sidebar - Fixed */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } hidden md:block transition-all duration-300 ease-in-out h-screen`}
      >
        <div className="h-full">
          <Sidebar 
            expanded={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />
        </div>
      </div>

      {/* Mobile Sidebar - Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 md:hidden w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full shadow-xl">
          <Sidebar 
            expanded={true} 
            toggleSidebar={toggleMobileSidebar} 
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />
        </div>
      </div>

      {/* Main Content Area - Slides with sidebar */}
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out`}
      >
        {/* Header - Moves with sidebar toggle */}
        <div className="w-full bg-white shadow-sm z-10">
          <Header toggleSidebar={toggleMobileSidebar} />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-2 shadow-2xl w-full">
          <div className="container mx-auto">
            {/* Use Outlet instead of directly rendering Contentt */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;