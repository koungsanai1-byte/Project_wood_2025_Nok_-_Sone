import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";
import axios from 'axios';

const List = () => {
  // ✅ ສ້າງ state ເພື່ອເກັບຂໍ້ມູນຊື່ໄມ້ທັງໝົດ
  const [name, setName] = useState([]);

  // ✅ ເອີ້ນ API ດຶງຂໍ້ມູນເມື່ອເຂົ້າໜ້າ
  useEffect(() => {
    fetchNames();
  }, []);

  // ✅ ຟັງຊັນດຶງຂໍ້ມູນຈາກ API
  const fetchNames = () => {
    axios.get('http://localhost:3000/api/list_name')
      .then(res => {
        setName(res.data); // 🔹 ເກັບຂໍ້ມູນໃສ່ state
      })
      .catch(err => {
        console.log("Fetch error:", err);
      });
  };

  // ✅ ຟັງຊັນລຶບຂໍ້ມູນດ້ວຍ SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລຶບ?',
      text: 'ຂໍ້ມູນນີ້ຈະຖືກລຶບຖາວອນ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຕົກລົງ',
      cancelButtonText: 'ຍົກເລີກ',
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        // 🔹 ເມື່ອຢືນຢັນຈຶ່ງລຶບ
        axios.delete(`http://localhost:3000/api/delete_name/${id}`)
          .then(res => {
            console.log("Deleted:", res.data);
            fetchNames(); // 🔹 ດຶງຂໍ້ມູນໃໝ່ຫຼັງລຶບ

            Swal.fire({
              icon: 'success',
              title: 'ລຶບສຳເລັດ',
              text: 'ຂໍ້ມູນຖືກລຶບແລ້ວ!',
              timer: 2000,
              showConfirmButton: false,
            });
          })
          .catch(err => {
            console.error("Delete failed:", err);
            Swal.fire({
              icon: 'error',
              title: 'ລຶບບໍ່ສຳເລັດ',
              text: 'ເກີດຂໍ້ຜິດພາດໃນການລຶບ!',
            });
          });
      }
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* ✅ ຫົວຂໍ້ກັບປຸ່ມເພີ່ມໄມ້ໃໝ່ */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">ລາຍການ ຊື່ໄມ້</h2>
        <Link
          to="/name_create"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition">
          ➕ ເພີ່ມໄມ້ໃໝ່
        </Link>
      </div>

      {/* ✅ ຕາຕະລາງສະແດງຂໍ້ມູນ */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">ລະຫັດ</th>
              <th className="px-6 py-3">ຊື່ໄມ້</th>
              <th className="px-6 py-3">ໝາຍເຫດ</th>
              <th className="px-6 py-3 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {name.length === 0 ? (
              // ✅ ກໍລະນີບໍ່ມີຂໍ້ມູນ
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              // ✅ ເຊັດລາຍການຈາກ API
              name.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{d.id_name}</td>
                  <td className="px-6 py-4">{d.name}</td>
                  <td className="px-6 py-4">{d.note}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      {/* 🔹 ປຸ່ມແກ້ໄຂ */}
                      <Link
                        to={`/name_update/${d.id_name}`}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow flex items-center justify-center"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={16} />
                      </Link>
                      {/* 🔹 ປຸ່ມລຶບ */}
                      <button
                        onClick={() => handleDelete(d.id_name)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow flex items-center justify-center"
                        title="ລົບ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
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
