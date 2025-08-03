import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Toaster } from 'react-hot-toast';

const Create = () => {
  const [form, setForm] = useState({
    amount_products: 0,
    price_products: '',
    note: '',
    id_type_products: '',
    id_size_products: '',
    id_storages_products: ''
  });

  const [typeOptions, setTypeOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [storageOptions, setStorageOptions] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/list_type_products').then(res => setTypeOptions(res.data));
    axios.get('http://localhost:3000/api/list_size_products').then(res => setSizeOptions(res.data));
    axios.get('http://localhost:3000/api/list_storages_products').then(res => setStorageOptions(res.data));
    fetchProducts();
  }, []);

  useEffect(() => {
    if (form.id_type_products) {
      const filtered = sizeOptions.filter(
        size => size.id_type_products === Number(form.id_type_products)
      );
      setFilteredSizes(filtered);
    } else {
      setFilteredSizes([]);
    }
    setForm(prev => ({ ...prev, id_size_products: '' }));
  }, [form.id_type_products, sizeOptions]);

  const fetchProducts = () => {
    axios.get('http://localhost:3000/api/list_products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.id_type_products || !form.id_size_products || !form.id_storages_products) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກປະເພດ, ຂະໜາດ ແລະ ລ໋ອກເກັບ',
        position: 'top',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
      });
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/create_products', form);
      setForm({
        amount_products: 0,
        price_products: '',
        note: '',
        id_type_products: '',
        id_size_products: '',
        id_storages_products: ''
      });
      fetchProducts();

      Swal.fire({
        icon: 'success',
        title: '✅ ເພີ່ມສິນຄ້າແລ້ວ',
        position: 'top',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
      });

    } catch (err) {
      let errorMsg = 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ';

      if (err.response) {
        switch (err.response.status) {
          case 409:
            errorMsg = err.response.data.message || 'ສິນຄ້ານີ້ມີຢູ່ແລ້ວ';
            break;
          case 400:
            errorMsg = 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ';
            break;
          // เพิ่มกรณีอื่น ๆ ได้ตามต้องการ
          default:
            errorMsg = 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຫວັງ';
        }
      }

      Swal.fire({
        icon: 'error',
        title: '❌ ບັນທຶກບໍ່ໄດ້',
        text: errorMsg,
        position: 'top',
        timer: 3500,
        showConfirmButton: false,
        toast: true,
      });

      console.error(err);
    }
  };

  const inputStyle = "w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500";

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-lg">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">➕ ຟອມບັນທຶກ ສິນຄ້າ</h2>

          <div>
            <label className="block font-medium">ປະເພດ</label>
            <select
              name="id_type_products"
              value={form.id_type_products}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="">-- ເລືອກປະເພດ --</option>
              {typeOptions.map(item => (
                <option key={item.id_type_products} value={item.id_type_products}>
                  {item.type_products}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">ຂະໜາດ</label>
            <select
              name="id_size_products"
              value={form.id_size_products}
              onChange={handleChange}
              className={inputStyle}
              required
              disabled={!form.id_type_products || filteredSizes.length === 0}
            >
              <option value="">-- ເລືອກຂະໜາດ --</option>
              {filteredSizes.map(item => (
                <option key={item.id_size_products} value={item.id_size_products}>
                  {item.size_products}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">ລ໋ອກຈັດເກັບ</label>
            <select
              name="id_storages_products"
              value={form.id_storages_products}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="">-- ເລືອກລ໋ອກ --</option>
              {storageOptions.map(item => (
                <option key={item.id_storages_products} value={item.id_storages_products}>
                  {item.storages_products}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">ຈຳນວນ</label>
            <input
              type="number"
              name="amount_products"
              value={form.amount_products}
              readOnly
              disabled
              className={inputStyle + ' bg-gray-100 cursor-not-allowed'}
            />
          </div>

          <div>
            <label className="block font-medium">ລາຄາ</label>
            <input
              type="number"
              name="price_products"
              min="0"
              value={form.price_products}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block font-medium">ໝາຍເຫດ</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className={inputStyle}
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
          >
            💾 ບັນທຶກ
          </button>
        </form>

        {/* List */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 overflow-y-auto h-[600px]">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">📃 ລາຍການທີ່ບັນທຶກແລ້ວ</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            <ul className="space-y-2">
              {products.map(item => (
                <li key={item.id_products} className="bg-white border p-3 rounded shadow">
                  <div className="font-medium">{item.type_products} {item.size_products}</div>
                  <div className="text-sm text-gray-600">ລ໋ອກ: {item.storages_products} | ຈຳນວນ: {item.amount_products} | ລາຄາ: {item.price_products}</div>
                  <div className="text-xs text-gray-400 italic">{item.note}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Create;
