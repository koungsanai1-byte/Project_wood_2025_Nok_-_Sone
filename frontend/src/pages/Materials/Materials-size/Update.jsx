import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

export default function UpdateSize() {
  const { id } = useParams(); // รับ id จาก URL
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    size: "",
    note: "",
    id_type: "",
    id_name: ""
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // โหลดชื่อไม้
  useEffect(() => {
    axios.get("http://localhost:3000/api/list_name")
      .then(res => setNames(res.data))
      .catch(err => console.error(err));
  }, []);

  // โหลดข้อมูล size ปัจจุบัน
  useEffect(() => {
    axios.get(`http://localhost:3000/api/listById_size/${id}`)
      .then(res => {
        const data = res.data;
        setForm({
          size: data.size || "",
          note: data.note || "",
          id_type: data.id_type?.toString() || "",
          id_name: data.id_name?.toString() || ""
        });
      })
      .catch(err => {
        console.error(err);
        setError("❌ ไม่สามารถโหลดข้อมูลขนาดไม้ได้");
      });
  }, [id]);

  // โหลดประเภทไม้ตามชื่อไม้ที่เลือก
  useEffect(() => {
    if (form.id_name) {
      axios.get("http://localhost:3000/api/list_type")
        .then(res => {
          const filtered = res.data.filter(t => String(t.id_name) === String(form.id_name));
          setTypes(filtered);

          // ✅ เฉพาะตอนสร้างใหม่ ให้ reset id_type ถ้ามันไม่อยู่ในรายการใหม่
          if (!filtered.find(t => t.id_type.toString() === form.id_type)) {
            setForm(prev => ({ ...prev, id_type: "" }));
          }
        })
        .catch(err => console.error(err));
    } else {
      setTypes([]);
      setForm(prev => ({ ...prev, id_type: "" }));
    }
  }, [form.id_name]);



  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, id_name: value, id_type: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'ກຳລັງອັບເດດ...',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
    });

    axios.put(`http://localhost:3000/api/update_size/${id}`, form)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '✅ ແກ້ໄຂຂະໜາດໄມ້ສຳເລັດ',
          timer: 2000,
          showConfirmButton: false,
          position: 'top-center',
          toast: true,
        });
        setTimeout(() => navigate("/materials-size"), 2000);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: '❌ ແກ້ໄຂຂະໜາດລົ້ມເຫຼວ',
          timer: 3000,
          showConfirmButton: false,
          position: 'top-center',
          toast: true,
        });
      });
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow mt-20">
      <h2 className="text-xl font-semibold mb-4">ແກ້ໄຂ ຂະໜາດໄມ້</h2>

      {message && <p className="mb-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Select Name */}
        <div>
          <select
            value={form.id_name}
            onChange={handleNameChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">ເລືອກຊື່ໄມ້</option>
            {names.map(n => (
              <option key={n.id_name} value={n.id_name}>{n.name}</option>
            ))}
          </select>
        </div>

        {/* Select Type */}
        <div>
          <select
            name="id_type"
            value={form.id_type}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            disabled={!types.length}
          >
            <option value="">ເລືອກປະເພດ</option>
            {types.map(t => (
              <option key={t.id_type} value={t.id_type}>{t.type}</option>
            ))}
          </select>
        </div>

        {/* Input Size */}
        <div>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="ປ້ອນຂະໜາດ"
            required
          />
        </div>

        {/* Textarea Note */}
        <div>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="ໝາຍເຫດ (ຖ້າມີ)"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
