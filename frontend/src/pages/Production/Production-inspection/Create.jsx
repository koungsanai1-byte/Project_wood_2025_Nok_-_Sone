import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // States for dropdown lists
  const [dryingList, setDryingList] = useState([]);
  const [improvementList, setImprovementList] = useState([]);

  // States for form data
  const [dataSource, setDataSource] = useState('drying'); // 'drying' or 'improvement'
  const [selectedId, setSelectedId] = useState(id || '');
  const [selectedData, setSelectedData] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ user: "" });

  // ✅ ตรวจสอบว่ามีข้อมูล improvement จาก List.jsx หรือไม่
  useEffect(() => {
    if (location.state?.improvement) {
      const improvement = location.state.improvement;
      setDataSource('improvement');
      setSelectedId(improvement.id_imporvement);
      setSelectedData(improvement);
      setAmountA('');
      setAmountB(0);
      console.log('📦 รับข้อมูล improvement จาก state:', improvement);
    }
  }, [location.state]);

  // ✅ โหลดรายการ drying ที่พร้อมตรวจสอบ
  useEffect(() => {
    const fetchDryingList = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/drying_ready_for_inspection');
        setDryingList(res.data);
      } catch (err) {
        console.error('Error loading drying list:', err);
      }
    };
    fetchDryingList();
  }, []);

  // ✅ โหลดรายการ improvement ที่พร้อมตรวจสอบ
  useEffect(() => {
    const fetchImprovementList = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/improved_inspections');
        setImprovementList(res.data);
      } catch (err) {
        console.error('Error loading improvement list:', err);
      }
    };
    fetchImprovementList();
  }, []);

  // ✅ โหลดข้อมูลเมื่อเลือก item
  useEffect(() => {
    if (selectedId && dataSource) {
      loadSelectedData();
    }
  }, [selectedId, dataSource]);

  const loadSelectedData = async () => {
    try {
      let endpoint = '';
      if (dataSource === 'drying') {
        endpoint = `http://localhost:3000/api/drying/${selectedId}`;
      } else if (dataSource === 'improvement') {
        endpoint = `http://localhost:3000/api/listById_improvenment/${selectedId}`;
      }

      const res = await axios.get(endpoint);
      const data = res.data;

      // ตรวจสอบสถานะ
      if (dataSource === 'drying' && data.status === 'ກວດສອບແລ້ວ') {
        setError('ລາຍການນີ້ຖືກກວດສອບແລ້ວ ບໍ່ສາມາດກວດສອບຊ້ຳໄດ້');
        setSelectedData(null);
        return;
      }

      if (dataSource === 'improvement' && data.status === 'ນຳໄປກວດສອບແລ້ວ') {
        setError('ລາຍການນີ້ຖືກນຳໄປກວດສອບແລ້ວ ບໍ່ສາມາດກວດສອບຊ້ຳໄດ້');
        setSelectedData(null);
        return;
      }

      setSelectedData(data);
      setAmountA('');
      setAmountB(0);
      setError('');
    } catch (err) {
      console.error('Error loading selected data:', err);
      setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້');
    }
  };

  const handleAmountAChange = (e) => {
    const value = Number(e.target.value);
    let maxAmount = 0;

    if (dataSource === 'drying' && selectedData) {
      maxAmount = selectedData.amount_drying;
    } else if (dataSource === 'improvement' && selectedData) {
      maxAmount = selectedData.amount_update; // จำนวนที่ปรับปรุงได้
    }

    if (value <= maxAmount) {
      setAmountA(value);
      setAmountB(maxAmount - value);
      setError('');
    } else {
      setError(`ຈຳນວນທີ່ຜ່ານຕ້ອງບໍ່ເກີນ ${maxAmount}`);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setForm(prev => ({
        ...prev,
        user: parsed.username // ດຶງຕາມຜູ້ login
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedData) {
      Swal.fire({
        icon: 'warning',
        title: '⚠️ ກະລຸນາເລືອກລາຍການ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const payload = {
        note,
        data_source: dataSource,
        user: form.user
      };

      if (dataSource === 'drying') {
        payload.type_products = selectedData.type_drying;
        payload.size_products = selectedData.size_drying;
        payload.amount = selectedData.amount_drying;
        payload.amount_a = amountA;
        payload.amount_b = amountB;
        payload.id_drying = selectedId;
      } else if (dataSource === 'improvement') {
        payload.type_products = selectedData.type_inspection;
        payload.size_products = selectedData.size;
        payload.amount = selectedData.amount_update;
        payload.amount_a = amountA;
        payload.amount_b = amountB;
        payload.id_improvement = selectedId;
      }

      await axios.post('http://localhost:3000/api/create_inspection', payload);

      Swal.fire({
        icon: 'success',
        title: '✅ ບັນທຶກສຳເລັດ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      navigate('/production-inspection');
    } catch (err) {
      console.error('Submit error:', err);
      Swal.fire({
        icon: 'error',
        title: '❌ ບັນທຶກລົ້ມເຫຼວ',
        text: err.response?.data?.error || '',
        toast: true,
        position: 'top-end',
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };

  const getDisplayData = () => {
    if (!selectedData) return null;

    if (dataSource === 'drying') {
      return {
        type: selectedData.type_drying,
        size: selectedData.size_drying,
        amount: selectedData.amount_drying,
        status: selectedData.status
      };
    } else if (dataSource === 'improvement') {
      return {
        type: selectedData.type_inspection,
        size: selectedData.size,
        amount: selectedData.amount_update, // จำนวนที่ปรับปรุงได้
        status: selectedData.status
      };
    }
  };

  const displayData = getDisplayData();


  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📝 ຟອມບັນທຶກ ກວດສອບສິນຄ້າ</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ เลือกประเภทข้อมูล */}
        <div>
          <label className="block text-sm font-medium mb-2">📋 ປະເພດຂໍ້ມູນ:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="drying"
                checked={dataSource === 'drying'}
                onChange={(e) => {
                  setDataSource(e.target.value);
                  setSelectedId('');
                  setSelectedData(null);
                  setAmountA('');
                  setAmountB(0);
                  setError('');
                }}
                className="mr-2"
              />
              🌡️ ຂໍ້ມູນອົບແຫ້ງ
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="improvement"
                checked={dataSource === 'improvement'}
                onChange={(e) => {
                  setDataSource(e.target.value);
                  setSelectedId('');
                  setSelectedData(null);
                  setAmountA('');
                  setAmountB(0);
                  setError('');
                }}
                className="mr-2"
              />
              🔧 ຂໍ້ມູນປັບປຸງ
            </label>
          </div>
        </div>

        {/* ✅ Dropdown ตามประเภทข้อมูล */}
        <div>
          <label className="block text-sm font-medium mb-2">📦 ເລືອກລາຍການ:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- ເລືອກລາຍການ --</option>
            {dataSource === 'drying' && dryingList.map(item => (
              <option key={item.id_drying} value={item.id_drying}>
                ID: {item.id_drying} - {item.type_drying} ({item.size_drying}) - ຈຳນວນ: {item.amount_drying}
              </option>
            ))}
            {dataSource === 'improvement' && improvementList.map(item => (
              <option key={item.id_imporvement} value={item.id_imporvement}>
                ID: {item.id_imporvement} - {item.type_inspection} ({item.size}) - ປັບປຸງໄດ້: {item.amount_update}
              </option>
            ))}
          </select>

          {dataSource === 'drying' && dryingList.length === 0 && (
            <p className="text-gray-500 text-sm mt-1">ບໍ່ມີລາຍການອົບແຫ້ງທີ່ພ້ອມກວດສອບ</p>
          )}
          {dataSource === 'improvement' && improvementList.length === 0 && (
            <p className="text-gray-500 text-sm mt-1">ບໍ່ມີລາຍການປັບປຸງທີ່ພ້ອມກວດສອບ</p>
          )}
        </div>

        {/* แสดง Error Message */}
        {error && !selectedData && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ⚠️ {error}
          </div>
        )}

        {/* ✅ แสดงข้อมูลเมื่อเลือกแล้ว */}
        {displayData && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">🔄 ສະຖານະ:</label>
                <input
                  type="text"
                  value={displayData.status}
                  readOnly
                  className="w-full px-3 py-2 border rounded bg-green-100 border-green-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">📊 ຈຳນວນທີ່ສາມາດກວດສອບ:</label>
                <input
                  type="number"
                  value={displayData.amount}
                  readOnly
                  className="w-full px-3 py-2 border rounded bg-gray-50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">🌳 ປະເພດໄມ້:</label>
              <input
                type="text"
                value={displayData.type}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📏 ຂະໜາດ:</label>
              <input
                type="text"
                value={displayData.size}
                readOnly
                className="w-full px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">✅ ຈຳນວນຜ່ານ:</label>
                <input
                  type="number"
                  min={0}
                  max={displayData.amount}
                  value={amountA}
                  onChange={handleAmountAChange}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="ປ້ອນຈຳນວນທີ່ຜ່ານ"
                />
                {error && selectedData && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">❌ ຈຳນວນບໍ່ຜ່ານ (ອັດຕະໂນມັດ):</label>
                <input
                  type="number"
                  value={amountB}
                  readOnly
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="font-medium">ຜູ້ຮ້ບຜິດຊອບ</label>
              <input
                name="user"
                value={form.user}
                readOnly
                className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
                placeholder="ຊື່ຜູ້ຮັບຜິດຊອບ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📝 ໝາຍເຫດ:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="ໝາຍເຫດເພີ່ມເຕີມ (ຖ້າມີ)"
              />
            </div>

            <button
              type="submit"
              disabled={!!error}
              className={`w-full py-3 rounded font-medium text-lg ${error
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              💾 ບັນທຶກ
            </button>
          </>
        )}
      </form>

      {/* ✅ คำแนะนำการใช้งาน */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">📖 ວິທີການໃຊ້ງານ:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>ຂໍ້ມູນອົບແຫ້ງ:</strong> ສິນຄ້າທີ່ອົບແຫ້ງແລ້ວ ພ້ອມກວດສອບ</li>
          <li>• <strong>ຂໍ້ມູນປັບປຸງ:</strong> ສິນຄ້າທີ່ປັບປຸງແລ້ວ ພ້ອມກວດສອບຄືນ</li>
          <li>• ລະບົບຈະອັດຕະໂນມັດຄິດໄລ່ຈຳນວນທີ່ບໍ່ຜ່ານ</li>
          <li>• ຈຳນວນທີ່ຜ່ານ + ຈຳນວນທີ່ບໍ່ຜ່ານ = ຈຳນວນທັງໝົດ</li>
        </ul>
      </div>
    </div>
  );
};

export default Create;