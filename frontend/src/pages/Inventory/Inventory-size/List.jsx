import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function List() {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = () => {
    axios.get("http://localhost:3000/api/list_size_products")
      .then(res => setSizes(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: 'ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບຂໍ້ມູນນີ້?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/delete_size_products/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '✅ ລົບສຳເລັດ',
              toast: true,
              position: 'top',
              timer: 2000,
              showConfirmButton: false,
            });
            fetchSizes();
          })
          .catch((err) => {
            console.error("Delete error:", err);
            Swal.fire({
              icon: 'error',
              title: '❌ ລົບບໍ່ສຳເລັດ',
              text: err.message || 'ກະລຸນາລອງໃໝ່',
            });
          });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📏 ລາຍການຂະໜາດ</h2>
        <Link
          to="/inventory-size_create"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl"
        >
          ➕ ເພີ່ມໃໝ່
        </Link>
      </div>

      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">ລະຫັດ</th>
              <th className="px-6 py-4 text-left">ປະເພດສິນຄ້າ</th>
              <th className="px-6 py-4 text-left">ຂະໜາດ</th>
              <th className="px-6 py-4 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400 italic">ບໍ່ມີຂໍ້ມູນ</td>
              </tr>
            ) : (
              sizes.map(size => (
                <tr key={size.id_size} className="border-t">
                  <td className="px-6 py-4">{size.id_size_products}</td>
                  <td className="px-6 py-4">{size.type_products}</td>
                  <td className="px-6 py-4">{size.size_products}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex space-x-2">
                      <Link
                        to={`/inventory-size_update/${size.id_size_products}`}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(size.id_size_products)}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
