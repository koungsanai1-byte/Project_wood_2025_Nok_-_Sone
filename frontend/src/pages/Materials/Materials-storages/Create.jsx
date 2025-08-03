import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function Create() {
  const [storages, setStorages] = useState([]);
  const [form, setForm] = useState({ name_storages: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = () => {
    axios.get("http://localhost:3000/api/list_storages")
      .then(res => setStorages(res.data))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      axios.put(`http://localhost:3000/api/update_storages/${editingId}`, form)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '✅ ແກ້ໄຂສຳເລັດ',
            toast: true,
            position: 'top-center',
            timer: 2500,
            showConfirmButton: false,
          });
          resetForm();
          fetchStorages();
        })
        .catch(err => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: '❌ ແກ້ໄຂລົ້ມເຫຼວ',
            toast: true,
            position: 'top-center',
            timer: 3000,
            showConfirmButton: false,
          });
        });
    } else {
      axios.post("http://localhost:3000/api/create_storages", form)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '✅ ບັນທຶກສຳເລັດ',
            toast: true,
            position: 'top-center',
            timer: 2500,
            showConfirmButton: false,
          });
          resetForm();
          fetchStorages();
        })
        .catch(err => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: err.response?.status === 400 ? 'ມີຂໍ້ມູນນີ້ແລ້ວ' : '❌ ບັນທຶກລົ້ມເຫຼວ',
            toast: true,
            position: 'top-center',
            timer: 3000,
            showConfirmButton: false,
          });
        });
    }
  };

  const handleEdit = storage => {
    setForm({ name_storages: storage.name_storages });
    setEditingId(storage.id_storages);
  };

  const resetForm = () => {
    setForm({ name_storages: "" });
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "ຟອມແກ້ໄຂ ບ່ອນຈັດເກັບວັດຖຸດິບ" : "ຟອມບັນທຶກ ບ່ອນຈັດເກັບວັດຖຸດິບ"}
        </h2>
        <input
          type="text"
          name="name_storages"
          value={form.name_storages}
          onChange={handleChange}
          placeholder="ຊື່ບ່ອນຈັດເກັບ"
          className="w-full border px-3 py-2 rounded"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "ບັນທຶກການແກ້ໄຂ" : "ບັນທຶກ"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded">
              ຍົກເລີກ
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">📦 ລາຍການບ່ອນຈັດເກັບ</h2>
        {storages.length === 0 ? (
          <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນ</p>
        ) : (
          <ul className="space-y-2">
            {storages.map(storage => (
              <li key={storage.id_storages} className="flex justify-between items-center border p-2 rounded">
                <span>{storage.name_storages}</span>
                <button
                  onClick={() => handleEdit(storage)}
                  className="text-blue-500 hover:underline"
                >
                  ແກ້ໄຂ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
