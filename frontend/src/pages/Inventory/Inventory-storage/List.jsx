import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function ListStoragesProducts() {
  const [storages, setStorages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/list_storages_products")
      .then(res => setStorages(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບລາຍການນີ້?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/delete_storages_products/${id}`)
          .then(() => {
            setStorages(prev => prev.filter(item => item.id_storages_products !== id));
            Swal.fire({
              icon: 'success',
              title: 'ລົບສຳເລັດ',
              toast: true,
              position: 'top',
              timer: 2000,
              showConfirmButton: false
            });
          })
          .catch(err => {
            console.error("Delete failed:", err);
            Swal.fire({
              icon: 'error',
              title: 'ລົບລົ້ມເຫຼວ',
              toast: true,
              position: 'top',
              timer: 2500,
              showConfirmButton: false
            });
          });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📂 ລ໋ອກເກັບສິນຄ້າ</h2>
        <Link
          to="/inventory-storage_create"
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700"
        >
          ➕ ເພີ່ມ
        </Link>
      </div>

      <div className="bg-white border shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-medium text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">ຊື່ສະຖານທີ່</th>
              <th className="px-6 py-3 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {storages.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-400 italic">ບໍ່ມີຂໍ້ມູນ</td>
              </tr>
            ) : (
              storages.map(storage => (
                <tr key={storage.id_storages_products} className="border-t">
                  <td className="px-6 py-4">{storage.id_storages_products}</td>
                  <td className="px-6 py-4">{storage.storages_products}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex gap-2 justify-center">
                      <Link
                        to={`/inventory-storage_update/${storage.id_storages_products}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(storage.id_storages_products)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
}
