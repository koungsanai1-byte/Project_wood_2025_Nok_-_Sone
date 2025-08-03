import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

export default function UpdateStoragesProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storageName, setStorageName] = useState("");
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    axios.get(`http://localhost:3000/api/list_storages_products/${id}`)
      .then(res => {
        setStorageName(res.data.storages_products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storageName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາກອກຊື່ສະຖານທີ່ເກັບສິນຄ້າ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/update_storages_products/${id}`, {
        storages_products: storageName.trim(),
      });
      Swal.fire({
        icon: 'success',
        title: '✅ ອັບເດດສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });
      navigate("/inventory-storage");
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        icon: 'error',
        title: '❌ ອັບເດດບໍ່ສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-gray-500 text-lg font-semibold">
        ກຳລັງໂຫຼດຂໍ້ມູນ...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 ">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-3xl shadow-2xl p-8 transition duration-300 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 tracking-wide">📋 ຟອມແກ້ໄຂສະຖານທີ່ເກັບສິນຄ້າ</h2>

        <div className="space-y-4">
          <br />
          <label htmlFor="storageName" className="block text-lg text-gray-700 font-medium">
            ຊື່ສະຖານທີ່ເກັບສິນຄ້າ
          </label>
          <input
            type="text"
            id="storageName"
            value={storageName}
            onChange={(e) => setStorageName(e.target.value)}
            placeholder="ຕົວຢ່າງ: ຫ້ອງເກັບສິນຄ້າ 1"
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-200"
            required
          />
          <br /><br />
          <br />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl shadow hover:bg-blue-700 active:scale-95 transition"
          >
            💾 ແກ້ໄຂ
          </button>
          <br /><br /><br /><br />
        </div>
      </form>
    </div>
  );
}
