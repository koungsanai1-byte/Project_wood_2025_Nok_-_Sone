import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function UpdateType() {
  const { id } = useParams(); // รับ id ของ type จาก URL
  const navigate = useNavigate();

  const [type, setType] = useState('');
  const [note, setNote] = useState('');
  const [nameId, setNameId] = useState('');
  const [names, setNames] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // โหลดข้อมูล type และ name ทั้งหมด
  useEffect(() => {
    // โหลดข้อมูล type ตาม id
    axios.get(`http://localhost:3000/api/listById_type/${id}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setType(data.type || '');
        setNote(data.note || '');
        setNameId(data.id_name?.toString() || '');
      })
      .catch(err => {
        console.error(err);
        setError('❌ ไม่สามารถโหลดข้อมูลประเภทได้');
      });

    // โหลดรายการ name ทั้งหมด
    axios.get('http://localhost:3000/api/list_name')
      .then(res => setNames(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/api/update_type/${id}`, {
        type,
        note,
        id_name: nameId,
      });

      Swal.fire({
        icon: 'success',
        title: '✅ ແກ້ໄຂປະເພດສຳເລັດ',
        position: 'top-center',
        toast: true,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate('/materials-type'), 1000);

    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: '❌ ແກ້ໄຂລົ້ມເຫຼວ',
        text: 'ກວດສອບຂໍ້ມູນ ຫຼື ລອງໃໝ່ພາຍຫຼັງ',
        position: 'top-center',
        toast: true,
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow mt-20">
      <h2 className="text-xl font-semibold mb-4">ແກ້ໄຂ ປະເພດໄມ້</h2>

      {message && <p className="mb-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mb-4 text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Select Name */}
        <div>
          <select
            className="w-full p-2 border rounded"
            value={nameId}
            onChange={(e) => setNameId(e.target.value)}
            required
          >
            <option value="">ເລືອກຊື່ໄມ້</option>
            {names.map(name => (
              <option key={name.id_name} value={name.id_name}>
                {name.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Type */}
        <div>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="ປ້ອນຊື່ປະເພດ"
            required
          />
        </div>

        {/* Textarea Note */}
        <div>
          <textarea
            className="w-full p-2 border rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ໝາຍເຫດ (ຖ້າມີ)"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          ແກ້ໄຂ
        </button>
      </form>
    </div>
  );
}
