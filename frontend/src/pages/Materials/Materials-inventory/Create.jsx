import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function CreateInventory() {
  const { id } = useParams(); // รับ id_purchase จาก URL parameter

  const [purchases, setPurchases] = useState([]);
  const [storages, setStorages] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  const [form, setForm] = useState({
    id_purchase: "",
    id_storages: "",
    u_request: "",
    note: "",
    amount: "",
    name: "",
    type: "",
    size: "",
    volume: ""
  });

  // Load purchases
  useEffect(() => {
    fetchpurchase_z();
  }, []);

  const fetchpurchase_z = () => {
    axios.get("http://localhost:3000/api/list_purchase_z")
      .then(res => {
        setPurchases(res.data);
      })
      .catch(console.error);
  }

  // Load storages
  useEffect(() => {
    axios.get("http://localhost:3000/api/list_storages")
      .then(res => setStorages(res.data))
      .catch(console.error);
  }, []);

  // Auto-select purchase when coming from URL parameter
  useEffect(() => {
    if (id && purchases.length > 0) {
      const selectedPurchase = purchases.find(p => String(p.id_purchase) === String(id));
      if (selectedPurchase) {
        setForm(prev => ({
          ...prev,
          id_purchase: selectedPurchase.id_purchase.toString(),
          name: selectedPurchase.name || "",
          type: selectedPurchase.type || "",
          size: selectedPurchase.size || "",
          amount: selectedPurchase.amount || "",
          volume: selectedPurchase.volume || "",
          note: "",
          id_storages: ""
        }));
      }
    }
  }, [id, purchases]);

  // Update name/type/size/amount when id_purchase changes
  useEffect(() => {
    const selected = purchases.find(p => String(p.id_purchase) === String(form.id_purchase));
    if (selected) {
      setForm(prev => ({
        ...prev,
        name: selected.name || "",
        type: selected.type || "",
        size: selected.size || "",
        amount: selected.amount || "",
        volume: selected.volume || "",

      }));
    } else if (!id) { 
      setForm(prev => ({
        ...prev,
        name: "",
        type: "",
        size: "",
        amount: "",
        note: "",
        id_storages: "",
        volume: ""
      }));
    }
  }, [form.id_purchase, purchases, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_purchase || !form.id_storages) {
      alert("❌ ກະລຸນາເລືອກໄມ້ແລະບ່ອນຈັດເກັບ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/create_inventory", form)
        .then(res => {
          fetchpurchase_z();
        });
      alert("✅ ບັນທຶກສຳເລັດ");

      setSavedItems(prev => [...prev, { ...form, tempId: Date.now() }]);
      // reset form except purchases list
      setForm({
        id_purchase: "",
        id_storages: "",
        u_request: "",
        note: "",
        amount: "",
        name: "",
        type: "",
        size: "",
        volume: ""
      });
    } catch {
      alert("❌ ບໍ່ສາມາດສົ່ງຂໍ້ມູນໄດ້");
    }
  };

  const handleCancel = () => {
    setForm({
      id_purchase: "",
      id_storages: "",
      note: "",
      amount: "",
      name: "",
      type: "",
      size: "",
      volume: ""
    });
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
    <div className="max-w-7xl mx-auto mt-10 p-6 grid md:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <div className="text-2xl font-blod ">ຟອມບັນທືກ ສາງວັດຖຸດິບ</div>
        <div>
          <label className="block mb-1 ">ໝາຍເລກໄມ້</label>
          <select
            name="id_purchase"
            value={form.id_purchase}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">-- ເລືອກລະຫັດ --</option>
            {purchases.map(p => (
              <option key={p.id_purchase} value={p.id_purchase}>
                ໄມ້ໝາຍເລກ {p.id_purchase}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">ຊື່</label>
            <input
              name="name"
              value={form.name}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="font-medium">ປະເພດ</label>
            <input
              name="type"
              value={form.type}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="font-medium">ຂະໜາດ</label>
            <input
              name="size"
              value={form.size}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="font-medium">ຈຳນວນ</label>
            <input
              name="amount"
              value={form.amount}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">ໜ່ວຍວັດ</label>
            <input
              name="volume"
              value={form.volume}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">ບ່ອນຈັດເກັບ</label>
            <select
              name="id_storages"
              value={form.id_storages}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">-- ເລືອກບ່ອນຈັດເກັບ --</option>
              {storages.map(s => (
                <option key={s.id_storages} value={s.id_storages}>
                  {s.name_storages}
                </option>
              ))}
            </select>
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
        </div>

        <div>
          <label className="font-medium">ໝາຍເຫດ</label>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg h-24"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={!form.id_purchase || !form.id_storages}
            className={`w-28 text-white py-2 rounded-lg transition ${form.id_purchase && form.id_storages
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            ບັນທຶກ
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-28 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            ຍົກເລີກ
          </button>
        </div>
      </form>

      {/* Preview + saved list */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4">🔍 Preview</h2>
          <div className="space-y-1">
            <p><strong>ໝາຍເລກໄມ້:</strong> {form.id_purchase}</p>
            <p><strong>ຊື່:</strong> {form.name}</p>
            <p><strong>ປະເພດ:</strong> {form.type}</p>
            <p><strong>ຂະໜາດ:</strong> {form.size}</p>
            <p><strong>ໜ່ວຍວັດ:</strong> {form.volume}</p>
            <p><strong>ຈຳນວນ:</strong> {form.amount}</p>
            <p><strong>ບ່ອນຈັດເກັບ:</strong> {storages.find(s => s.id_storages === parseInt(form.id_storages))?.name_storages || "ບໍ່ໄດ້ເລືອກ"}</p>
            <p><strong>ຜູ້ນຳເຂົ້າ:</strong> {form.u_request || "ບໍ່ມີ"}</p>
            <p><strong>ໝາຍເຫດ:</strong> {form.note || "ບໍ່ມີ"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl max-h-[400px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">📦 ລາຍການທີ່ບັນທຶກແລ້ວ</h2>
          {savedItems.length === 0 ? (
            <p className="text-gray-500">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            savedItems.map(item => (
              <div key={item.tempId} className="border p-4 rounded-lg bg-gray-50 mb-2 shadow-sm space-y-1">
                <p><strong>ໝາຍເລກໄມ້:</strong> {item.id_purchase}</p>
                <p><strong>ຊື່:</strong> {item.name}</p>
                <p><strong>ປະເພດ:</strong> {item.type}</p>
                <p><strong>ຂະໜາດ:</strong> {item.size}</p>
                <p><strong>ໜ່ວຍວັດ:</strong> {item.volume}</p>
                <p><strong>ຈຳນວນ:</strong> {item.amount}</p>
                <p><strong>ບ່ອນຈັດເກັບ:</strong> {storages.find(s => s.id_storages === parseInt(item.id_storages))?.name_storages || item.id_storages}</p>
                <p><strong>ຜູ້ນຳເຂົ້າ:</strong> {item.u_request}</p>
                <p><strong>ໝາຍເຫດ:</strong> {item.note}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}