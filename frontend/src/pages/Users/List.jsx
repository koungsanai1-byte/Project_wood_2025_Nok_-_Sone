import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Admin');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('โหลด user ผิดพลาด:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!username || !password || !status) {
      Swal.fire({
        icon: 'warning',
        title: 'ຂໍ້ມູນບໍ່ຄົບ',
        text: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('status', status);
      if (image) {
        formData.append('image_users', image);
      }

      await axios.post('http://localhost:3000/api/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form
      setUsername('');
      setPassword('');
      setStatus('Admin');
      setImage(null);
      setPreviewImage(null);
      fetchUsers();

      // Success alert 🎉
      Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ!',
        text: 'ສ້າງຜູ້ໃຊ້ສຳເລັດແລ້ວ',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'ບັນທຶກຜິດພາດ',
        text: err.response?.data?.message || 'ກວດສອບ server ຫຼື ຮູບພາບທີ່ອັບໂຫລດ',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'ຢືນຢັນການລຶບ?',
      text: 'ທ່ານກຳລັງຈະລຶບຜູ້ໃຊ້ຄົນນີ້ ຢ່າງຖາວອນ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: ' ລຶບ ',
      cancelButtonText: 'ຍົກເລີກ',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'ສຳເລັດ!',
          text: 'ລຶບຜູ້ໃຊ້ແລ້ວ',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'ຜິດພາດ',
          text: 'ລຶບບໍ່ສຳເລັດ',
        });
      }
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-[80vh] max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-lg shadow-md bg-gray-50" encType="multipart/form-data">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">ສ້າງຜູ້ໃຊ້ໃໝ່</h2>
        {error && <p className="text-red-600 font-medium text-center">{error}</p>}

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">ຊື່ຜູ້ໃຊ້</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="ປ້ອນຊື່ຜູ້ໃຊ້"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">ລະຫັດຜ່ານ</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="ປ້ອນລະຫັດຜ່ານ"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">ສະຖານະ</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="Admin">Admin</option>
            <option value="User1">User1</option>
            <option value="User2">User2</option>
            <option value="User3">User3</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">ຮູບພາບ</span>
          <div className="mt-1">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                setImage(file);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setPreviewImage(null);
                }
              }}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed border-gray-300 rounded-xl
              cursor-pointer bg-gray-50 hover:bg-gray-100
              hover:border-gray-400 transition-colors duration-200
              group
              "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="w-10 h-10 mb-3 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-blue-600">ຄຣິກເພື່ອອັບໂຫຼດຟາຍ</span>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF (ຂະໜາດສູງສຸດ 10MB)</p>
              </div>
            </label>

            {/* Preview area */}
            {previewImage && (
              <div className="mt-4 relative inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition duration-300 disabled:opacity-60"
        >
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ສ້າງຜູ້ໃຊ້'}
        </button>
      </form>

      {/* List */}
      <div className="p-6 border rounded-lg shadow-md bg-gray-50 flex flex-col">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">ລາຍຊື່ຜູ້ໃຊ້</h2>
        <ul className="overflow-y-auto max-h-[60vh] space-y-3">
          {users.length === 0 && <p className="text-gray-500 text-center">ບໍ່ມີຂໍ້ມູນຜູ້ໃຊ້</p>}
          {users.map(user => (
            <li
              key={user.id_users}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {user.image_users && (
                  <img
                    src={`http://localhost:3000/uploads/${user.image_users}`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => {
                      setSelectedImage(`http://localhost:3000/uploads/${user.image_users}`);
                      setShowModal(true);
                    }}
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.status}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(user.id_users)}
                className="text-red-600 hover:text-red-800 text-xl font-bold"
                aria-label={`ລົບຜູ້ໃຊ້ ${user.username}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Modal ดูรูปภาพ */}
      {showModal && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => {
            setShowModal(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="preview"
              className="w-full h-auto rounded-xl shadow-2xl border-4 border-white"
            />
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
              className="absolute top-4 mr-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-xl py-1 px-3 shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
