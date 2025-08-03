import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaSave, FaTimes } from 'react-icons/fa'

const Create = () => {
    // ✅ ກຳນົດ state ສຳລັບເກັບຂໍ້ມູນຟອມ
    const [formData, setFormData] = useState({ name: '', note: '' })

    // ✅ ລາຍການທີ່ບັນທຶກແລ້ວ
    const [createdList, setCreatedList] = useState([])

    // ✅ ສະຖານະການກຳລັງບັນທຶກ
    const [loading, setLoading] = useState(false)

    // ✅ ຟັງຊັນສຳລັບປ່ຽນຄ່າຟອມໃນ state
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // ✅ ຟັງຊັນສຳລັບບັນທຶກຂໍ້ມູນ
    const handleSubmit = async () => {
        // 🔹 ກວດວ່າມີການປ້ອນຊື່ຫຼືບໍ່
        if (!formData.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: '⚠️ ກະລຸນາປ້ອນຊື່',
                toast: true,
                position: 'top-end',
                timer: 2500,
                showConfirmButton: false,
                background: '#fff8e1',
                iconColor: '#ff9800'
            });
            return;
        }

        setLoading(true); // 🔹 ເປີດສະຖານະກຳລັງບັນທຶກ

        try {
            // 🔹 ສົ່ງຂໍ້ມູນໄປຫາ API ບັນທຶກຊື່
            const res = await axios.post('http://localhost:3000/api/create_name', formData);

            // ✅ ສຳເລັດ
            Swal.fire({
                icon: 'success',
                title: '✅ ບັນທຶກສຳເລັດ',
                toast: true,
                position: 'top-center',
                timer: 2000,
                showConfirmButton: false,
                background: '#e8f5e9',
                iconColor: '#4caf50'
            });

            // ✅ ອັບເດດລາຍການທີ່ສ້າງແລ້ວເພີ່ມໃໝ່ເຂົ້າໄປ
            setCreatedList(prev => [...prev, formData]);

            // ✅ ລ້າງຟອມຫຼັງຈາກບັນທຶກ
            setFormData({ name: '', note: '' });

        } catch (err) {
            // ❌ ຖ້າຊື່ຊໍ້າ
            if (err.response?.status === 400 && err.response.data?.message === "ຊື່ນີ້ມີແລ້ວ") {
                Swal.fire({
                    icon: 'error',
                    title: '❌ ຊື່ນີ້ມີແລ້ວ',
                    text: 'ກະລຸນາໃສ່ຊື່ໃໝ່',
                    toast: true,
                    position: 'top-center',
                    timer: 3000,
                    showConfirmButton: false,
                    background: '#ffebee',
                    iconColor: '#e53935'
                });
            } else {
                // ❌ ການບັນທຶກລົ້ມເຫຼວອື່ນໆ
                Swal.fire({
                    icon: 'error',
                    title: '❌ ບັນທຶກລົ້ມເຫຼວ',
                    toast: true,
                    position: 'top-center',
                    timer: 3000,
                    showConfirmButton: false,
                    background: '#ffebee',
                    iconColor: '#d32f2f'
                });
            }
        } finally {
            setLoading(false); // 🔹 ປິດສະຖານະກຳລັງບັນທຶກ
        }
    };

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 gap-6 px-4 sm:px-6">
            {/* ✅ ຟອມສ້າງຊື່ຢູ່ຝັ່ງຊ້າຍ */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">ຟອມບັນທຶກ ຊື່ວັດຖຸດິບ</h2>
                <div className="space-y-4">
                    {/* ປ້ອນຊື່ */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ຊື່ໄມ້"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* ປ້ອນໝາຍເຫດ */}
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="ໝາຍເຫດ"
                        rows="4"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* ປຸ່ມບັນທຶກ + ຍົກເລີກ */}
                    <div className="grid grid-cols-2 gap-2 mt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 w-full text-white py-2 rounded-lg transition ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            <FaSave />
                            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
                        </button>
                        <button
                            onClick={() => setFormData({ name: '', note: '' })}
                            disabled={loading}
                            className={`flex items-center justify-center gap-2 w-full text-white py-2 rounded-lg transition ${loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            <FaTimes />
                            ຍົກເລີກ
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ ພາກສ່ວນສະແດງຂໍ້ມູນທີ່ປ້ອນ + ລາຍການທີ່ສ້າງແລ້ວ */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">ຂໍ້ມູນທີ່ກຳລັງປ້ອນ</h2>
                {/* ສະແດງຂໍ້ມູນປັດຈຸບັນ */}
                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                    <p className="font-medium">
                        ຊື່: <span className="font-normal">{formData.name || '(ຍັງບໍ່ມີຂໍ້ມູນ)'}</span>
                    </p>
                    <p className="font-medium">
                        ໝາຍເຫດ: <span className="font-normal">{formData.note || '(ຍັງບໍ່ມີຂໍ້ມູນ)'}</span>
                    </p>
                </div>

                {/* ລາຍການທີ່ບັນທຶກແລ້ວ */}
                {createdList.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">📌 ລາຍການທີ່ບັນທຶກແລ້ວ:</h3>
                        <ul className="list-disc pl-6 space-y-1 text-gray-800 text-sm max-h-60 overflow-y-auto">
                            {createdList.map((item, idx) => (
                                <li key={idx}>
                                    <span className="font-semibold">{item.name}</span>: {item.note}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Create
