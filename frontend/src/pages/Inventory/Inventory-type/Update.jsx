import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลเดิม
  useEffect(() => {
    axios.get(`http://localhost:3000/api/list_type_products/${id}`)
      .then(res => {
        setTypeName(res.data.type_products);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/api/update_type_products/${id}`, {
        type_products: typeName
      });

      Swal.fire({
        icon: 'success',
        title: '✅ ອັບເດດສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/inventory-type');
      }, 2600); // ให้เวลา alert แสดงก่อนเปลี่ยนหน้า

    } catch (err) {
      console.error('Update failed:', err);
      Swal.fire({
        icon: 'error',
        title: '❌ ອັບເດດບໍ່ສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 3000,
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
    <div className="max-w-2xl mx-auto mt-10 p-8 shadow-2xl rounded-2xl border border-gray-200">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-3xl shadow-2xl p-8 transition duration-300 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 tracking-wide">📋 ຟອມສ້າງປະເພດສິນຄ້າ</h2>

        <div className="space-y-4">
          <label htmlFor="type_products" className="block text-lg text-gray-700 font-medium">
            ຊື່ປະເພດສິນຄ້າ
          </label>
          <input
            type="text"
            id="typeName"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            placeholder="ຕົວຢ່າງ: ເຄື່ອງໃຊ້ສຳນັກງານ"
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-200"
            required
          />
          <br /><br /><br />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl shadow hover:bg-blue-700 active:scale-95 transition"
          >
            💾 ບັນທຶກຂໍ້ມູນ
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
