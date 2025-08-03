import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function CreateTypeProducts() {
  const [form, setForm] = useState({ type_products: "" });
  const [savedItems, setSavedItems] = useState([]);

  // โหลดข้อมูลทั้งหมด
  useEffect(() => {
    axios.get("http://localhost:3000/api/list_type_products")
      .then(res => setSavedItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ type_products: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const exists = savedItems.some(
      item => item.type_products.trim().toLowerCase() === form.type_products.trim().toLowerCase()
    );

    if (exists) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ປະເພດນີ້ມີແລ້ວ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (!form.type_products.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາກອກຊື່ປະເພດສິນຄ້າ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    axios.post("http://localhost:3000/api/create_type_products", form)
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກສຳເລັດ',
          toast: true,
          position: 'top-center',
          timer: 2500,
          showConfirmButton: false,
        });
        setSavedItems(prev => [...prev, { id_type_products: res.data.id, type_products: form.type_products }]);
        setForm({ type_products: "" });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ບັນທຶກລົ້ມເຫຼວ',
          toast: true,
          position: 'top-center',
          timer: 3000,
          showConfirmButton: false,
        });
      });
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto mt-12 gap-8 px-4">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 bg-white rounded-3xl shadow-2xl p-8 transition duration-300 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6 tracking-wide">📋 ຟອມບັນທຶກ ປະເພດສິນຄ້າ</h2>

        <div className="space-y-4">
          <label htmlFor="type_products" className="block text-lg text-gray-700 font-medium">
            ປະເພດສິນຄ້າ
          </label>
          <input
            type="text"
            id="type_products"
            value={form.type_products}
            onChange={handleChange}
            placeholder="ປະເພດສິນຄ້າ"
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

      {/* Right side: Preview + Saved */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Live Preview */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">👁‍🗨 ຕົວຢ່າງທີ່ພິມ</h3>
          <div className="border rounded-xl p-5 bg-gray-50 text-gray-800 text-lg font-medium min-h-[60px] flex items-center justify-center">
            {form.type_products.trim() ? form.type_products : <span className="text-gray-400 italic">ยังไม่ได้พิมพ์</span>}
          </div>
        </div>

        {/* Saved Items List */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 max-h-[400px] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">📦 ປະເພດສິນຄ້າທີ່ບັນທຶກແລ້ວ</h3>
          {savedItems.length === 0 ? (
            <p className="text-gray-500 italic">ยังไม่มีข้อมูล</p>
          ) : (
            <ul className="space-y-3">
              {savedItems.map((item) => (
                <li
                  key={item.id_type_products}
                  className="bg-gray-50 hover:bg-gray-100 border rounded-xl p-3 shadow-sm transition"
                >
                  {item.type_products}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
