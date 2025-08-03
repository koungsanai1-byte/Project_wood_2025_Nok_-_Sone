import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

export default function ProductForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const processData = location.state?.processData;

  const [form, setForm] = useState({
    type_products: "",
    size_products: "",
    amount_products: "",
  });

  useEffect(() => {
    if (processData) {
      setForm({
        type_products: processData.type_products || "",
        size_products: processData.size_products || "",
        amount_products: processData.amount_products?.toString() || "",
      });
    }
  }, [processData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { type_products, size_products, amount_products } = form;

    if (!type_products.trim() || !size_products.trim() || amount_products.trim() === "") {
      return Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາກອກຂໍ້ມູນໃຫ້ຄົບ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    if (!processData || !processData.id_process) {
      return Swal.fire({
        icon: 'error',
        title: '❌ ບໍ່ພົບຂໍ້ມູນເພື່ອແກ້ໄຂ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    try {
      const dataToSend = {
        amount_products: Number(amount_products),
      };

      await axios.put(
        `http://localhost:3000/api/update_amount/${processData.id_process}/update_amount_and_status`,
        dataToSend
      );

      await Swal.fire({
        icon: 'success',
        title: '✅ ແກ້ໄຂສຳເລັດ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      navigate("/production-process");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: '❌ ແກ້ໄຂຜິດພາດ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">ຟອມບັນທຶກ ຈຳນວນຜະລິດຕົວຈິງ</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ປະເພດໄມ້</label>
          <input
            type="text"
            name="type_products"
            value={form.type_products}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ຂະໜາດໄມ້</label>
          <input
            type="text"
            name="size_products"
            value={form.size_products}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ຈຳນວນໄມ້</label>
          <input
            type="number"
            name="amount_products"
            value={form.amount_products}
            onChange={handleChange}
            placeholder="ປ້ອນຈຳນວນ"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700"
        >
          ບັນທຶກຈຳນວນໄມ້ຕົວຈິງ
        </button>
      </form>
    </div>
  );
}
