import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function DryingCreate() {
  const navigate = useNavigate();
  const location = useLocation();

  const [processList, setProcessList] = useState([]);
  const [selectedProcessId, setSelectedProcessId] = useState("");
  const [form, setForm] = useState({
    type_drying: "",
    size_drying: "",
    amount_drying: "",
    note: "",
    id_process: "",
  });

  // โหลด list process ที่ status = "ພ້ອມອົບ"
  const fetchProcessList = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/list_process");
      setProcessList(res.data);
    } catch (err) {
      console.error("Error fetching process list:", err);
      alert("ເກີດບັນຫາໃນການໂຫລດຂໍ້ມູນ process");
    }
  };

  // เมื่อเลือก process ดึงข้อมูลรายละเอียดจาก backend
  const fetchProcessDetails = async (id) => {
    if (!id) {
      setForm((prev) => ({
        ...prev,
        type_drying: "",
        size_drying: "",
        amount_drying: "",
        id_process: "",
      }));
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/drying/process/${id}`);
      setForm((prev) => ({
        ...prev,
        type_drying: res.data.type_products || "",
        size_drying: res.data.size_products || "",
        amount_drying: res.data.amount_products?.toString() || "",
        id_process: id,
      }));
    } catch (err) {
      console.error("Error fetching process details:", err);
      alert(err.response?.data?.error || "ເກີດບັນຫາໃນການໂຫລດຂໍ້ມູນ process");
      setSelectedProcessId("");
      setForm((prev) => ({
        ...prev,
        type_drying: "",
        size_drying: "",
        amount_drying: "",
        id_process: "",
      }));
    }
  };

  // ฟังก์ชันโหลดข้อมูลจาก state ที่ส่งมา
  const loadProcessDataFromState = (processData) => {
    setSelectedProcessId(processData.id_process.toString());
    setForm({
      type_drying: processData.type_products || "",
      size_drying: processData.size_products || "",
      amount_drying: processData.amount_products?.toString() || "",
      note: "",
      id_process: processData.id_process.toString(),
    });
  };

  useEffect(() => {
    fetchProcessList();

    // ตรวจสอบว่ามีข้อมูลส่งมาจากหน้าอื่นหรือไม่
    if (location.state && location.state.processData) {
      const processData = location.state.processData;
      loadProcessDataFromState(processData);
    }
  }, [location.state]);

  const handleProcessChange = (e) => {
    const id = e.target.value;
    setSelectedProcessId(id);
    fetchProcessDetails(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_process) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກຂໍ້ມູນຂອງການຜະລິດ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const dataToSend = {
        type_drying: form.type_drying,
        size_drying: form.size_drying,
        amount_drying: Number(form.amount_drying),
        note: form.note,
        id_process: Number(form.id_process),
        u_request: form.u_request
      };

      await axios.post("http://localhost:3000/api/drying", dataToSend);

      Swal.fire({
        icon: 'success',
        title: '✅ ບັນທຶກຂໍ້ມູນແດງສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });

      navigate('/production-process');
    } catch (err) {
      console.error("Error creating drying:", err);

      Swal.fire({
        icon: 'error',
        title: '❌ ບັນທຶກຜິດພາດ',
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
    <div className="max-w-2xl mx-auto mt-4 p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        ➕ ຟອມບັນທຶກ ການອົບໄມ້
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            ເລືອກອົບ
          </label>
          <select
            value={selectedProcessId}
            onChange={handleProcessChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-blue-400"
            required
          >
            <option value="">-- ເລືອກ --</option>
            {processList.map((process) => (
              <option key={process.id_process} value={process.id_process}>
                {process.id_process} - {process.type_products} ({process.size_products})
              </option>
            ))}
          </select>
          {location.state && location.state.processData && (
            <p className="text-sm text-blue-600 mt-4">
              ℹ️ ຂໍ້ມູນໂຫລດອັດຕະໂນມັດຈາກການຄລິກສະຖານະ "ພ້ອມອົບ"
            </p>
          )}
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ປະເພດໄມ້</label>
          <input
            type="text"
            name="type_drying"
            value={form.type_drying}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="ປະເພດໄມ້"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ຂະໜາດໄມ້</label>
          <input
            type="text"
            name="size_drying"
            value={form.size_drying}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="ຂະໜາດໄມ້"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ຈຳນວນ</label>
          <input
            type="number"
            name="amount_drying"
            value={form.amount_drying}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="ຈຳນວນ"
          />
        </div>

        <div className="col-span-1">
          <label className="font-medium">ຜູ້ຮັບຜິດຊອບ</label>
          <input
            name="u_request"
            value={form.u_request}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            placeholder="ຊື່ຜູ້ຮັບຜິດຊອບ"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">ໝາຍເຫດ</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="ປ້ອນໝາຍເຫດ"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
        >
          ບັນທຶກ
        </button>
      </form>
    </div>
  );
}