import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function ListTypeProducts() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/list_type_products")
      .then(res => setTypes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບຂໍ້ມູນນີ້?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/delete_type_products/${id}`)
          .then(() => {
            setTypes(prev => prev.filter(item => item.id_type_products !== id));
            Swal.fire({
              icon: 'success',
              title: 'ລົບສຳເລັດ',
              toast: true,
              position: 'top-center',
              timer: 2000,
              showConfirmButton: false
            });
          })
          .catch(err => {
            console.error("Delete failed:", err);
            Swal.fire({
              icon: 'error',
              title: 'ລົບບໍ່ສຳເລັດ',
              text: 'ກະລຸນາລອງໃໝ່ພາຍໃນພາຍຫຼັງ',
              toast: true,
              position: 'top-center',
              timer: 3000,
              showConfirmButton: false
            });
          });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📂 ປະເພດສິນຄ້າ</h2>
        <Link
          to="/inventory-type_create"
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
              <th className="px-6 py-3">ຊື່ປະເພດ</th>
              <th className="px-6 py-3 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {types.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-400 italic">ບໍ່ມີຂໍ້ມູນ</td>
              </tr>
            ) : (
              types.map(type => (
                <tr key={type.id_type_products} className="border-t">
                  <td className="px-6 py-4">{type.id_type_products}</td>
                  <td className="px-6 py-4">{type.type_products}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/inventory-type_update/${type.id_type_products}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(type.id_type_products)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        title="ລົບ"
                      >
                        <Trash2 size={18} />
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
