import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

export default function CreatePurchase() {
  const [names, setNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [volume, setVolume] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [form, setForm] = useState({
    volume: "",
    price: "",
    amount: "",
    total: "",
    note: "",
    id_name: "",
    id_type: "",
    id_size: "",
    u_request: ""
  });


  useEffect(() => {
    axios.get("http://localhost:3000/api/list_volume")
      .then(res => setVolume(res.data))
      .catch(console.error);
  }, []);

  // Load all names
  useEffect(() => {
    axios.get("http://localhost:3000/api/list_name")
      .then(res => setNames(res.data))
      .catch(console.error);
  }, []);

  // Load types by id_name
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
    setForm(prev => ({ ...prev, id_type: "", id_size: "" }));
    setSizes([]);
  }, [form.id_name]);

  // Load sizes by id_type
  useEffect(() => {
    if (form.id_type) {
      axios.get("http://localhost:3000/api/list_size")
        .then(res => {
          const filtered = res.data.filter(s => String(s.id_type) === String(form.id_type));
          setSizes(filtered);
        });
    } else {
      setSizes([]);
    }
    setForm(prev => ({ ...prev, id_size: "" }));
  }, [form.id_type]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const nameObj = names.find(n => n.id_name === parseInt(form.id_name));
    const typeObj = types.find(t => t.id_type === parseInt(form.id_type));
    const sizeObj = sizes.find(s => s.id_size === parseInt(form.id_size));

    axios.post("http://localhost:3000/api/create_purchase", form)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກສຳເລັດ',
          toast: true,
          position: 'top-center',
          timer: 2500,
          showConfirmButton: false
        });

        setSavedItems(prev => [...prev, {
          ...form,
          name: nameObj?.name || form.id_name,
          type: typeObj?.type || form.id_type,
          size: sizeObj?.size || form.id_size,
          id: Date.now()
        }]);

        setForm({
          volume: "", price: "", amount: "", total: "", note: "",
          id_name: "", id_type: "", id_size: ""
        });

        setTypes([]);
        setSizes([]);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ບັນທຶກລົ້ມເຫຼວ',
          toast: true,
          position: 'top-center',
          timer: 3000,
          showConfirmButton: false
        });
      });
  };

  useEffect(() => {
    const price = parseFloat(form.price) || 0;
    const amount = parseFloat(form.amount) || 0;
    const total = price * amount;
    setForm(prev => ({ ...prev, total: total.toString() }));
  }, [form.price, form.amount]);

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
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 gap-6 p-4">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">ຟອມບັນທຶກ ການສັ່ງຊື້ວັດຖຸດິບ</h2>

        <select
          name="id_name"
          value={form.id_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
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
          className="w-full px-4 py-2 border rounded-lg"
          required
          disabled={!types.length}
        >
          <option value="">-- ເລືອກປະເພດ --</option>
          {types.map(t => (
            <option key={t.id_type} value={t.id_type}>{t.type}</option>
          ))}
        </select>

        <select
          name="id_size"
          value={form.id_size}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
          disabled={!sizes.length}
        >
          <option value="">-- ເລືອກຂະໜາດ --</option>
          {sizes.map(s => (
            <option key={s.id_size} value={s.id_size}>{s.size}</option>
          ))}
        </select>
        <select
          name="volume"
          value={form.volume}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">-- ເລືອກໜ່ວຍວັດ --</option>
          {volume.map(items => (
            <option key={items.id_volume} value={items.id_volume}>{items.volume}</option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          placeholder="ລາຄາ"
          value={form.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          name="amount"
          type="number"
          placeholder="ຈຳນວນ"
          value={form.amount}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          name="total"
          type="number"
          placeholder="ລວມ"
          value={form.total}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
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
        <textarea
          name="note"
          placeholder="ໝາຍເຫດ"
          value={form.note}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="grid grid-cols-2 gap-2">
          <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            ບັນທຶກ
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ volume: "", price: "", amount: "", total: "", note: "", id_name: "", id_type: "", id_size: "" });
              setTypes([]); setSizes([]);
            }}
            className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            ຍົກເລີກ
          </button>
        </div>
      </form>

      {/* Preview + Saved Section */}
      <div className="w-full md:w-1/2 space-y-6">
        {/* Preview */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">ຂໍ້ມູນທີ່ກຳລັງປ້ອນ</h3>
          <div className="space-y-2">
            <p><strong>ຊື່:</strong> {names.find(n => n.id_name === parseInt(form.id_name))?.name || "ບໍ່ໄດ້ເລືອກ"}</p>
            <p><strong>ປະເພດ:</strong> {types.find(t => t.id_type === parseInt(form.id_type))?.type || "ບໍ່ໄດ້ເລືອກ"}</p>
            <p><strong>ຂະໜາດ:</strong> {sizes.find(s => s.id_size === parseInt(form.id_size))?.size || "ບໍ່ໄດ້ເລືອກ"}</p>
            <p><strong>ລາຄາ:</strong> {form.volume}</p>
            <p><strong>ລາຄາ:</strong> {form.price}</p>
            <p><strong>ຈຳນວນ:</strong> {form.amount}</p>
            <p><strong>ລວມ:</strong> {form.total}</p>
            <p><strong>ໝາຍເຫດ:</strong> {form.note || "ບໍ່ມີ"}</p>
          </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">ລາຍການທີ່ບັນທຶກແລ້ວ</h3>
          {savedItems.length === 0 ? (
            <p className="text-gray-500 italic">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            savedItems.map(item => (
              <div key={item.id} className="border p-3 rounded bg-gray-50 mb-2">
                <p><strong>ຊື່:</strong> {item.name}</p>
                <p><strong>ປະເພດ:</strong> {item.type}</p>
                <p><strong>ຂະໜາດ:</strong> {item.size}</p>
                <p><strong>ລາຄາ:</strong> {item.volume}</p>
                <p><strong>ລາຄາ:</strong> {item.price}</p>
                <p><strong>ຈຳນວນ:</strong> {item.amount}</p>
                <p><strong>ລວມ:</strong> {item.total}</p>
                <p><strong>ໝາຍເຫດ:</strong> {item.note}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
