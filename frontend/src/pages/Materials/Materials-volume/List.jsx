import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';
import axios from "axios";

export default function ListVolume() {
  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/list_volume")
      .then(res => setVolumes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ຢືນຢັນການລົບຂໍ້ມູນ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_volume/${id}`);
      setVolumes(prev => prev.filter(item => item.id_volume !== id));
      Swal.fire({
        icon: 'success',
        title: 'ລົບສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire({
        icon: 'error',
        title: 'ລົບລົ້ມເຫຼວ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📦 ລາຍການ ໜ່ວຍວັດ</h2>
        <Link
          to="/volume_create"
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
        >
          ➕ ເພີ່ມໜ່ວຍວັດ
        </Link>
      </div>

      <div className="bg-white border shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-medium text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Volume</th>
              <th className="px-6 py-3 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {volumes.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-400 italic">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              volumes.map(volume => (
                <tr key={volume.id_volume} className="border-t">
                  <td className="px-6 py-4">{volume.id_volume}</td>
                  <td className="px-6 py-4">{volume.volume}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(volume.id_volume)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg shadow"
                        title="ລົບ"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">ລົບ</span>
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
}
