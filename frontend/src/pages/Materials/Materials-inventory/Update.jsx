import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateInventory() {
    const { id } = useParams(); // inventory ID from URL
    const navigate = useNavigate();

    const [form, setForm] = useState({
        id_purchase: "",
        id_storages: "",
        u_import: "",
        note: "",
        amount: "",
        name: "",
        type: "",
        size: "",
    });

    const [storages, setStorages] = useState([]);

    // Load inventory by ID
    useEffect(() => {
        axios.get(`http://localhost:3000/api/listById_inventory/${id}`)
            .then(res => setForm(res.data))
            .catch(err => {
                console.error(err);
                alert("❌ ບໍ່ພົບຂໍ້ມູນ");
            });
    }, [id]);

    // Load storages
    useEffect(() => {
        axios.get("http://localhost:3000/api/list_storages")
            .then(res => setStorages(res.data))
            .catch(console.error);
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/update_inventory/${id}`, form);
            alert("✅ ແກ້ໄຂສຳເລັດ");
            navigate("/materials-inventory");
        } catch (err) {
            console.error(err);
            alert("❌ ບໍ່ສາມາດອັບເດດໄດ້");
        }
    };

    const handleCancel = () => {
        navigate("/materials-inventory");
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold mb-4">✏️ ແກ້ໄຂຂໍ້ມູນສິນຄ້າ</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-medium">ຊື່</label>
                        <input
                            name="name"
                            value={form.name}
                            disabled
                            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="font-medium">ປະເພດ</label>
                        <input
                            name="type"
                            value={form.type}
                            disabled
                            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="font-medium">ຂະໜາດ</label>
                        <input
                            name="size"
                            value={form.size}
                            disabled
                            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="font-medium">ຈຳນວນ</label>
                        <input
                            name="amount"
                            value={form.amount}
                            disabled
                            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
                        />
                    </div>
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

                <div>
                    <label className="font-medium">ຜູ້ນຳເຂົ້າ</label>
                    <input
                        name="u_import"
                        value={form.u_import}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg"
                        disabled
                    />
                </div>

                <div>
                    <label className="font-medium">ໝາຍເຫດ</label>
                    <textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-lg h-24"
                        readOnly
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="w-28 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
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
        </div>
    );
}
