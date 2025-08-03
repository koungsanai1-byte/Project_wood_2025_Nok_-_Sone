import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const List = () => {
  const [inspections, setInspections] = useState([]);
  const [improvedData, setImprovedData] = useState([]); // เพิ่มสำหรับข้อมูลปรับปรุงแล้ว
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'improvement', 'improved'

  useEffect(() => {
    fetchInspections();
    fetchImprovedData(); // เรียกข้อมูลปรับปรุงแล้ว
  }, []);

  const fetchInspections = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_inspection');
      setInspections(res.data);
    } catch (err) {
      console.error("Error loading inspections:", err);
    }
  };

  // เพิ่มฟังก์ชันดึงข้อมูลปรับปรุงแล้ว
  const fetchImprovedData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/improved_inspections');
      setImprovedData(res.data);
    } catch (err) {
      console.error("Error loading improved data:", err);
    }
  };

  const deleteInspection = async (id) => {
    const result = await Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບລາຍການນີ້?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/delete_inspection/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'ລົບສຳເລັດ',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
        fetchInspections();
      } catch (error) {
        console.error("ລົບບໍ່ສຳເລັດ:", error);
        Swal.fire({
          icon: 'error',
          title: 'ລົບບໍ່ສຳເລັດ',
          text: 'ກະລຸນາລອງໃໝ່ພາຍຫຼັງ',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }
    }
  };

  // กรองข้อมูลตาม tab ที่เลือก
  const getFilteredInspections = () => {
    switch (activeTab) {
      case 'improvement':
        // กรองรายการที่ต้องปรับปรุง (มีจำนวนไม่ผ่าน และยังไม่ได้ปรับปรุง)
        return inspections.filter(item =>
          (item.amount_b || 0) > 0 &&
          item.status !== 'ປັບປຸງແລ້ວ'
        );
      case 'improved':
        // ใช้ข้อมูลจาก improvement table
        return improvedData;
      case 'all':
      default:
        return inspections;
    }
  };

  const filteredInspections = getFilteredInspections();

  // นับจำนวนสำหรับแต่ละ tab
  const getTabCounts = () => {
    const improvement = inspections.filter(item =>
      (item.amount_b || 0) > 0 &&
      item.status !== 'ປັບປຸງແລ້ວ'
    ).length;

    const improved = improvedData.length; // ใช้ข้อมูลจาก improvement table

    return {
      all: inspections.length,
      improvement,
      improved
    };
  };

  const tabCounts = getTabCounts();

  // ฟังก์ชันแสดงข้อมูลตามแท็บ
  const renderCardContent = (item) => {
    if (activeTab === 'improved') {
      // แสดงข้อมูลจาก improvement table
      return (
        <>
          <p><strong>📦 ປະເພດ:</strong> {item.type_inspection}</p>
          <p><strong>📏 ຂະໜາດ:</strong> {item.size}</p>
          <p><strong>📊 ຈຳນວນກວດສອບ:</strong> {item.amount_inspection}</p>
          <p className="text-green-600"><strong>✅ ຈຳນວນປັບປຸງ:</strong> {item.amount_update}</p>
          <p className="text-red-500"><strong>❌ ບໍ່ໄດ້ແກ້:</strong> {item.amount_not_fix}</p>
          {item.amount_inspection > 0 && (
            <p className="text-blue-600">
              <strong>📈 ເປີເຊັນປັບປຸງ:</strong> {((item.amount_update / item.amount_inspection) * 100).toFixed(1)}%
            </p>
          )}
          <p><strong>📝 ໝາຍເຫດ:</strong> {item.note || '-'}</p>
          <p><strong>🔍 ID ກວດສອບ:</strong> {item.id_inspection}</p>
          <p><strong>🔥 ປະເພດອົບແຫ້ງ:</strong> {item.type_drying || '-'}</p>
          <p><strong>📏 ຂະໜາດອົບແຫ້ງ:</strong> {item.size_drying || '-'}</p>
          <p className="text-gray-700 font-medium text-base flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>{item.user}</span>
          </p>
        </>
      );
    } else if (activeTab === 'improvement') {
      // แสดงข้อมูลสำหรับแท็บปรับปรุง
      return (
        <>
          <p><strong>📦 ປະເພດໄມ້:</strong> {item.type_products}</p>
          <p><strong>📏 ຂະໜາດ:</strong> {item.size_products}</p>
          <p className="text-red-500 text-lg font-semibold">
            <strong>❌ ຈຳນວນບໍ່ຜ່ານ:</strong> {item.amount_b}
          </p>
          <p className="text-orange-600">
            <strong>📈 ເປີເຊັນບໍ່ຜ່ານ:</strong> {item.amount > 0 ? ((item.amount_b / item.amount) * 100).toFixed(1) : 0}%
          </p>
          <p><strong>📝 ໝາຍເຫດ:</strong> {item.note || '-'}</p>
          <p><strong>🔥 ອົບແຫ້ງ ID:</strong> {item.id_drying ?? '-'}</p>
        </>
      );
    } else {
      // แสดงข้อมูลปกติสำหรับแท็บทั้งหมด
      return (
        <>
          <p><strong>📦 ປະເພດໄມ້:</strong> {item.type_products}</p>
          <p><strong>📏 ຂະໜາດ:</strong> {item.size_products}</p>
          <p><strong>📊 ຈຳນວນທັງໝົດ:</strong> {item.amount}</p>
          <p className="text-green-600"><strong>✅ ຜ່ານ:</strong> {item.amount_a}</p>
          <p className="text-red-500"><strong>❌ ບໍ່ຜ່ານ:</strong> {item.amount_b}</p>
          {item.amount > 0 && (
            <p className="text-orange-600">
              <strong>📈 ເປີເຊັນບໍ່ຜ່ານ:</strong> {((item.amount_b / item.amount) * 100).toFixed(1)}%
            </p>
          )}
          <p><strong>📝 ໝາຍເຫດ:</strong> {item.note || '-'}</p>
          <p><strong>🔥 ອົບແຫ້ງ ID:</strong> {item.id_drying ?? '-'}</p>
          <p><strong>📊 ສະຖານະ:</strong>
            <span className={`ml-1 px-2 py-1 rounded text-xs ${item.status === 'ປັບປຸງແລ້ວ'
              ? 'bg-green-100 text-green-600'
              : 'bg-blue-100 text-blue-600'
              }`}>
              {item.status}
            </span>
          </p>
          <p className="text-gray-700 font-medium text-base flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>{item.user}</span>
          </p>
        </>
      );
    }
  };

  // ฟังก์ชันแสดงปุ่มตามแท็บ
  const renderActionButtons = (item) => {
    if (activeTab === 'improvement') {
      return (
        <Link
          to={`/production-improvement_create?id=${item.id_inspection}`}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm w-full text-center transition-all"
        >
          🔧 ປັບປຸງ
        </Link>
      );
    } else if (activeTab === 'improved') {
      return (
        <div className="w-full text-center py-2 text-green-600 font-medium">
          ✅ ດຳເນີນການປັບປຸງແລ້ວ
        </div>
      );
    }
    // สำหรับแท็บ all ไม่แสดงปุ่มอะไร
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-2">
          <span>📋</span>
          <span>ລາຍການກວດສອບສິນຄ້າ</span>
        </h1>
        <Link
          to={`/production-inspection_create`}
          className="inline-block bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-400 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300 font-semibold select-none"
        >
          ➕ ເພີ່ມການກວດສອບ
        </Link>
      </div>

      {/* Toggle Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl shadow-inner">
          {[
            { key: 'all', label: '📊 ທັງໝົດ', count: tabCounts.all, color: 'blue' },
            { key: 'improvement', label: '🔧 ຕ້ອງປັບປຸງ', count: tabCounts.improvement, color: 'orange' },
            { key: 'improved', label: '✅ ປັບປຸງແລ້ວ', count: tabCounts.improved, color: 'green' },
          ].map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors duration-300
            ${activeTab === key
                  ? `bg-white text-${color}-600 shadow-lg`
                  : `text-gray-600 hover:text-gray-900 hover:bg-gray-200`}
          `}
              aria-pressed={activeTab === key}
              role="tab"
              aria-selected={activeTab === key}
            >
              {label} <span className="font-mono text-xs bg-gray-200 rounded-full px-2 py-0.5 ml-1">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredInspections.length === 0 ? (
        <div className="bg-white text-center text-gray-500 py-20 rounded-lg shadow-md select-none">
          {activeTab === 'all' && 'ບໍ່ມີຂໍ້ມູນກວດສອບ'}
          {activeTab === 'improvement' && 'ບໍ່ມີຂໍ້ມູນທີ່ຕ້ອງປັບປຸງ'}
          {activeTab === 'improved' && 'ບໍ່ມີຂໍ້ມູນທີ່ປັບປຸງແລ້ວ'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInspections.map((item, index) => (
            <div
              key={activeTab === 'improved' ? item.id_improvement : item.id_inspection}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-200 flex flex-col justify-between"
              role="article"
              tabIndex={0}
            >
              <header className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-800">#{index + 1}</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-400 select-text">
                    ID: {activeTab === 'improved' ? item.id_improvement : item.id_inspection}
                  </span>

                  {(item.status === 'ປັບປຸງແລ້ວ' || activeTab === 'improved') && (
                    <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full select-none shadow-sm">
                      ✅ ປັບປຸງແລ້ວ
                    </span>
                  )}

                  {activeTab === 'improvement' && (
                    <span className="inline-flex items-center bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full select-none shadow-sm">
                      🔧 ຕ້ອງປັບປຸງ
                    </span>
                  )}

                  {/* ปุ่มลบเฉพาะแท็บ all และ improvement */}
                  {/* {activeTab !== 'improved' && (
                    <button
                      onClick={() => deleteInspection(item.id_inspection)}
                      title="ລົບລາຍການ"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label={`ลบรายการ ID ${item.id_inspection}`}
                    >
                      ❌
                    </button>
                  )} */}
                </div>
              </header>

              <div className="text-gray-600 text-sm space-y-2 mb-6">
                {renderCardContent(item)}
              </div>

              <footer className="flex justify-end space-x-3">
                {renderActionButtons(item)}
              </footer>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default List;