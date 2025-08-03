import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Create = () => {
  const [searchParams] = useSearchParams();
  const selectedIdFromURL = searchParams.get("id");

  const [inspectionList, setInspectionList] = useState([]);
  const [form, setForm] = useState({
    type_inspection: '',
    size: '',
    amount_inspection: 0,
    amount_update: 0,
    note: '',
    status: 'ປັບປຸງແລ້ວ',
    id_inspection: '',
     u_request: ""
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  useEffect(() => {
    if (selectedIdFromURL && inspectionList.length > 0) {
      const selected = inspectionList.find(i => i.id_inspection === parseInt(selectedIdFromURL));
      if (selected) {
        updateFormWithInspection(selected);
      }
    }
  }, [selectedIdFromURL, inspectionList]);

  const fetchInspections = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_inspection');
      const failOnly = res.data.filter(item => item.amount_b > 0);
      setInspectionList(failOnly);
    } catch (err) {
      console.error("ກຳລັງໂຫຼດ", err);
    }
  };

  const updateFormWithInspection = (selected) => {
    setForm(prev => ({
      ...prev,
      id_inspection: selected.id_inspection.toString(),
      type_inspection: selected.type_products,
      size: selected.size_products,
      amount_inspection: selected.amount_b,
      amount_update: 0,
    }));
  };



  const handleSelect = (e) => {
    const selected = inspectionList.find(i => i.id_inspection === parseInt(e.target.value));
    if (selected) {
      updateFormWithInspection(selected);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'amount_update' ? parseInt(value || 0) : value;

    if (name === 'amount_update') {
      if (val > form.amount_inspection) return;
    }

    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/create_improvenment', form);

      Swal.fire({
        icon: 'success',
        title: '✅ ບັນທຶກແລ້ວ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '❌ ບັນທຶກບໍ່ໄດ້',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setForm(prev => ({
        ...prev,
        u_request: parsed.username || "" // ດຶງຕາມຜູ້ login
      }));
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">✏️ ຟອມບັນທຶກ ການປັບປຸງ</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">ເລືອກການກວດສອບ</label>
        <select
          value={form.id_inspection}
          onChange={handleSelect}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 bg-gray-50"
        >
          <option value="">-- ເລືອກລາຍການ --</option>
          {inspectionList.map((i) => (
            <option key={i.id_inspection} value={i.id_inspection}>
              #{i.id_inspection} - {i.type_products} / {i.size_products}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="📦 ປະເພດໄມ້" name="type_inspection" value={form.type_inspection} readOnly />
        <Input label="📏 ຂະໜາດ" name="size" value={form.size} readOnly />
        <Input label="❌ ຈຳນວນບໍ່ຜ່ານ" name="amount_inspection" value={form.amount_inspection} readOnly />
        <Input
          label="🔧 ຈຳນວນທີ່ປັບປຸງ"
          name="amount_update"
          type="number"
          value={form.amount_update}
          onChange={handleChange}
          required
        />
        <Input
          label="🚫 ຈຳນວນທີ່ປັບປຸງບໍ່ໄດ້"
          name="amount_not_fix"
          value={form.amount_inspection - form.amount_update}
          readOnly
        />
        <div className="col-span-1">
          <label className="font-medium">ຜູ້ຮ້ບຜິດຊອບ</label>
          <input
            name="u_request"
            value={form.u_request}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            placeholder="ຊື່ຜູ້ຮັບຜິດຊອບ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">📝 ໝາຍເຫດ</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition-all"
        >
          💾 ບັນທຶກຂໍ້ມູນ
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, name, type = 'text', value, onChange, readOnly = false, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required={required}
      className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white'
        } focus:ring focus:ring-blue-200`}
    />
  </div>
);

export default Create;
