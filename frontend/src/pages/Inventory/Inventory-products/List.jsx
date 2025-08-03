import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const List = () => {
  const [products, setProducts] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3000/api/list_products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ຢືນຢັນການລົບ?',
      text: "ຂໍ້ມູນນີ້ຈະຖືກລຶບຖາວອນ!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ລົບ',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/delete_products/${id}`);
        Swal.fire({
          icon: 'success',
          title: '✅ ລົບຂໍ້ມູນສຳເລັດ',
          toast: true,
          position: 'top-center',
          timer: 2500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: '❌ ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
      }

      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 tracking-wide">📦 ລາຍການສິນຄ້າ</h2>
        <Link
          to="/inventory-products_create"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow"
        >
          ➕ ເພີ່ມສິນຄ້າ
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-blue-100 text-gray-700 text-lg">
            <tr>
              <th className="py-3 px-4 border">ລະຫັດ</th>
              <th className="py-3 px-4 border">ປະເພດ</th>
              <th className="py-3 px-4 border">ຂະໜາດ</th>
              <th className="py-3 px-4 border">ລ໋ອກຈັດເກັບ</th>
              <th className="py-3 px-4 border">ຈຳນວນ</th>
              <th className="py-3 px-4 border">ລາຄາ</th>
              <th className="py-3 px-4 border">ໝາຍເຫດ</th>
              <th className="py-3 px-4 border">ຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-5 text-gray-500 font-medium">ບໍ່ມີຂໍ້ມູນ</td>
              </tr>
            ) : (
              products.map((item) => (
                <tr key={item.id_products} className="hover:bg-gray-100 transition">
                  <td className="py-2 px-4 border">{item.id_products}</td>
                  <td className="py-2 px-4 border">{item.type_products}</td>
                  <td className="py-2 px-4 border">{item.size_products}</td>
                  <td className="py-2 px-4 border">{item.storages_products}</td>
                  <td className="py-2 px-4 border">{item.amount_products}</td>
                  <td className="py-2 px-4 border">{item.price_products}</td>
                  <td className="py-2 px-4 border">{item.note}</td>
                  <td className="py-2 px-4 border space-x-2">
                    <Link
                      to={`/inventory-products_update/${item.id_products}`}
                      className="inline-block bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-1 px-3 rounded"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id_products)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded inline-flex items-center justify-center"
                      title="ລົບ"
                    >
                      <Trash2 size={18} />
                    </button>
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
