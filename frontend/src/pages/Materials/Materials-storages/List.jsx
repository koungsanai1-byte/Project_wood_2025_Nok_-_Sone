import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function ListStorage() {
  const [storages, setStorages] = useState([]);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = () => {
    axios.get("http://localhost:3000/api/list_storages")
      .then(res => setStorages(res.data))
      .catch(err => console.error("Error fetching storage list:", err));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບບ່ອນນີ້?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_storages/${id}`);

      Swal.fire({
        icon: 'success',
        title: '✅ ລົບສຳເລັດ',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-center',
        toast: true,
      });

      fetchStorages();
    } catch (error) {
      console.error("Delete failed:", error);

      Swal.fire({
        icon: 'error',
        title: '❌ ການລົບລົ້ມເຫຼວ',
        timer: 3000,
        showConfirmButton: false,
        position: 'top-center',
        toast: true,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          <h1 className="text-2xl font-bold mb-4 text-center">📦 ລາຍການ ບ່ອນຈັດເກັບ</h1>
        </h2>
        <Link
          to="/storages_create"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition flex items-center gap-2"
        >
          <span>➕</span>
          <span>ເພີ່ມການສັ່ງຊື້</span>
        </Link>
      </div>

      {storages.length === 0 ? (
        <p className="text-gray-500 text-center">ບໍ່ມີຂໍ້ມູນ</p>
      ) : (
        <ul className="space-y-2">
          {storages.map((d) => (
            <li
              key={d.id_storages}
              className="flex items-center justify-between border p-3 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <span className="font-medium">{d.id_storages}</span>
              <span className="font-medium">{d.name_storages}</span>
              <div className="flex gap-2">
                <Link
                  to={`/storages_update/${d.id_storages}`}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                  title="ແກ້ໄຂ"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(d.id_storages)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                  title="ລົບ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
