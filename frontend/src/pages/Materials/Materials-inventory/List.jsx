import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function List() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    axios
      .get("http://localhost:3000/api/list_inventory")
      .then((res) => setInventory(res.data))
      .catch(console.error);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'ຢືນຢັນການລົບ?',
      text: "ຂໍ້ມູນນີ້ຈະຖືກລຶບຖາວອນ!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/api/delete_inventory/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '✅ ລົບສຳເລັດ',
              toast: true,
              position: 'top-center',
              timer: 2000,
              showConfirmButton: false,
            });
            fetchInventory(); // โหลดข้อมูลใหม่
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: '❌ ລົບບໍ່ສຳເລັດ',
              text: 'ການລົບເກີດຂໍ້ຜິດພາດ',
              confirmButtonText: 'ຕົກລົງ'
            });
          });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">ລາຍການ ສາງໄມ້ດິບ</h2>
        <Link
          to="/inventory_create"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
        >
          ➕ ເພີ່ມຂະໜາດ
        </Link>
      </div>

      <div className="overflow-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ລະຫັດ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ຊື່</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ປະເພດ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ຂະໜາດ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ໜ່ວຍວັດ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ຈຳນວນ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ບ່ອນຈັດເກັບ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ຜູ້ຮັບ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ໝາຍເຫດ</th>
              <th className="px-4 py-2 text-left text-xl font-medium text-gray-700">ສະຖານະ</th>
              <th className="px-4 py-2 text-around text-xl font-medium text-gray-700">ຈັດການ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-gray-500">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id_inventory} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.id_inventory}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.type}</td>
                  <td className="px-4 py-2">{item.size}</td>
                  <td className="px-4 py-2">{item.volume}</td>
                  <td className="px-4 py-2">{item.amount}</td>
                  <td className="px-4 py-2">{item.name_storages}</td>
                  <td className="px-4 py-2">{item.u_import}</td>
                  <td className="px-4 py-2">{item.note || "-"}</td>
                  <td className="px-4 py-2 text-center">
                    {item.amount > 0 ? (
                      <Link
                        to="/production-requisition_create"
                        state={{ preSelectedItem: item }}
                        className="inline-block border border-green-600 text-green-700 px-3 py-1 rounded-md hover:bg-green-50 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        title="ເບີກສິນຄ້າ"
                      >
                        ພ້ອມໄຫ້ເບີກ
                      </Link>
                    ) : (
                      <span className="inline-block px-3 py-1 italic text-gray-400 cursor-not-allowed select-none">
                        ບໍ່ພ້ອມ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <Link
                        to={`/inventory_update/${item.id_inventory}`}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={16} />
                      </Link>
                      {/* <button
                        onClick={() => handleDelete(item.id_inventory)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                        title="ລົບ"
                      >
                        <Trash2 size={16} />
                      </button> */}
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
