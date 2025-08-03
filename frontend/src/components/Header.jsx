import React, { useState, useEffect } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import Swal from "sweetalert2";

const Header = ({ toggleSidebar, onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    // ❗  SweetAlert2 ຍືນຢັນ
    Swal.fire({
      title: "ທ່ານຈະອອກຈາກລະບົບບໍ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ອອກຈາກລະບົບ",
      cancelButtonText: "ຍົກເລີກ",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ ถ้าผู้ใช้ยืนยัน
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        if (onLogout) onLogout();
        window.location.href = "/";
      }
    });
  };

  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);

  const handleShowLoginHistory = () => {
    // จำลองการโหลดข้อมูล login history
    const history = JSON.parse(localStorage.getItem("loginHistory")) || [];
    setLoginHistory(history);
    setShowLoginHistory(true);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="flex flex-row w-full justify-between items-center py-1 px-3 md:px-6 rounded-xl bg-white shadow-sm">
      {/* Left side - Menu toggle, Profile and Greeting */}
      <div className="flex items-center py-2 px-2">
        {/* Menu Toggle */}
        <button
          className="flex md:hidden w-10 h-10 mr-3 items-center justify-center"
          onClick={toggleSidebar}
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Profile Picture or Initial */}
        {user && user.image_users ? (
          <img
            src={`http://localhost:3000/uploads/${user.image_users}`}
            alt="Profile"
            className="hidden md:flex w-10 h-10 rounded-full object-cover mr-3"
            onClick={() => {
              setSelectedImage(`http://localhost:3000/uploads/${user.image_users}`);
              setShowModal(true);
            }}
          />
        ) : (
          <div className="hidden md:flex w-10 h-10 bg-indigo-600 rounded-full items-center justify-center cursor-pointer shadow-sm hover:shadow transition-shadow overflow-hidden mr-3">
            <span className="text-white font-bold text-lg">
              {user ? user.username.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        )}
        {/* Username */}
        <h1 className="text-sm md:text-xl font-bold text-gray-800">
          {user ? user.username : "ຜູ້ໃຊ້"}
        </h1>
      </div>
      {/* Right side - Icons and Logout */}
      <div className="flex items-center">
        {/* Notifications */}
        <div
          className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow-2xl hover:shadow transition-shadow mr-2"
          onClick={handleShowLoginHistory}
        >
          <Bell size={14} className="text-gray-600" />
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow-2xl transition-shadow mr-5 hover:bg-red-600 "
            title="Logout"
          >
            <LogOut size={14} className="text-white" />
          </button>
        )}
      </div>

      {showLoginHistory && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
          onClick={() => setShowLoginHistory(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">📜 ປະຫວັດການເຂົ້າລະບົບ</h2>
              <button
                onClick={() => setShowLoginHistory(false)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            {loginHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">ບໍ່ມີຂໍ້ມູນການເຂົ້າລະບົບ</p>
            ) : (
              <ul className="text-sm space-y-2 max-h-[300px] overflow-y-auto">
                {[...loginHistory].reverse().map((entry, index) => (
                  <li key={index} className="border-b pb-2">
                    🕒 {entry.time} - {entry.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}


      {/* Modal ดูรูปภาพ */}
      {showModal && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => {
            setShowModal(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="preview"
              className="w-full h-auto rounded-xl shadow-2xl border-4 border-white"
            />
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 mr-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-xl py-1 px-3 shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Header;
