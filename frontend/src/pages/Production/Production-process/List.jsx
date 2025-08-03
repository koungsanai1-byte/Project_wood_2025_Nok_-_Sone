// List.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, Package, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';
import axios from 'axios';

const List = () => {
  const [processes, setProcesses] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'producing', 'ready', 'completed'
  const navigate = useNavigate();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = () => {
    axios.get('http://localhost:3000/api/list_process_x')
      .then(res => {
        if (Array.isArray(res.data)) setProcesses(res.data);
        else if (res.data) setProcesses([res.data]);
        else setProcesses([]);
      })
      .catch(err => console.error('Error loading process:', err));
  };

  const handleStatusClick = (item) => {
    // ตรวจสอบ status และนำไปหน้าที่เหมาะสม
    if (item.status === "ພ້ອມອົບ") {
      // ไปหน้า create drying พร้อมส่งข้อมูล process
      navigate('/production-drying_create', { state: { processData: item } });
    } else {
      // แบบเก่า: ส่งข้อมูลไปฟอร์มแก้ไข พร้อมข้อมูล process
      navigate('/amount', { state: { processData: item } });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບລາຍການນີ້?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/delete_process/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'ລົບສຳເລັດ',
              toast: true,
              position: 'top-end',
              timer: 2000,
              showConfirmButton: false,
            });
            fetch();
          })
          .catch(err => {
            console.error('Error deleting:', err);
            Swal.fire({
              icon: 'error',
              title: 'ລົບລົ້ມເຫຼວ',
              text: err.message || '',
              toast: true,
              position: 'top-end',
              timer: 3000,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  // กรองข้อมูลตาม tab ที่เลือก
  const getFilteredProcesses = () => {
    switch (activeTab) {
      case 'producing':
        return processes.filter(item => item.status === 'ກຳລັງຜະລິດ');
      case 'ready':
        return processes.filter(item => item.status === 'ພ້ອມອົບ');
      case 'completed':
        return processes.filter(item =>
          item.status === 'ຜະລິດສຳເລັດ' ||
          item.status === 'ສຳເລັດ' ||
          item.status === 'ສົ່ງອົບແລ້ວ'
        );
      case 'all':
      default:
        return processes;
    }
  };

  const filteredProcesses = getFilteredProcesses();

  // นับจำนวนสำหรับแต่ละ tab
  const getTabCounts = () => {
    const producing = processes.filter(item => item.status === 'ກຳລັງຜະລິດ').length;
    const ready = processes.filter(item => item.status === 'ພ້ອມອົບ').length;
    const completed = processes.filter(item =>
      item.status === 'ຜະລິດສຳເລັດ' ||
      item.status === 'ສຳເລັດ' ||
      item.status === 'ສົ່ງອົບແລ້ວ'
    ).length;

    return {
      all: processes.length,
      producing,
      ready,
      completed
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📦 ລາຍການ ຜະລິດ</h2>
        <Link
          to="/production-process_create"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          ➕ ສັ່ງຜະລິດ
        </Link>
      </div>

      {/* Toggle Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            📊 ທັງໝົດ ({tabCounts.all})
          </button>
          <button
            onClick={() => setActiveTab('producing')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'producing'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            🔄 ກຳລັງຜະລິດ ({tabCounts.producing})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'ready'
              ? 'bg-white text-purple-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            🔥 ພ້ອມອົບ ({tabCounts.ready})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'completed'
              ? 'bg-white text-green-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            ✅ ສຳເລັດ ({tabCounts.completed})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-center">
          <thead className="bg-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-2 px-3 border">ເລກໄມ້ທີ່ເບີກ</th>
              <th className="py-2 px-3 border">ຊື່ໄມ້</th>
              <th className="py-2 px-3 border">ປະເພດ</th>
              <th className="py-2 px-3 border">ຂະໜາດ</th>
              <th className="py-2 px-3 border">ໜ່ວຍວັດ</th>
              <th className="py-2 px-3 border">ຈຳນວນເບີກ</th>
              <th className="py-2 px-3 border">ເລກໄມ້ທີຜະລິດ</th>
              <th className="py-2 px-3 border">ປະເພດຜະລິດ</th>
              <th className="py-2 px-3 border">ຂະໜາດຜະລິດ</th>
              <th className="py-2 px-3 border">ຈຳນວນຜະລິດ</th>
              <th className="py-2 px-3 border">ໝາຍເຫດ</th>
              <th className="py-2 px-3 border">ຜູ້ຮັບຜິດຊອບ</th>
              <th className="py-2 px-3 border">ສະຖານະ</th>
              {/* <th className="py-2 px-3 border">ຈັດການ</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.length === 0 ? (
              <tr>
                <td colSpan="13" className="py-6 text-gray-500 italic">
                  {activeTab === 'all' && 'ບໍ່ມີຂໍ້ມູນການຜະລິດ'}
                  {activeTab === 'producing' && 'ບໍ່ມີຂໍ້ມູນການຜະລິດທີ່ກຳລັງດຳເນີນ'}
                  {activeTab === 'ready' && 'ບໍ່ມີຂໍ້ມູນການຜະລິດທີ່ພ້ອມອົບ'}
                  {activeTab === 'completed' && 'ບໍ່ມີຂໍ້ມູນການຜະລິດທີ່ສຳເລັດແລ້ວ'}
                </td>
              </tr>
            ) : (
              filteredProcesses.map(item => (
                <tr key={item.id_process} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-3 border">{item.id_requisition}</td>
                  <td className="py-2 px-3 border">{item.name}</td>
                  <td className="py-2 px-3 border">{item.type}</td>
                  <td className="py-2 px-3 border">{item.size}</td>
                  <td className="py-2 px-3 border">{item.volume}</td>
                  <td className="py-2 px-3 border">{item.amount}</td>
                  <td className="py-2 px-3 border">{item.id_process}</td>
                  <td className="py-2 px-3 border">{item.type_products}</td>
                  <td className="py-2 px-3 border">{item.size_products}</td>
                  <td className="py-2 px-3 border">{item.amount_products}</td>
                  <td className="py-2 px-3 border">{item.note || '-'}</td>
                  <td className="py-2 px-3 border">{item.user || '-'}</td>

                  <td className="py-2 px-3 border text-center">
                    <button
                      onClick={() => handleStatusClick(item)}
                      disabled={
                        !item.status ||
                        (item.status !== "ກຳລັງຜະລິດ" && item.status !== "ພ້ອມອົບ")
                      }
                      className={`flex items-center justify-center gap-1 rounded-md font-medium text-sm px-3 py-1 transition-colors
                       ${item.status === "ກຳລັງຜະລິດ"
                          ? "bg-blue-500 text-white hover:bg-blue-700 cursor-pointer"
                          : item.status === "ພ້ອມອົບ"
                            ? "bg-purple-500 text-white hover:bg-purple-700 cursor-pointer"
                            : ["ຜະລິດສຳເລັດ", "ສຳເລັດ", "ສົ່ງອົບແລ້ວ"].includes(item.status)
                              ? "italic text-gray-600 cursor-default bg-gray-100"
                              : "text-gray-600 cursor-default bg-transparent"
                        }
                          `}
                      title={
                        item.status === "ກຳລັງຜະລິດ"
                          ? "ກຳລັງຜະລິດ - ກົດເພື່ອແກ້ໄຂ"
                          : item.status === "ພ້ອມອົບ"
                            ? "ພ້ອມອົບ - ກົດເພື່ອແກ້ໄຂ"
                            : "ສະຖານະສິນຄ້າ"
                      }
                    >
                      {item.status === "ກຳລັງຜະລິດ" && <Loader2 size={16} className="animate-spin" />}
                      {item.status === "ພ້ອມອົບ" && <Package size={16} />}
                      {["ຜະລິດສຳເລັດ", "ສຳເລັດ", "ສົ່ງອົບແລ້ວ"].includes(item.status) && (
                        <CheckCircle2 size={16} />
                      )}
                      <span className="whitespace-nowrap">{item.status || "-"}</span>
                    </button>
                  </td>

                  {/* <td className="py-2 px-3 border">
                    <button
                      onClick={() => handleDelete(item.id_process)}
                      className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      title="ລົບ"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;