import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast';

const Create = () => {
    const [formData, setFormData] = useState({
        id_name: '',
        type: '',
        note: ''
    })

    const [nameOptions, setNameOptions] = useState([])
    const [savedItems, setSavedItems] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3000/api/list_name')
            .then(res => setNameOptions(res.data))
            .catch(() => {
                toast.error(' ດຶງຂໍ້ມູນຊື່ລົ້ມເຫຼວ', {
                    duration: '3000',
                    position: 'top-right',
                    icon: '❌'
                })
            })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        const { id_name, type, note } = formData;

        if (!id_name || !type.trim()) {
            toast.error('⚠️ ກະລຸນາໃສ່ຂໍ້ມູນ', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }

        axios.post('http://localhost:3000/api/create_type', formData)
            .then(res => {
                toast.success('✅ ບັນທຶກສຳເລັດ', {
                    duration: 3000,
                    position: 'top-center',
                });
                setSavedItems(prev => [
                    ...prev,
                    { ...formData, id: res.data.insertId }
                ]);
                setFormData({ id_name: '', type: '', note: '' });
            })
            .catch(err => {
                const status = err.response?.status;
                if (status === 400) {
                    toast.error('⚠️ ຂໍ້ມູນນີ້ມີແລ້ວ!', {
                        duration: 3000,
                        position: 'top-center',
                    });
                } else {
                    toast.error('❌ ບັນທຶກລົ້ມເຫຼວ', {
                        duration: 3000,
                        position: 'top-center',
                    });
                }
            });
    };

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto mt-10 gap-6 p-4">
            <Toaster position="top-right" />

            {/* Form */}
            <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">ຟອມບັນທຶກ ປະເພດວັດຖຸດິບ</h2>
                <div className="space-y-4">
                    <select
                        name="id_name"
                        value={formData.id_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- ເລືອກຊື່ --</option>
                        {nameOptions.map((d) => (
                            <option key={d.id_name} value={d.id_name}>{d.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="ປະເພດ"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="ໝາຍເຫດ"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            ບັນທຶກ
                        </button>
                        <button
                            onClick={() => setFormData({ id_name: '', type: '', note: '' })}
                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            ຍົກເລີກ
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview & Saved Items */}
            <div className="w-full md:w-1/2 space-y-6">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">ຂໍ້ມູນທີ່ກຳລັງປ້ອນ</h2>
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <p className="font-medium">ຊື່: <span className="font-normal">
                            {nameOptions.find(n => n.id_name === formData.id_name)?.name || '(ບໍ່ໄດ້ເລືອກ)'}
                        </span></p>
                        <p className="font-medium">ປະເພດ: <span className="font-normal">{formData.type || '(ຍັງບໍ່ມີ)'}</span></p>
                        <p className="font-medium">ໝາຍເຫດ: <span className="font-normal">{formData.note || '(ຍັງບໍ່ມີ)'}</span></p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">ລາຍການທີ່ບັນທຶກແລ້ວ</h2>
                    {savedItems.length === 0 ? (
                        <p className="text-gray-500 italic">ຍັງບໍ່ມີຂໍ້ມູນທີ່ບັນທຶກ</p>
                    ) : (
                        <div className="space-y-3">
                            {savedItems.map(item => (
                                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                                    <p className="font-medium">ຊື່: <span className="font-normal">
                                        {nameOptions.find(n => n.id_name === item.id_name)?.name || item.id_name}
                                    </span></p>
                                    <p className="font-medium">ປະເພດ: <span className="font-normal">{item.type}</span></p>
                                    <p className="font-medium">ໝາຍເຫດ: <span className="font-normal">{item.note}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Create
