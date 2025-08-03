import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [volume, setVolume] = useState([]);
  const [form, setForm] = useState({
    price: "",
    amount: "",
    total: "",
    note: "",
    id_name: "",
    id_type: "",
    id_size: "",
    id_volume: ""
  });

  // โหลดข้อมูลทั้งหมดตอนเริ่มต้น
  useEffect(() => {
    axios.get(`http://localhost:3000/api/listById_purchase/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          price: data.price,
          amount: data.amount,
          total: data.total,
          note: data.note || "",
          id_name: data.id_name,
          id_type: data.id_type,
          id_size: data.id_size,
          id_volume: data.id_volume
        });
      });
  }, [id]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/list_name")
      .then(res => setNames(res.data));
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
  }, [form.id_type]); useEffect(() => {
    axios.get("http://localhost:3000/api/list_volume")
      .then(res => setVolume(res.data));
  }, []);


  // คำนวณ total อัตโนมัติ
  useEffect(() => {
    const price = parseFloat(form.price) || 0;
    const amount = parseFloat(form.amount) || 0;
    const total = price * amount;
    setForm(prev => ({ ...prev, total: total.toString() }));
  }, [form.price, form.amount]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    axios.put(`http://localhost:3000/api/update_purchase/${id}`, form)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '✅ ແກ້ໄຂສຳເລັດ',
          toast: true,
          position: 'top-center',
          timer: 2500,
          showConfirmButton: false
        });
        navigate("/materials-purchase");
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ແກ້ໄຂລົ້ມເຫຼວ',
          toast: true,
          position: 'top-center',
          timer: 3000,
          showConfirmButton: false
        });
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6">ແກ້ໄຂການສັ່ງຊື້</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="id_name" value={form.id_name} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">-- ເລືອກຊື່ --</option>
          {names.map(n => (
            <option key={n.id_name} value={n.id_name}>{n.name}</option>
          ))}
        </select>

        <select name="id_type" value={form.id_type} onChange={handleChange} required disabled={!types.length} className="w-full border p-2 rounded">
          <option value="">-- ເລືອກປະເພດ --</option>
          {types.map(t => (
            <option key={t.id_type} value={t.id_type}>{t.type}</option>
          ))}
        </select>

        <select name="id_size" value={form.id_size} onChange={handleChange} required disabled={!sizes.length} className="w-full border p-2 rounded">
          <option value="">-- ເລືອກຂະໜາດ --</option>
          {sizes.map(s => (
            <option key={s.id_size} value={s.id_size}>{s.size}</option>
          ))}
        </select>
        <select name="id_volume" value={form.id_volume} onChange={handleChange} required  className="w-full border p-2 rounded">
          <option value="">-- ເລືອກຂະໜາດ --</option>
          {volume.map(v => (
            <option key={v.id_volume} value={v.id_volume}>{v.volume}</option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="ລາຄາ"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="ຈຳນວນ"
          value={form.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="total"
          placeholder="ລວມ"
          value={form.total}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
        />

        <textarea
          name="note"
          placeholder="ໝາຍເຫດ"
          value={form.note}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ແກ້ໄຂ
          </button>
          <button type="button" onClick={() => navigate("/materials-purchase")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ຍ້ອນກັບ
          </button>
        </div>
      </form>
    </div>
  );
}
