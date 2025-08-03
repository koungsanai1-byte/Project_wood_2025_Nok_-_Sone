import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'

const Update = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', note: '' })
    const [message, setMessage] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:3000/api/listById_name/${id}`)
            .then(res => {
                console.log("Fetched:", res.data);
                const data = res.data[0];
                if (data) {
                    // ✅ ดึงทั้ง name และ note เข้ามา
                    setFormData({ name: data.name, note: data.note });
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
            });
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/update_name/${id}`, formData);

            Swal.fire({
                icon: 'success',
                title: '✅ ແກ້ໄຂສຳເລັດ',
                toast: true,
                position: 'top',
                timer: 2500,
                showConfirmButton: false,
                background: '#e8f5e9',
                iconColor: '#4caf50'
            });

            navigate('/list_name');
        } catch (err) {
            console.error("Update error:", err);

            Swal.fire({
                icon: 'error',
                title: '❌ ແກ້ໄຂລົ້ມເຫຼວ',
                toast: true,
                position: 'top',
                timer: 3000,
                showConfirmButton: false,
                background: '#ffebee',
                iconColor: '#d32f2f'
            });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">ແກ້ໄຂ ຊື່</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="ຊື່"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder='ໝາຍເຫດ'
                    className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                {message && <p className="text-center text-green-600">{message}</p>}
                <div className="grid grid-cols-2 mx-10">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        ບັນທຶກ
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/list_namej')}
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition ms-1"
                    >
                        ຍົກເລີກ
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Update
