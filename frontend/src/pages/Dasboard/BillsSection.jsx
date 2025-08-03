import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BillsSection = () => {
  // hover 
  const [hoverIndex, setHoverIndex] = useState(null);
  // ສະຫຼຸບຂໍ້ມູນການຊື້
  const [total, setTotal] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [latest, setLatest] = useState([]);
  const [amount_y, setAmount_y] = useState([]);
  const [amount_m, setAmount_m] = useState([]);
  const [amount_l, setAmount_l] = useState([]);

  // ສະຫຼຸບຂໍ້ມູນສາງໄມ້
  const [amount_a_t, setAmount_a_t] = useState([]);
  const [amount_a_v, setAmount_a_v] = useState([]);

  // ສະຫຼຸບຂໍ້ມູນການຜະລິດ
  const [amount_requsition_all, setAmount_rq_all] = useState([]);
  const [amount_requsition_today, setAmount_rq_td] = useState([]);
  const [amount_process_all, setAmount_pc_all] = useState([]);
  const [amount_process_today, setAmount_pc_td] = useState([]);

  // ສະຫຼຸບຂໍ້ມູນສິນຄ້າ
  const [products_all, setProducts_all] = useState([]);
  const [products_min, setProducts_min] = useState([]);

  // ສະຫຼຸບຂໍ້ມູນການຂາຍ
  const [sale_cost, setSale_cost] = useState([]);
  const [sale_profit, setSale_profit] = useState([]);


  // total

  useEffect(() => {
    axios.get('http://localhost:3000/api/total')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.total || 0;
        setTotal(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/monthly')
      .then(res => {
        console.log('Monthly API Response:', res.data); // ✅ จะได้ object
        const fetched = res.data?.total_cost || 0;
        setMonthly(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/latest')
      .then(res => {
        const fetched = res.data?.total || 0;
        setLatest(fetched);
      })
      .catch(err => {
        console.error('API Error (latest):', err);
      });
  }, []);

  // amount
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_y')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.amount || 0;
        setAmount_y(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_m')
      .then(res => {
        console.log('Monthly API Response:', res.data); // ✅ จะได้ object
        const fetched = res.data?.amount_cost || 0;
        setAmount_m(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_l')
      .then(res => {
        const fetched = res.data?.amount || 0;
        setAmount_l(fetched);
      })
      .catch(err => {
        console.error('API Error (latest):', err);
      });
  }, []);

  // ດືງຈຳນວນທັງໝົດໃນສາງ
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_all_total')
      .then(res => {
        const fetched = res.data?.total || 0;
        setAmount_a_t(fetched)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  // ດຶງຈຳນວນໜ່ວຍວັດ
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_all_volume')
      .then(res => {
        const fetched = res.data?.distinct_volume_count || 0;
        setAmount_a_v(fetched)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

    // ດຶງລາຍການເບີກທັງໝົດ
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_requsition_all')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.count_all || 0;
        setAmount_rq_all(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  // ດຶງລາຍການເບີກມື້ນີ້
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_requsition_today')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.count_today || 0;
        setAmount_rq_td(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

   // ດຶງລາຍການຜະລິດທັງໝົດ
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_process_all')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.count_all || 0;
        setAmount_pc_all(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  // ດຶງລາຍການຜະລິດມື້ນີ້
  useEffect(() => {
    axios.get('http://localhost:3000/api/amount_process_today')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.count_today || 0;
        setAmount_pc_td(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  // ດຶງລາຍການສຶນຄ້າທັງໝົດ
  useEffect(() => {
    axios.get('http://localhost:3000/api/count/all')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.total || 0;
        setProducts_all(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  // ດຶງລາຍການສຶນຄ້າຍັງນ້ອຍ
  useEffect(() => {
    axios.get('http://localhost:3000/api/count/low-stock')
      .then(res => {
        console.log('API Response:', res.data);
        const fetched = res.data?.min_stock || 0;
        setProducts_min(fetched);
      })
      .catch(err => {
        console.error('API Error:', err);
      });
  }, []);

  // ດຶງຂໍ້ມູນກຳໄລທັງໝົດ
  useEffect(() => {
    axios.get('http://localhost:3000/api/total-cost')
      .then(res => {
        setSale_cost(res.data.total_cost || 0);
      })
      .catch(err => console.error(err));
  }, []);

  // ດຶງຂໍ້ມູນກຳໄລເບື້ອງຕົ້ນ
  useEffect(() => {
    axios.get('http://localhost:3000/api/total-profit')
      .then(res => {
        setSale_profit(res.data.profit || 0);
      })
      .catch(err => console.error(err));
  }, []);


  const formatNumber = (num) =>
    num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const cards = [
    {
      title: 'ຊື້ວັດຖຸດິບ',
      value: formatNumber(total) + ' ₭',
      colors: ['from-blue-100', 'to-blue-500'],
      text:
        <div className='flex justify-between items-center hover:shadow-2xl'>
          <div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຕົ້ນທຶນທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຕົ້ນທຶນຕໍ່ເດືອນ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຕົ້ນທຶນລ່າສຸດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຈຳນວນທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຈຳນວນຕໍ່ເດືອນ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຈຳນວນລ່າສຸດ</div>
          </div>
          <div>
            <div>{formatNumber(total) + ' ₭'}</div>
            <div>{formatNumber(monthly) + ' ₭'}</div>
            <div>{formatNumber(latest) + ' ₭'}</div>
            <div>{formatNumber(amount_y)}</div>
            <div>{formatNumber(amount_m)}</div>
            <div>{formatNumber(amount_l)}</div>
          </div>
        </div>
    },
    {
      title: 'ສາງວັດຖຸດິບ',
      value: (amount_a_t) + '  ຈຳນວນ',
      colors: ['from-green-100', 'to-green-500'],
      text:
        <div className='flex justify-between items-center'>
          <div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຈຳນວນໄມ້ທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ໜ່ວຍວັດທັງໝົດ</div>
          </div>
          <div>
            <div>{amount_a_t}</div>
            <div>{amount_a_v}</div>
          </div>
        </div>,
    },
    {
      title: 'ການຜະລິດ',
      value: (amount_process_today) + ' ລາຍການ',
      colors: ['from-yellow-100', 'to-yellow-500'],
      text:
        <div className='flex justify-between items-center '>
          <div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ເບີກທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ເບີກມື້ນີ້</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ຜະລິດທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ຜະລິດມື້ນີ້</div>
          </div>
          <div>
            <div>{amount_requsition_all}</div>
            <div>{amount_requsition_today}</div>
            <div>{amount_process_all}</div>
            <div>{amount_process_today}</div>
          </div>
        </div>,
    },
    {
      title: 'ຄັງສິນຄ້າ',
      value: (products_all) + ' ລາຍການ',
      colors: ['from-pink-100', 'to-pink-500'],
      text:
        <div className='flex justify-between items-center '>
          <div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ສິນຄ້າທັງໝົດ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ລາຍການ ສິນຄ້າຍັງນ້ອຍ</div>
          </div>
          <div>
            <div>{products_all}</div>
            <div>{products_min}</div>
          </div>
        </div>,
    },
    {
      title: 'ການຂາຍ',
      value: formatNumber(sale_cost) + ' ₭',
      colors: ['from-blue-200', 'to-purple-500'],
      text:
        <div className='flex justify-between items-center '>
          <div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ຍອດຂາຍລວມ</div>
            <div className="text-bold text-md text-gray-900 hover:bg-gray-50">ກຳໄລເບື້ອງຕົ້ນ</div>
          </div>
          <div>
            <div>{formatNumber(sale_cost) + ' ₭'}</div>
            <div>{formatNumber(sale_profit) + ' ₭'}</div>
          </div>
        </div>,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow mx-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">ລາຍງານສະຫຼຸບ</h2>

      <div className="grid grid-cols-1 mx-4 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`relative bg-gradient-to-r ${card.colors[0]} ${card.colors[1]} shadow-xl hover:shadow-2xl rounded-xl p-6 text-center transition duration-200 ease-in-out transform hover:scale-105 mb-5`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>

            {hoverIndex === index && (
              <div className="absolute w-72 top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs z-10">
                <p className="text-gray-700 font-bold mb-1">{card.title}</p>
                <p className="text-gray-600 text-left">{card.text}</p>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-white border-l border-t border-gray-200 "></div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default BillsSection;
