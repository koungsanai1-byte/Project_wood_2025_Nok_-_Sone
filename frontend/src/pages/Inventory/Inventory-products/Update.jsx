import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    amount_products: '',
    price_products: '',
    note: '',
    id_type_products: '',
    id_size_products: '',
    id_storages_products: ''
  });

  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load existing product by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, typesRes, sizesRes, storagesRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/list_products/${id}`),
          axios.get('http://localhost:3000/api/list_type_products'),
          axios.get('http://localhost:3000/api/list_size_products'),
          axios.get('http://localhost:3000/api/list_storages_products')
        ]);
        const p = productRes.data;
        setFormData({
          amount_products: p.amount_products || '',
          price_products: p.price_products || '',
          note: p.note || '',
          id_type_products: p.id_type_products?.toString() || '',
          id_size_products: p.id_size_products?.toString() || '',
          id_storages_products: p.id_storages_products?.toString() || ''
        });
        setTypes(typesRes.data);
        setSizes(sizesRes.data);
        setStorages(storagesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ');
      }
    };
    fetchData();
  }, [id]);
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/api/update_products/${id}`, formData);

      Swal.fire({
        icon: 'success',
        title: '✅ ອັບເດດສຳເລັດ',
        toast: true,
        position: 'top',
        timer: 2500,
        showConfirmButton: false,
      });

      navigate('/inventory-products');

    } catch (err) {
      let errorMsg = 'ອັບເດດບໍ່ສຳເລັດ';

      if (err.response) {
        switch (err.response.status) {
          case 400:
            errorMsg = 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ';
            break;
          case 404:
            errorMsg = 'ບໍ່ພົບລາຍການ';
            break;
          case 500:
            errorMsg = 'ບໍລິການມີບັນຫາ ກະລຸນາລອງໃໝ່';
            break;
        }
      }

      Swal.fire({
        icon: 'error',
        title: '❌ ອັບເດດບໍ່ສຳເລັດ',
        text: errorMsg,
        toast: true,
        position: 'top',
        timer: 3500,
        showConfirmButton: false,
      });

      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">ກຳລັງໂຫຼດ...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">✏️ ແກ້ໄຂຂໍ້ມູນສິນຄ້າ</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-lg font-medium text-gray-700">ປະເພດສິນຄ້າ</label>
          <select
            name="id_type_products"
            value={formData.id_type_products}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow"
            disabled
          >
            <option value="">-- ເລືອກປະເພດ --</option>
            {types.map(type => (
              <option key={type.id_type_products} value={type.id_type_products}>
                {type.type_products}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">ຂະໜາດ</label>
          <select
            name="id_size_products"
            value={formData.id_size_products}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow"
            disabled
          >
            <option value="">-- ເລືອກຂະໜາດ --</option>
            {sizes.map(size => (
              <option key={size.id_size_products} value={size.id_size_products}>
                {size.size_products}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">ລ໋ອກຈັດເກັບ</label>
          <select
            name="id_storages_products"
            value={formData.id_storages_products}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow"
            disabled
          >
            <option value="">-- ເລືອກລ໋ອກ --</option>
            {storages.map(store => (
              <option key={store.id_storages_products} value={store.id_storages_products}>
                {store.storages_products}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">ຈຳນວນ</label>
          <input
            type="number"
            name="amount_products"
            value={formData.amount_products}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow"
            disabled
          />
        </div>
        <input
          type="number"
          name="price_products"
          step="0.01"
          value={formData.price_products}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-xl shadow"
          required
        />

        <div>
          <label className="block text-lg font-medium text-gray-700">ໝາຍເຫດ</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-xl shadow"
            rows="3"
            placeholder="ເຊັ່ນ: ສິນຄ້ານຳເຂົ້າ"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow"
        >
          💾 ບັນທຶກການແກ້ໄຂ
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;

