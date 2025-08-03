import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function Create() {
  const [form, setForm] = useState({ size_products: "", id_type_products: "" });
  const [savedItems, setSavedItems] = useState([]);
  const [types, setTypes] = useState([]);

  // โหลด size และ type ตอน mount
  useEffect(() => {
    fetchSizes();
    fetchTypes();
  }, []);

  const fetchSizes = () => {
    axios.get("http://localhost:3000/api/list_size_products")
      .then(res => setSavedItems(res.data))
      .catch(err => console.error(err));
  };

  const fetchTypes = () => {
    axios.get("http://localhost:3000/api/list_type_products") // สมมุติ API get type
      .then(res => setTypes(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.size_products.trim() || !form.id_type_products) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາກອກຂໍ້ມູນຂະໜາດ ແລະ ເລືອກປະເພດ',
        toast: true,
        position: 'top',
        timer: 2500,
        showConfirmButton: false,
      });
      return;
    }

    axios.post("http://localhost:3000/api/create_size_products", form)
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກສຳເລັດ',
          toast: true,
          position: 'top',
          timer: 2000,
          showConfirmButton: false,
        });
        setSavedItems(prev => [...prev, { id_size_products: res.data.id, ...form }]);
        setForm({ size_products: "", id_type_products: "" });
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ບັນທຶກລົ້ມເຫຼວ',
          toast: true,
          position: 'top',
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
        className="w-full md:w-1/2 bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-blue-700 mb-6">📏 ຟອມບັນທຶກ ຂະໜາດສິນຄ້າ</h2>
        <div className="space-y-4">
          <label htmlFor="id_type_products" className="text-lg text-gray-700 font-medium">ເລືອກປະເພດ</label>
          <select
            id="id_type_products"
            name="id_type_products"
            value={form.id_type_products}
            onChange={handleChange}
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow focus:ring-4 focus:ring-blue-400 focus:outline-none"
            required
          >
            <option value="">-- ເລືອກປະເພດ --</option>
            {types.map(t => (
              <option key={t.id_type_products} value={t.id_type_products}>{t.type_products}</option>
            ))}
          </select>

          <br /><br />
          <label htmlFor="size_products" className="text-lg text-gray-700 font-medium">ຂະໜາດ</label>
          <input
            id="size_products"
            name="size_products"
            value={form.size_products}
            onChange={handleChange}
            placeholder="ຕົວຢ່າງ: M, L, XL"
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow focus:ring-4 focus:ring-blue-400 focus:outline-none "
            required
          />
          <br /><br /><br /><br />


          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl hover:bg-blue-700"
          >
            💾 ບັນທຶກຂໍ້ມູນ
          </button>
          <br /><br /><br /><br />
        </div>
      </form>

      {/* Right: Preview + Saved */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Preview */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">👁‍🗨 ຕົວຢ່າງທີ່ພິມ</h3>
          <div className="p-5 bg-gray-50 text-lg text-gray-800 font-medium rounded-xl">
            {form.size_products.trim() ? form.size_products : <span className="text-gray-400 italic">ຍັງບໍ່ໄດ້ພິມ</span>}
            {form.id_type_products && (
              <div className="mt-2 text-sm text-gray-600">
                ประเภท: {types.find(t => t.id_type_products === form.id_type_products)?.type_products}
              </div>
            )}
          </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 max-h-[400px] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">📦 ຂະໜາດທີ່ບັນທຶກແລ້ວ</h3>
          {savedItems.length === 0 ? (
            <p className="text-gray-500 italic">ยังไม่มีข้อมูล</p>
          ) : (
            <ul className="space-y-3">
              {savedItems.map((item) => (
                <li key={item.id_size_products} className="p-3 bg-gray-50 border rounded-xl shadow-sm">
                  {item.size_products}{" "}
                  <span className="text-gray-500 italic">
                    ({types.find(t => t.id_type_products === item.id_type_products)?.type_products || "ไม่มีประเภท"})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
