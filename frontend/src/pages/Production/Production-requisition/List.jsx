import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";
import { Trash2, CheckCircle, Clock, Play } from "lucide-react";
import axios from "axios";

export default function List() {
  const [requisitions, setRequisitions] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ordered', 'produced'
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    axios.get("http://localhost:3000/api/list_requisition")
      .then(res => {
        setRequisitions(res.data);
      })
      .catch(err => {
        console.log(err)
        alert('can not select');
      });
  };


  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບລາຍການນີ້?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_requisition/${id}`);
      Swal.fire({
        icon: 'success',
        title: '✅ ລົບສຳເລັດ',
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
      });
      fetchRequisitions();
    } catch (error) {
      console.error('Delete failed:', error);
      Swal.fire({
        icon: 'error',
        title: '❌ ລົບລົ້ມເຫຼວ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };


  // ฟังก์ชันสำหรับจัดการการคลิก status
  const handleStatusClick = (requisition) => {
    // ตรวจสอบว่า status ไม่ใช่ "ສັ່ງຜະລິດແລ້ວ"
    if (requisition.status !== "ສັ່ງຜະລິດແລ້ວ") {
      // ส่งข้อมูลไปยัง create form
      navigate("/production-process_create", {
        state: {
          selectedRequisition: requisition
        }
      });
    }
  };

  // ฟังก์ชันกรองข้อมูลตาม tab ที่เลือก
  const getFilteredRequisitions = () => {
    switch (activeTab) {
      case 'ordered':
        return requisitions.filter(item => item.status === 'ສັ່ງຜະລິດ');
      case 'produced':
        return requisitions.filter(item => item.status === 'ສັ່ງຜະລິດແລ້ວ');
      case 'all':
      default:
        return requisitions;
    }
  };

  const filteredRequisitions = getFilteredRequisitions();

  // นับจำนวนสำหรับแต่ละ tab
  const getTabCounts = () => {
    const ordered = requisitions.filter(item => item.status === 'ສັ່ງຜະລິດ').length;
    const produced = requisitions.filter(item => item.status === 'ສັ່ງຜະລິດແລ້ວ').length;

    return {
      all: requisitions.length,
      ordered,
      produced
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">📋 ລາຍການຂໍເບີກໄມ້</h2>
        <Link
          to="/production-requisition_create"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          ➕ ເບີກເພີ່ມ
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
            onClick={() => setActiveTab('ordered')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'ordered'
              ? 'bg-white text-yellow-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            📦 ສັ່ງຜະລິດ ({tabCounts.ordered})
          </button>
          <button
            onClick={() => setActiveTab('produced')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'produced'
              ? 'bg-white text-green-600 shadow-md'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            ✅ ສັ່ງຜະລິດແລ້ວ ({tabCounts.produced})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-center">
          <thead className="bg-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-2 px-3 border">ລະຫັດ</th>
              <th className="py-2 px-3 border">ໄມ້</th>
              <th className="py-2 px-3 border">ປະເພດ</th>
              <th className="py-2 px-3 border">ຂະໜາດ</th>
              <th className="py-2 px-3 border">ບ່ອນຈັດເກັບ</th>
              <th className="py-2 px-3 border">ໜ່ວຍວັດ</th>
              <th className="py-2 px-3 border">ຈຳນວນເບີກ</th>
              <th className="py-2 px-3 border">ຜູ້ຮັບຜິດຊອບ</th>
              <th className="py-2 px-3 border">ສະຖານະ</th>
              <th className="py-2 px-3 border">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequisitions.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-6 text-gray-500 italic">
                  {activeTab === 'all' && 'ບໍ່ມີຂໍ້ມູນການເບີກ'}
                  {activeTab === 'ordered' && 'ບໍ່ມີຂໍ້ມູນການເບີກທີ່ສັ່ງຜະລິດ'}
                  {activeTab === 'produced' && 'ບໍ່ມີຂໍ້ມູນການເບີກທີ່ສັ່ງຜະລິດແລ້ວ'}
                </td>
              </tr>
            ) : (
              filteredRequisitions.map((item) => (
                <tr key={item.id_requisition} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-3 border">{item.id_requisition}</td>
                  <td className="py-2 px-3 border">{item.name}</td>
                  <td className="py-2 px-3 border">{item.type}</td>
                  <td className="py-2 px-3 border">{item.size}</td>
                  <td className="py-2 px-3 border">{item.storages}</td>
                  <td className="py-2 px-3 border">{item.volume}</td>
                  <td className="py-2 px-3 border">{item.amount}</td>
                  <td className="py-2 px-3 border">{item.user}</td>
                  <td className="py-2 px-3 border text-center">
                    <button
                      onClick={() => handleStatusClick(item)}
                      disabled={item.status === "ສັ່ງຜະລິດແລ້ວ"}
                      title={
                        item.status === "ສັ່ງຜະລິດແລ້ວ"
                          ? "ສັ່ງຜະລິດແລ້ວ - ບໍ່ສາມາດແກ້ໄຂໄດ້"
                          : "ຄລິກເພື່ອສ້າງ Process"
                      }
                      className={`flex items-center justify-center gap-1 py-1 px-3 rounded-md font-medium text-sm transition-colors
      ${item.status === "ສັ່ງຜະລິດແລ້ວ"
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : item.status === "ສັ່ງຜະລິດ"
                            ? "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                            : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        }
    `}
                    >
                      {item.status === "ສັ່ງຜະລິດແລ້ວ" && <CheckCircle size={16} />}
                      {item.status === "ສັ່ງຜະລິດ" && <Clock size={16} />}
                      {!item.status && <Play size={16} />}
                      <span className="hidden sm:inline">{item.status || "ສັ່ງຜະລິດ"}</span>
                    </button>
                  </td>
                  <td className="py-2 px-3 border">
                    <button
                      onClick={() => handleDelete(item.id_requisition)}
                      className={`flex items-center gap-1 py-1 px-3 rounded-md font-medium transition-colors ${item.status === "ສັ່ງຜະລິດແລ້ວ"
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      disabled={item.status === "ສັ່ງຜະລິດແລ້ວ"}
                      title={
                        item.status === "ສັ່ງຜະລິດແລ້ວ"
                          ? "ບໍ່ສາມາດລົບໄດ້ເນື່ອງຈາກສັ່ງຜະລິດແລ້ວ"
                          : "ລົບຂໍ້ມູນ"
                      }
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">ລົບ</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}