import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function Create() {
  const [form, setForm] = useState({ volume: "" });
  const [savedItems, setSavedItems] = useState([]);

  // Load all volumes on mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/list_volume")
      .then((res) => setSavedItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ volume: e.target.value });
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.volume.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາປ້ອນ Volume',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const exists = savedItems.some(
      (item) => item.volume.trim().toLowerCase() === form.volume.trim().toLowerCase()
    );
    if (exists) {
      Swal.fire({
        icon: 'error',
        title: '⚠️ Volume ນີ້ມີແລ້ວ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    axios
      .post("http://localhost:3000/api/create_volume", form)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກສຳເລັດ',
          toast: true,
          position: 'top-center',
          timer: 2500,
          showConfirmButton: false,
        });
        setSavedItems((prev) => [...prev, { id_volume: res.data.id, volume: form.volume }]);
        setForm({ volume: "" });
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
      <br /><br />
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
      >
        <br /><br /><br />
        <h2 className="text-3xl font-bold text-blue-700 mb-6 tracking-wide">ບັນທຶກ ໜ່ວຍວັດຂອງວັດຖຸດິບ</h2>

        <div className="space-y-4">
          <label htmlFor="volume" className="block text-lg text-gray-700 font-medium">
            ໜ່ວຍວັດ
          </label>
          <input
            type="text"
            id="volume"
            value={form.volume}
            onChange={handleChange}
            placeholder="กรอก Volume"
            className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl shadow focus:ring-4 focus:ring-blue-400 focus:outline-none transition duration-200"
            required
          />
          <br /><br /><br /><br />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-xl shadow hover:bg-blue-700 active:scale-95 transition"
          >
            💾 ບັນທຶກ
          </button>
        </div>
      </form>

      {/* Right side: Preview + Saved */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Live Preview */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">👁 ຂໍ້ມູນທີ່ປ້ອນ</h3>
          <div className="border rounded-xl p-5 bg-gray-50 text-gray-800 text-lg font-medium min-h-[60px] flex items-center justify-center">
            {form.volume.trim() ? (
              form.volume
            ) : (
              <span className="text-gray-400 italic">ຍັງບໍ່ໄດ້ປ້ອນ</span>
            )}
          </div>
        </div>

        {/* Saved Items List */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 max-h-[400px] overflow-y-auto">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">📦ໜ່ວຍວັດທີ່ປ້ອນ</h3>
          {savedItems.length === 0 ? (
            <p className="text-gray-500 italic">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            <ul className="space-y-3">
              {savedItems.map((item) => (
                <li
                  key={item.id_volume}
                  className="bg-gray-50 hover:bg-gray-100 border rounded-xl p-3 shadow-sm transition"
                >
                  {item.volume}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
