import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

const initialFormState = {
  id_inventory: "",
  u_request: "",
  amount: "",
  note: "",
  name: "",
  type: "",
  size: "",
  available_amount: 0,
  name_storages: "",
  volume: ""
};

export default function CreateRequisition() {
  const [inventories, setInventories] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.preSelectedItem) {
      const preSelected = location.state.preSelectedItem;
      setForm(prev => ({
        ...prev,
        id_inventory: preSelected.id_inventory.toString(),
        id_category: preSelected.id_category?.toString() || "",
        id_location: preSelected.id_location?.toString() || "",
        id_agency: preSelected.id_agency?.toString() || "",
        name: preSelected.name || "",
      }));
    }
  }, [location.state]);

  // Load inventories on mount
  useEffect(() => {
    reload();
  }, []);

  // Handle pre-selected item from List component
  useEffect(() => {
    if (location.state?.preSelectedItem) {
      const preSelected = location.state.preSelectedItem;
      setForm(prev => ({
        ...prev,
        id_inventory: preSelected.id_inventory.toString(),
        name: preSelected.name || "",
        type: preSelected.type || "",
        size: preSelected.size || "",
        volume: preSelected.volume || "",
        available_amount: preSelected.amount || 0,
        name_storages: preSelected.name_storages || "",
        amount: "",
        note: "",
        u_request: "",
      }));
    }
  }, [location.state]);

  const reload = () => {
    axios.get("http://localhost:3000/api/inventory_amount")
      .then(res => setInventories(res.data))
      .catch(console.error);
  }

  // When id_inventory changes, update form with selected inventory details
  useEffect(() => {
    // Skip if form is being pre-populated from navigation state
    if (location.state?.preSelectedItem && form.id_inventory === location.state.preSelectedItem.id_inventory.toString()) {
      return;
    }

    const selected = inventories.find(i => String(i.id_inventory) === String(form.id_inventory));
    if (selected) {
      setForm(prev => ({
        ...prev,
        name: selected.name || "",
        type: selected.type || "",
        size: selected.size || "",
        volume: selected.volume || "",
        available_amount: selected.amount || 0,
        name_storages: selected.name_storages || "",
        amount: "",
        note: "",
        u_request: prev.u_request, // Keep existing u_request
      }));
    } else if (!location.state?.preSelectedItem) {
      setForm(prev => ({
        ...initialFormState,
        u_request: prev.u_request // Keep existing u_request
      }));
    }
  }, [form.id_inventory, inventories, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // Accept empty or integer between 1 and available_amount
      if (value === "") {
        setForm(prev => ({ ...prev, amount: "" }));
        return;
      }
      const numValue = Number(value);
      if (
        Number.isInteger(numValue) &&
        numValue >= 1 &&
        numValue <= form.available_amount
      ) {
        setForm(prev => ({ ...prev, amount: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.id_inventory || !form.u_request.trim() || !form.amount) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາກອກຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (Number(form.amount) > form.available_amount) {
      Swal.fire({
        icon: 'error',
        title: '❌ ຈຳນວນທີ່ຂໍເກີນຈຳນວນຄົງເຫຼືອ',
        toast: true,
        position: 'top-center',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        id_inventory: form.id_inventory,
        u_request: form.u_request.trim(),
        amount: Number(form.amount),
        note: form.note.trim() || "",
        name: form.name,
        type: form.type,
        size: form.size,
        name_storages: form.name_storages,
        volume: form.volume
      };

      await axios.post("http://localhost:3000/api/create_requisition", payload);

      Swal.fire({
        icon: 'success',
        title: '✅ ບັນທຶກຄຳຂໍເບີກສຳເລັດ',
        toast: true,
        position: 'top-center',
        timer: 2500,
        showConfirmButton: false,
      });

      setSavedItems(prev => [...prev, { ...payload, tempId: Date.now() }]);

      // Reset form but keep u_request for convenience
      const currentUser = form.u_request;
      setForm({
        ...initialFormState,
        u_request: currentUser
      });

      // Reload inventories to get updated amounts
      reload();

      // Clear navigation state if any
      if (location.state) {
        window.history.replaceState({}, document.title);
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "ບໍ່ສາມາດບັນທຶກຄຳຂໍເບີກໄດ້ ກະລຸນາລອງໃໝ່";
      Swal.fire({
        icon: 'error',
        title: `❌ ${msg}`,
        toast: true,
        position: 'top-center',
        timer: 3500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    // Clear navigation state
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  };

  const isSubmitDisabled =
    !form.id_inventory ||
    !form.u_request.trim() ||
    !form.amount ||
    Number(form.amount) <= 0 ||
    Number(form.amount) > form.available_amount ||
    loading;

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
    <div className="max-w-7xl mx-auto mt-10 p-6 grid md:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
        <div>
          <label className="block mb-1 font-bold text-xl">ຟອມບັນທຶກ ການເບີກວັດຖຸດິບ</label>
          <select
            name="id_inventory"
            value={form.id_inventory}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            disabled={loading}
          >
            <option value="">-- ເລືອກ --</option>
            {inventories.map(inv => (
              <option key={inv.id_inventory} value={inv.id_inventory}>
                {inv.name} - {inv.type} - {inv.size} - ຄົງເຫຼືອ {inv.amount}
              </option>
            ))}
          </select>
          {location.state?.preSelectedItem && (
            <p className="text-sm text-blue-600 mt-1">
              ✓ ເລືອກໂດຍອັດຕະໂນມັດຈາກລາຍການ
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">ໄມ້</label>
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
            <label className="font-medium">ບ່ອນຈັດເກັບ</label>
            <input
              name="name_storages"
              value={form.name_storages}
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
            <label className="font-medium">ຈຳນວນຄົງເຫຼືອ</label>
            <input
              name="available_amount"
              value={form.available_amount}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>

          <div className="col-span-1">
            <label className="font-medium">ຜູ້ຂໍເບີກ</label>
            <input
              name="u_request"
              value={form.u_request}
              readOnly
              className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
              placeholder="ຊື່ຜູ້ຮັບຜິດຊອບ"
            />
          </div>
          <div className="col-span-1">
            <label className="font-medium text-center ">ຈຳນວນຂໍເບີກ</label>
            <input
              name="amount"
              type="number"
              min="1"
              max={form.available_amount}
              value={form.amount}
              onChange={handleChange}
              placeholder={`ສູງສຸດ ${form.available_amount}`}
              className="w-full border px-4 py-2 rounded-lg"
              disabled={loading}
              required
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
            disabled={loading}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-28 text-white py-2 rounded-lg transition ${isSubmitDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
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
            <p><strong>ໄມ້:</strong> {form.name || "-"}</p>
            <p><strong>ປະເພດ:</strong> {form.type || "-"}</p>
            <p><strong>ຂະໜາດ:</strong> {form.size || "-"}</p>
            <p><strong>ຈຳນວນຄົງເຫຼືອ:</strong> {form.available_amount}</p>
            <p><strong>ຈຳນວນທີ່ຂໍ:</strong> {form.amount || "-"}</p>
            <p><strong>ຜູ້ຂໍເບີກ:</strong> {form.u_request || "-"}</p>
            <p><strong>ໝາຍເຫດ:</strong> {form.note || "-"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl max-h-[400px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">📦 ລາຍການທີ່ບັນທຶກແລ້ວ</h2>
          {savedItems.length === 0 ? (
            <p className="text-gray-500">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            savedItems.map(item => (
              <div key={item.tempId} className="border p-4 rounded-lg bg-gray-50 mb-2 shadow-sm space-y-1">
                <p><strong>ຊື່:</strong> {item.name}</p>
                <p><strong>ປະເພດ:</strong> {item.type}</p>
                <p><strong>ຂະໜາດ:</strong> {item.size}</p>
                <p><strong>ບ່ອນຈັດເກັບ:</strong> {item.name_storages}</p>
                <p><strong>ຈຳນວນທີ່ຂໍ:</strong> {item.amount}</p>
                <p><strong>ຜູ້ຂໍເບີກ:</strong> {item.u_request}</p>
                <p><strong>ໝາຍເຫດ:</strong> {item.note || "-"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}