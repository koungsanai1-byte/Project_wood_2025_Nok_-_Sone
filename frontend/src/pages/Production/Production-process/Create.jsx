import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

export default function Create() {
  const [requisitions, setRequisitions] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id_requisition: "",
    name: "",
    type: "",
    size: "",
    storages: "",
    amount: "",
    note: "",
    volume: "",
    type_products: "",
    size_products: "",
    amount_products: 0,
    u_request: ""
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchrequisition();
    fetchProducts();

    // ตรวจสอบว่ามีข้อมูลที่ส่งมาจาก List หรือไม่
    if (location.state?.selectedRequisition) {
      const selectedReq = location.state.selectedRequisition;
      console.log("Selected Requisition:", selectedReq); // Debug log

      setForm({
        id_requisition: selectedReq.id_requisition,
        name: selectedReq.name || "",
        type: selectedReq.type || "",
        size: selectedReq.size || "",
        storages: selectedReq.storages || "",
        amount: selectedReq.amount || "",
        volume: selectedReq.volume || "",
        note: "",
        type_products: "",
        size_products: "",
        amount_products: 0,
      });
    }
  }, [location.state]);

  const fetchrequisition = () => {
    axios
      .get("http://localhost:3000/api/list_requisition")
      .then((res) => setRequisitions(res.data))
      .catch(console.error);
  }

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/api/list_products")
      .then((res) => setProducts(res.data))
      .catch(console.error);
  };

  // เติมฟอร์มเมื่อเลือก requisition (สำหรับการเลือกปกติ)
  useEffect(() => {
    // ถ้ามีข้อมูลส่งมาจาก location state ไม่ต้องทำงานนี้
    if (location.state?.selectedRequisition) return;

    if (!form.id_requisition) {
      setForm((prev) => ({
        ...prev,
        name: "",
        type: "",
        size: "",
        storages: "",
        amount: "",
        volume: "",
      }));
      return;
    }

    const selected = requisitions.find(
      (r) => String(r.id_requisition) === String(form.id_requisition)
    );
    if (selected) {
      setForm((prev) => ({
        ...prev,
        name: selected.name || "",
        type: selected.type || "",
        size: selected.size || "",
        storages: selected.storages || "",
        amount: selected.amount || "",
        volume: selected.volume || "",
      }));
    }
  }, [form.id_requisition, requisitions, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type_products") {
      setForm((prev) => ({
        ...prev,
        [name]: value,
        size_products: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_requisition) {
      return Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກ requisition',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    if (!form.type_products) {
      return Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກປະເພດສິນຄ້າ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    if (!form.size_products) {
      return Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກຂະໜາດສິນຄ້າ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    try {
      await axios.post("http://localhost:3000/api/create_process", form);

      await axios.put(`http://localhost:3000/api/update_requisition_status/${form.id_requisition}`, {
        status: "ສັ່ງຜະລິດແລ້ວ"
      });

      await Swal.fire({
        icon: 'success',
        title: '✅ ສ້າງຂໍ້ມູນແລ້ວ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      setForm({
        id_requisition: "",
        name: "",
        type: "",
        size: "",
        storages: "",
        amount: "",
        note: "",
        volume: "",
        type_products: "",
        size_products: "",
        amount_products: 0,
      });

      fetchrequisition();
      fetchProducts();

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: '❌ ເກີດຂໍ້ຜິດພາດໃນການສ້າງ process',
        toast: true,
        position: 'top-end',
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };

  const uniqueTypes = [...new Set(products.map((p) => p.type_products))];
  const filteredSizes = [
    ...new Set(
      products
        .filter((p) => p.type_products === form.type_products)
        .map((p) => p.size_products)
    ),
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setForm(prev => ({
        ...prev,
        u_request: parsed.username || "" // หรือใช้ชื่อจริง เช่น parsed.name
      }));
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">
        ຟອມບັນທຶກ ການຜະລິດໄມ້
      </h2>

      {/* แสดงข้อความหากมีการส่งข้อมูลมาจาก List */}
      {location.state?.selectedRequisition && (
        <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-blue-600 text-md">
              🔄 ຂໍ້ມູນໄດ້ຖືກເຕີມເຂົ້າໃນຟອມອັດຕະໂນມັດແລ້ວ ID : {location.state.selectedRequisition.id_requisition}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ส่วนเลือก Requisition */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">ຂໍ້ມູນການເບີກໄມ້</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-semibold">ເລກໄມ້ທີ່ເບີກ</label>
              <select
                name="id_requisition"
                value={form.id_requisition}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={location.state?.selectedRequisition}
              >
                <option value="">-- ເລືອກເລກໄມ້ --</option>
                {requisitions
                  .filter((r) => r.amount > 0)
                  .map((r) => (
                    <option key={r.id_requisition} value={r.id_requisition}>
                      {r.id_requisition} -- {r.name} -- {r.type} -- {r.size} -- {r.volume} -- {r.storages} -- {r.amount}
                    </option>
                  ))}
              </select>
              {location.state?.selectedRequisition && (
                <p className="text-sm text-gray-600 mt-1">
                  ຂໍ້ມູນນີ້ຖືກເລືອກມາຈາກລາຍການ (ບໍ່ສາມາດແກ້ໄຂໄດ້)
                </p>
              )}
            </div>

            {/* ข้อมูลไม้ที่เบิก - แสดงใน 3 คอลัมน์ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputReadOnly label="ຊື່ໄມ້" name="name" value={form.name} />
              <InputReadOnly label="ປະເພດໄມ້" name="type" value={form.type} />
              <InputReadOnly label="ຂະໜາດໄມ້" name="size" value={form.size} />
              <InputReadOnly label="ໜ່ວຍວັດ" name="volume" value={form.volume} />
              <InputReadOnly label="ບ່ອນຈັດເກັບ" name="storages" value={form.storages} />
              <InputReadOnly label="ຈຳນວນໄມ້" name="amount" value={form.amount} />
            </div>
          </div>
        </div>

        {/* ส่วนข้อมูลสินค้าที่จะผลิต */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">ຂໍ້ມູນສິນຄ້າທີ່ຜະລິດ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-semibold">ປະເພດສິນຄ້າ</label>
              <select
                name="type_products"
                value={form.type_products}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- ເລືອກປະເພດ --</option>
                {uniqueTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">ຂະໜາດສິນຄ້າ</label>
              <select
                name="size_products"
                value={form.size_products}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!form.type_products}
              >
                <option value="">-- ເລືອກຂະໜາດ --</option>
                {filteredSizes.map((size, i) => (
                  <option key={i} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">ຈຳນວນ</label>
              <input
                type="number"
                name="amount_products"
                value={form.amount_products}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* ส่วนข้อมูลเพิ่มเติม */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">ຂໍ້ມູນເພີ່ມເຕີມ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">ຜູ້ຮັບຜິດຊອບ</label>
              <input
                name="u_request"
                value={form.u_request}
                readOnly
                className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
                placeholder="ຊື່ຜູ້ຮັບຜິດຊອບ"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">ໝາຍເຫດ</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="ໝາຍເຫດເພີ່ມເຕີມ..."
              />
            </div>
          </div>
        </div>

        {/* ปุ่มดำเนินการ */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
            disabled={!form.id_requisition || !form.storages}
          >
            ສັ່ງຜະລິດ
          </button>

          <button
            type="button"
            onClick={() => navigate("/production-requisition_list")}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition font-medium"
          >
            ກັບໄປລາຍການ
          </button>
        </div>
      </form>
    </div>
  );
}

function InputReadOnly({ label, name, value }) {
  return (
    <div>
      <label className="block mb-1 font-semibold text-sm">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        readOnly
        className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
      />
    </div>
  );
}