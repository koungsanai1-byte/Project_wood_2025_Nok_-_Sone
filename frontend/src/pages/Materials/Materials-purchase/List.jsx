import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

export default function List() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/list_purchase")
      .then((res) => setPurchases(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: 'ຢືນຢັນການລົບ',
      text: "ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບຂໍ້ມູນນີ້?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true
    });

    if (!confirmed.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_purchase/${id}`);
      setPurchases((prev) => prev.filter((item) => item.id_purchase !== id));
      Swal.fire({
        icon: 'success',
        title: '🗑️ ລົບສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire({
        icon: 'error',
        title: '❌ ການລົບລົ້ມເຫຼວ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const isCompleted = (status) => status === "ຈັດເກັບແລ້ວ";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          📦 ລາຍການການສັ່ງຊື້ໄມ້
        </h2>
        <Link
          to="/purchase_create"
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow flex items-center gap-2"
        >
          ➕ ເພີ່ມການສັ່ງຊື້
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg shadow-lg bg-white border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              {[
                "ລະຫັດ",
                "ຊື່",
                "ປະເພດ",
                "ຂະໜາດ",
                "ໜ່ວຍ",
                "ລາຄາ",
                "ຈຳນວນ",
                "ລວມ",
                "ເວລາ",
                "ໝາຍເຫດ",
                "ຜູ້ຮັບຜິດຊອບ",
                "ສະຖານະ",
                "ຈັດການ",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-3 py-3 text-left whitespace-nowrap font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-6 text-gray-500 italic">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
              </tr>
            ) : (
              purchases.map((item) => (
                <tr
                  key={item.id_purchase}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-2 font-medium text-center text-gray-700">{item.id_purchase}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.type}</td>
                  <td className="px-4 py-2">{item.size}</td>
                  <td className="px-4 py-2">{item.volume}</td>
                  <td className="px-4 py-2 text-right">{item.price}</td>
                  <td className="px-4 py-2 text-right">{item.amount}</td>
                  <td className="px-4 py-2 text-right font-semibold text-blue-800">{item.total}</td>
                  <td className="px-4 py-2">
                    {new Date(item.date_purchase).toLocaleString("lo-LA", {
                      timeZone: "Asia/Bangkok",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-2">{item.note || "-"}</td>
                  <td className="px-4 py-2">{item.user || "-"}</td>
                  {/* Status badge */}
                  <td className="px-4 py-2">
                    {isCompleted(item.status) ? (
                      <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {item.status}
                      </span>
                    ) : (
                      <Link
                        to={`/Inventory_create/${item.id_purchase}`}
                        className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full hover:bg-purple-200"
                      >
                        {item.status || "-"}
                      </Link>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      {isCompleted(item.status) ? (
                        <>
                          <button
                            disabled
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-300 text-white rounded-md cursor-not-allowed"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            disabled
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-300 text-white rounded-md cursor-not-allowed"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/purchase_update/${item.id_purchase}`}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md shadow"
                            title="ແກ້ໄຂ"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id_purchase)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md shadow"
                            title="ລົບ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
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
