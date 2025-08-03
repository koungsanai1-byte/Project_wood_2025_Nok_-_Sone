import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const DryingList = () => {
  const [dryingList, setDryingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDryings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/drying');
      setDryingList(res.data);
    } catch (err) {
      console.error("ไม่สามารถโหลดข้อมูล drying ได้", err);
    }
  };

  useEffect(() => {
    fetchDryings();
  }, []);

  // ✅ ยืนยันการอบเสร็จสิ้น
  const handleConfirmDryingDone = async (id) => {

    const result = await Swal.fire({
      title: '🔥 ຢືນຢັນການອົບສຳເລັດ',
      text: "ຕ້ອງການອັບເດດສະຖານະເປັນ 'ກວດສອບ' ຫຼືບໍ່?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ຕົກລົງ',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (!result.isConfirmed) return;


    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/api/drying/confirm-done/${id}`);

      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ!',
        text: response.data.message || 'ອົບສຳເລັດ!',
        confirmButtonText: 'ຕົກລົງ',
        confirmButtonColor: '#16a34a' // เขียว
      });

      // รีเฟรชข้อมูล
      await fetchDryings();

    } catch (err) {
      console.error("อัปเดตสถานะล้มเหลว", err);
      alert("❌ ເກີດຂໍ້ຜິດພາດ");
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const statusStyles = {
      'ກວດສອບ': {
        class: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
        text: 'ກວດສອບ'
      },
      'ກຳລັງອົບ': {
        class: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🔥',
        text: 'ກຳລັງອົບ'
      },
      'ພ້ອມກວດສອບ': {
        class: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '📋',
        text: 'ພ້ອມກວດສອບ'
      }
    };

    const style = statusStyles[status] || {
      class: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: '❓',
      text: status
    };

    return (
      <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-full border ${style.class}`}>
        <span>{style.icon}</span>
        {style.text}
      </span>
    );
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';

    // เช็คถ้าเป็นรูปแบบเวลา HH:mm:ss (ง่าย ๆ)
    const timeOnlyPattern = /^\d{2}:\d{2}:\d{2}$/;
    if (timeOnlyPattern.test(dateTime)) {
      return dateTime;  // แสดงแค่เวลาได้เลย
    }

    // กรณีเป็นวันที่เต็ม
    try {
      const dt = new Date(dateTime);
      if (isNaN(dt.getTime())) return '-';
      return dt.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🔥 ລາຍການອົບແຫ້ງໄມ້</h1>
        <Link
          to="/production-drying_create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2"
        >
          ➕ ເພີ່ມການອົບໃໝ່
        </Link>
      </div>

      {dryingList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 text-lg">ຍັງບໍ່ມີຂໍ້ມູນການອົບແຫ້ງ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dryingList.map((dry) => (
            <div key={dry.id_drying} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl text-gray-800">#{dry.id_drying}</h2>
                {renderStatusBadge(dry.status)}
              </div>

              {/* Content */}
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📌</span>
                  <strong>ປະເພດ:</strong> {dry.type_drying || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">📐</span>
                  <strong>ຂະໜາດ:</strong> {dry.size_drying || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">📦</span>
                  <strong>ຈຳນວນ:</strong> {dry.amount_drying || 0}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🧑‍💼</span>
                  <strong>ຜູ້ຮັບຜິດຊອບ:</strong> {dry.user}
                </div>

                {dry.note && (
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">📝</span>
                    <div>
                      <strong>ໝາຍເຫດ:</strong>
                      <p className="text-gray-600 mt-1">{dry.note}</p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-3 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-indigo-600">🕒</span>
                    <strong>ເວລາເລີ່ມ:</strong> {formatDateTime(dry.time_start)}
                  </div>
                  {dry.time_end && (
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">🕔</span>
                      <strong>ເວລາສິ້ນສຸດ:</strong> {formatDateTime(dry.time_end)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {/* ปุ่มยืนยันการอบเสร็จ สำหรับสถานะ 'ກຳລັງອົບ' */}
                {dry.status === 'ກຳລັງອົບ' && (
                  <button
                    onClick={() => handleConfirmDryingDone(dry.id_drying)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ກຳລັງປັບປຸງ...
                      </>
                    ) : (
                      <>
                        ✅ ຢືນຢັນອົບສຳເລັດ
                      </>
                    )}
                  </button>
                )}

                {/* ปุ่มไปหน้าตรวจสอบ สำหรับสถานะ 'ກວດສອບ' */}
                {dry.status === 'ກວດສອບ' && (
                  <Link
                    to={`/production-inspection_create/${dry.id_drying}`}
                    className="block w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl transition"
                  >
                    📋 ເລີ່ມກວດສອບ
                  </Link>
                )}

                {/* สถานะพร้อมตรวจสอบ */}
                {dry.status === 'ພ້ອມກວດສອບ' && (
                  <div className="w-full text-center bg-blue-100 text-blue-800 font-semibold py-3 rounded-xl">
                    📋 ພ້ອມສຳລັບການກວດສອບ
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DryingList;