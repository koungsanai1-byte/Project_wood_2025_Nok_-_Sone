import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Pencil, Trash2 } from "lucide-react"; 
import axios from 'axios';


const List = () => {
  const [type, setType] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = () => {
    axios.get('http://localhost:3000/api/list_type')
      .then(res => setType(res.data))
      .catch(err => console.log("Fetch error:", err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '⚠️ ຢືນຢັນການລຶບ?',
      text: "ຂໍ້ມູນນີ້ຈະຖືກລຶບຖາວອນ!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລຶບ',
      cancelButtonText: 'ຍົກເລີກ'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3000/api/delete_type/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: '✅ ລຶບສຳເລັດ',
              toast: true,
              position: 'top',
              timer: 2500,
              showConfirmButton: false
            });
            fetchTypes();
          })
          .catch(err => {
            console.error("Delete failed:", err);
            Swal.fire({
              icon: 'error',
              title: '❌ ລຶບລົ້ມເຫຼວ',
              toast: true,
              position: 'top',
              timer: 3000,
              showConfirmButton: false
            });
          });
      }
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">ລາຍການ ປະເພດໄມ້</h2>
        <Link
          to="/type_create"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition">
          ➕ ເພີ່ມປະເພດ
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="sm:min-w-[640] min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">ລະຫັດ</th>
              <th className="px-6 py-3">ຊື່</th>
              <th className="px-6 py-3">ປະເພດ</th>
              <th className="px-6 py-3">ໝາຍເຫດ</th>
              <th className="px-6 py-3 text-center">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {type.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              type.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 border-t">
                  <td className="px-6 py-4">{d.id_type}</td>
                  <td className="px-6 py-4">{d.name}</td>
                  <td className="px-6 py-4">{d.type}</td>
                  <td className="px-6 py-4">{d.note}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <Link
                        to={`/type_update/${d.id_type}`}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                        title="ແກ້ໄຂ"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(d.id_type)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
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
};

export default List;
