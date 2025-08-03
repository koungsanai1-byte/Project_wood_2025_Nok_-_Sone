import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function CreateSize() {
  const [names, setNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [form, setForm] = useState({
    size: "",
    note: "",
    id_type: "",
    id_name: ""
  });

  useEffect(() => {
    axios.get("http://localhost:3000/api/list_name")
      .then(res => setNames(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (form.id_name) {
      axios.get("http://localhost:3000/api/list_type")
        .then(res => {
          const filtered = res.data.filter(t => String(t.id_name) === String(form.id_name));
          setTypes(filtered);
        });
    } else {
      setTypes([]);
    }
  }, [form.id_name]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, id_name: value, id_type: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/api/create_size", form)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກສຳເລັດ',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });

        setSavedItems(prev => [...prev, { ...form, id: Date.now() }]);
        setForm({ size: "", note: "", id_type: "", id_name: "" });
        setTypes([]);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ບັນທຶກລົ້ມເຫຼວ',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
      });
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 gap-6 p-4">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">ຟອມບັນທຶກ ຂະໜາດວັດຖຸດິບ</h2>

        <select
          value={form.id_name}
          onChange={handleNameChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- ເລືອກຊື່ --</option>
          {names.map(n => (
            <option key={n.id_name} value={n.id_name}>{n.name}</option>
          ))}
        </select>

        <select
          name="id_type"
          value={form.id_type}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={!types.length}
          required
        >
          <option value="">-- ເລືອກປະເພດ --</option>
          {types.map(t => (
            <option key={t.id_type} value={t.id_type}>{t.type}</option>
          ))}
        </select>

        <input
          type="text"
          name="size"
          value={form.size}
          onChange={handleChange}
          placeholder="ຂະໜາດ (ເຊັ່ນ w 2 x 4 h 1/2)"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="ໝາຍເຫດ"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ບັນທຶກ
          </button>
          <button
            type="button"
            onClick={() => setForm({ size: "", note: "", id_type: "", id_name: "" })}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            ຍົກເລີກ
          </button>
        </div>
      </form>

      {/* Preview & Saved Section */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Preview */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ຂໍ້ມູນທີ່ກຳລັງປ້ອນ</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p><strong>ຊື່:</strong> {names.find(n => n.id_name === parseInt(form.id_name))?.name || '(ບໍ່ໄດ້ເລືອກ)'}</p>
            <p><strong>ປະເພດ:</strong> {types.find(t => t.id_type === parseInt(form.id_type))?.type || '(ບໍ່ໄດ້ເລືອກ)'}</p>
            <p><strong>ຂະໜາດ:</strong> {form.size || '(ບໍ່ມີ)'}</p>
            <p><strong>ໝາຍເຫດ:</strong> {form.note || '(ບໍ່ມີ)'}</p>
          </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ລາຍການທີ່ບັນທຶກແລ້ວ</h2>
          {savedItems.length === 0 ? (
            <p className="text-gray-500 italic">ຍັງບໍ່ມີຂໍ້ມູນທີ່ບັນທຶກ</p>
          ) : (
            <div className="space-y-3">
              {savedItems.map(item => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <p><strong>ຊື່:</strong> {names.find(n => n.id_name === parseInt(item.id_name))?.name || item.id_name}</p>
                  <p><strong>ປະເພດ:</strong> {types.find(t => t.id_type === parseInt(item.id_type))?.type || item.id_type}</p>
                  <p><strong>ຂະໜາດ:</strong> {item.size}</p>
                  <p><strong>ໝາຍເຫດ:</strong> {item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
