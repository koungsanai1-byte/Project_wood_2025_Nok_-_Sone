import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [improvements, setImprovements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchImprovements();
  }, []);

  const fetchImprovements = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_improvenment');
      setImprovements(res.data);
    } catch (err) {
      console.error("ກຳລັງໂຫຼດ", err);
    }
  };

  const handleStatusClick = (improvement) => {
    // Navigate to create inspection form with improvement data
    navigate('/production-inspection_create/:id', {
      state: {
        improvement: improvement
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          <FaTools className="text-blue-600" /> ລາຍການການປັບປຸງ
        </h2>
        <div className="text-sm text-gray-600">
          💡 ຄລິກທີ່ສະຖານະເພື່ອສ້າງຟອມກວດສອບ
        </div>
      </div>
      <div className="overflow-x-auto shadow-2xl rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-blue-100 text-blue-800 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">ປະເພດໄມ້</th>
              <th className="px-4 py-3 text-left">ຂະໜາດ</th>
              <th className="px-4 py-3 text-left">❌ ບໍ່ຜ່ານ</th>
              <th className="px-4 py-3 text-left">✅ ປັບປຸງໄດ້</th>
              <th className="px-4 py-3 text-left">🚫 ປັບປຸງບໍ່ໄດ້</th>
              <th className="px-4 py-3 text-left">📝 ໝາຍເຫດ</th>
              <th className="px-4 py-3 text-left">ຜູ້ຮັບຜິດຊອບ</th>
              <th className="px-4 py-3 text-left">📌 ສະຖານະ</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {improvements.map((item, index) => (
              <tr
                key={item.id_imporvement}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{item.type_inspection}</td>
                <td className="px-4 py-3">{item.size}</td>
                <td className="px-4 py-3 text-red-600 font-medium">{item.amount_inspection}</td>
                <td className="px-4 py-3 text-green-700 font-medium">{item.amount_update}</td>
                <td className="px-4 py-3 text-red-600">{item.amount_not_fix}</td>
                <td className="px-4 py-3">{item.note || '-'}</td>
                <td className="px-4 py-3">{item.user || '-'}</td>
                <td className="px-4 py-3">
                  {item.status === 'ປັບປຸງແລ້ວ' ? (
                  <button
                    onClick={() => handleStatusClick(item)}
                    className="inline-block px-3 py-2 rounded-full text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 transition-colors cursor-pointer border border-green-300 hover:border-green-400"
                    title="ຄລິກເພື່ອສ້າງຟອມກວດສອບ"
                  >
                    🔧 {item.status}
                  </button>
                  ):(
                    <div className='text-sm ms-2 italic'>ກວດສອບແລ້ວ</div>
                  )}
                </td>
              </tr>
            ))}
            {improvements.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <FaTools className="text-4xl text-gray-300" />
                    <p>ບໍ່ມີຂໍ້ມູນການປັບປຸງ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Instructions */}
      {improvements.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">📖 ວິທີການໃຊ້ງານ:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ຄລິກທີ່ປຸ່ມສະຖານະ "ປັບປຸງແລ້ວ" ເພື່ອສ້າງຟອມກວດສອບໃໝ່</li>
            <li>• ຂໍ້ມູນຈະຖືກນຳໄປໃສ່ຟອມອັດຕະໂນມັດ</li>
            <li>• ສາມາດກວດສອບສິນຄ້າທີ່ປັບປຸງແລ້ວໄດ້ທັນທີ</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default List;