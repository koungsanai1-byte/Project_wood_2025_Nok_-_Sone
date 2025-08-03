import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function Update() {
  const [storages, setStorages] = useState([]);
  const [form, setForm] = useState({ name_storages: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = () => {
    axios.get("http://localhost:3000/api/list_storages")
      .then(res => setStorages(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name_storages.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາໃສ່ຊື່ບ່ອນຈັດເກັບ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (editingId) {
      // Update
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
          Swal.fire({
            icon: 'error',
            title: '❌ ' + (err.response?.data?.error || 'ແກ້ໄຂລົ້ມເຫຼວ'),
            toast: true,
            position: 'top-center',
            timer: 3500,
            showConfirmButton: false,
          });
        });
    } else {
      // Create
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
          Swal.fire({
            icon: 'error',
            title: '❌ ' + (err.response?.data?.error || 'ບັນທຶກລົ້ມເຫຼວ'),
            toast: true,
            position: 'top-center',
            timer: 3500,
            showConfirmButton: false,
          });
        });
    }
  };

  const handleEdit = (storage) => {
    setForm({ name_storages: storage.name_storages });
    setEditingId(storage.id_storages);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ທ່ານແນ່ໃຈບໍ່ວ່າຈະລົບ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ຢືນຢັນ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_storages/${id}`);
      Swal.fire({
        icon: 'success',
        title: '🗑️ ລົບສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });
      fetchStorages();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '❌ ລົບລົ້ມເຫຼວ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const resetForm = () => {
    setForm({ name_storages: "" });
    setEditingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">
          {editingId ? "✏️ ແກ້ໄຂບ່ອນຈັດເກັບ" : "➕ ສ້າງບ່ອນຈັດເກັບ"}
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
        <h3 className="font-semibold mb-2">📦 ລາຍການບ່ອນຈັດເກັບ</h3>
        {storages.length === 0 ? (
          <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນ</p>
        ) : (
          <ul className="space-y-2">
            {storages.map((s) => (
              <li key={s.id_storages} className="flex justify-between items-center border p-2 rounded">
                <span>{s.name_storages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600 hover:underline"
                  >
                    ແກ້ໄຂ
                  </button>
                  <button
                    onClick={() => handleDelete(s.id_storages)}
                    className="text-red-600 hover:underline"
                  >
                    ລົບ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
