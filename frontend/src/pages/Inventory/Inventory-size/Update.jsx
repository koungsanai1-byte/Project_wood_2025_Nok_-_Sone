import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

export default function UpdateSizeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const [idType, setIdType] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลเก่า
  useEffect(() => {
    axios.get(`http://localhost:3000/api/list_size_products/${id}`)
      .then(res => {
        setSize(res.data.size_products);
        setIdType(res.data.id_type_products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading size:", err);
        setLoading(false);
      });
  }, [id]);

  // โหลด type products ทั้งหมด
  useEffect(() => {
    axios.get("http://localhost:3000/api/list_type_products")
      .then(res => setTypes(res.data))
      .catch(err => console.error("Error loading types:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/update_size_products/${id}`, {
      size_products: size,
      id_type_products: idType,
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '✅ ແກ້ໄຂສຳເລັດ',
          toast: true,
          position: 'top',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/inventory-size");
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ອັບເດດບໍ່ສຳເລັດ',
          toast: true,
          position: 'top',
          timer: 2500,
          showConfirmButton: false,
        });
      });
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">ກຳລັງໂຫຼດ...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 shadow-2xl rounded-2xl border border-gray-200">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-blue-700 mb-6">✏️ ຟອມແກ້ໄຂຂະໜາດ</h2>
        <br />
        <select
          id="type"
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow mb-6"
          required
        >
          <label htmlFor="type" className="text-lg text-gray-700">ປະເພດສິນຄ້າ</label>
          <option value="">-- ເລືອກປະເພດ --</option>
          {types.map(t => (
            <option key={t.id_type_products} value={t.id_type_products}>
              {t.type_products}
            </option>
          ))}
        </select>

        <br />
        <label htmlFor="size" className="text-lg text-gray-700">ຂະໜາດ</label>
        <input
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow mb-6"
          required
        />
        <br /><br />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700"
        >
          💾 ບັນທຶກຂໍ້ມູນ
        </button>
      </form>
      <br /><br />
    </div>
  );
}
