// pages/List.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const List = ({ productData = null }) => {
  const [step, setStep] = useState(1); // step 1 = ตะกร้า, step 2 = ข้อมูลลูกค้า
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleType, setSaleType] = useState('retail');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  // สำหรับฟอร์มสร้างการขาย
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [payment, setPayment] = useState('');
  const [note, setNote] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_shop');
      setSales(res.data);
    } catch (err) {
      console.error("Failed to fetch shop data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_products');
      const filtered = res.data
      // .filter(item => item.amount_products > 0);
      setProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // โหลดทั้งสองอย่าง
    Promise.all([fetchProducts(), fetchSales()]).then(() => {
      setLoading(false);
    });
  }, []);

  // ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const addToCart = (product) => {
    const existingIndex = selectedProducts.findIndex(p => p.id_products === product.id_products);

    if (existingIndex >= 0) {
      // ถ้ามีแล้ว เพิ่มจำนวน
      const updated = [...selectedProducts];
      if (updated[existingIndex].quantity < product.amount_products) {
        updated[existingIndex].quantity += 1;
        updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
        setSelectedProducts(updated);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'ສິນຄ້າບໍ່ພໍ',
          text: 'ກະລຸນາກວດສອບຈຳນວນໃນຄັງກ່ອນຂາຍ',
          confirmButtonText: 'ຕົກລົງ',
          confirmButtonColor: '#f97316' // orange
        });
      }
    } else {
      // ถ้ายังไม่มี เพิ่มใหม่
      setSelectedProducts([...selectedProducts, {
        ...product,
        quantity: 1,
        price: product.price_products,
        total: product.price_products
      }]);
    }
  };

  // ฟังก์ชันลบสินค้าจากตะกร้า
  const removeFromCart = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id_products !== productId));
  };

  // ฟังก์ชันปรับจำนวนสินค้า
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = selectedProducts.map(p => {
      if (p.id_products === productId) {
        const maxQty = products.find(prod => prod.id_products === productId)?.amount_products || 0;
        const qty = Math.min(newQuantity, maxQty);
        return {
          ...p,
          quantity: qty,
          total: qty * p.price
        };
      }
      return p;
    });
    setSelectedProducts(updated);
  };

  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    re();
  }, []);

  const re = () => {
    axios.get('http://localhost:3000/api/today_sales')
      .then(res => {
        setTodaySales(res.data.total_sales_today || 0);
      })
      .catch(err => {
        console.error('Error fetching today sales:', err);
      });
  }

  // ฟังก์ชันสร้างใบเสร็จสำหรับพิมพ์
  const generatePrintReceipt = (orderData) => {
    const currentDate = new Date().toLocaleDateString('lo-LA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const total = orderData.reduce((sum, item) => sum + item.total, 0);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ໃບເສັດຮັບເງິນ</title>
  <style>
    @media print {
      @page { size: 80mm auto; margin: 2mm; }
      .no-print { display: none !important; }
    }
    body {
      font-family: 'phetsarath ot', Arial, sans-serif;
      max-width: 80mm;
      margin: 0 auto;
      padding: 5px;
      font-size: 16px;
      background: white;
    }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
    .shop-name { font-size: 20px; font-weight: bold; }
    .phone-number { font-size: 14px; margin: 4px 0; }
    .receipt-title { font-size: 18px; font-weight: bold; margin: 5px 0; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .info-label { font-weight: bold; }
    .items-section { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 6px 0; margin: 10px 0; }
    .item-row { margin-bottom: 8px; }
    .item-name { font-weight: bold; }
    .item-size { font-size: 14px; color: #555; }
    .item-price-qty { display: flex; justify-content: space-between; font-size: 14px; }
    .item-total { text-align: right; font-weight: bold; border-top: 1px dotted #aaa; margin-top: 3px; padding-top: 3px; }
    .total-qr-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #000;
      margin-top: 5px;
      padding-top: 5px;
    }
    .qr-shop {
      text-align: left;
    }
    .qr-shop img {
      width: 70px;
      height: 70px;
    }
    .total-text {
      font-weight: bold;
      font-size: 18px;
      text-align: right;
    }
    .footer {
      text-align: center;
      border-top: 1px dashed #000;
      padding-top: 6px;
      font-size: 14px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">ໂຮງງານສັງລວມ</div>
    <div class="phone-number">📞 020-57447582</div>
    <div class="receipt-title">ໃບເສັດຮັບເງິນ</div>
  </div>

  <div class="info-row"><span class="info-label">ວັນທີ:</span><span>${currentDate}</span></div>
  <div class="info-row"><span class="info-label">ຜູ້ຊື້:</span><span>${customerName}</span></div>
  <div class="info-row"><span class="info-label">ກະຊຳລະ:</span><span>${payment}</span></div>

  <div class="items-section">
    ${orderData.map(item => `
      <div class="item-row">
        <div class="item-name">${item.type_products}</div>
        <div class="item-size">${item.size_products}</div>
        <div class="item-price-qty">
          <span>${item.price.toLocaleString()} ກີບ</span>
          <span>× ${item.quantity}</span>
        </div>
        <div class="item-total">${item.total.toLocaleString()} ກີບ</div>
      </div>
    `).join('')}
  </div>

  <!-- ✅ QR CODE ซ้าย, ยอดรวมขวา -->
    <div class="total-qr-wrapper">
      <div class="qr-shop">
        ${payment === 'ເງິນໂອນ' ? `<img src="../../../public/QR code Mr Nok SANAI.png" alt="QR Code">` : ''}
      </div>
    <div class="total-text">
      ລວມທັງໝົດ:<br>
    ${total.toLocaleString()} ກີບ
  </div>
</div>

  <div class="footer">
    <div>ຂອບໃຈທີ່ໃຊ້ບໍລິການ</div>
    <div>🙏 ຍິນດີຕ້ອນຮັບສະເໝີ 🙏</div>
    <button class="print-button no-print" onclick="window.close();" style="font-family: phetsarath ot;">
      ອອກ
    </button>
  </div>

  <script>
    window.onload = () => setTimeout(() => window.print(), 500);
  </script>
</body>
</html>
`;



  };

  // ຄຳສັ່ງພີມໃບບິນ
  const printReceipt = (orderData) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintReceipt(orderData));
    printWindow.document.close();
  };

  // ຄຳສັ່ງບັນທຶກຂາຍ

  const handleSaveOrder = async () => {
    try {
      // เก็บข้อมูลสำหรับพิมพ์ใบเสร็จ
      const orderForPrint = [...selectedProducts];

      // บันทึกรายการทีละรายการ
      for (const item of selectedProducts) {
        await axios.post('http://localhost:3000/api/create_shop', {
          id_products: item.id_products,
          type_products: item.type_products,
          size_products: item.size_products,
          price: item.price,
          amount: item.quantity,
          total: item.total,
          user_buy: customerName,
          payment: payment,
          note: `${saleType === 'retail' ? 'ຂາຍໜ້າຮ້ານ' : 'ຂາຍສົ່ງ'}  ${note}`.trim()
        });
      }

      // รีเฟรชข้อมูล
      re();

      // แสดงข้อความสำเร็จแบบสวยงาม
      await Swal.fire({
        icon: 'success',
        title: 'ສ້າງສຳເລັດ',
        text: 'ບັນທຶກການຂາຍສຳເລັດແລ້ວ',
        timer: 1800,
        showConfirmButton: false,
      });

      // พิมพ์บิล
      printReceipt(orderForPrint);

      // เคลียร์ฟอร์ม
      setSelectedProducts([]);
      setCustomerName('');
      setPayment('');
      setNote('');

      //  กลับไป step 1
      setStep(1);

      // โหลดข้อมูลใหม่
      fetchProducts();
      fetchSales();

    } catch (err) {
      console.error('Error saving order:', err);

      // ແຈ້ງເຕືອນ
      Swal.fire({
        icon: 'error',
        title: 'ຜິດພາດ',
        text: 'ເກີດຂໍ້ຜິດພາດຂະນະບັນທຶກການຂາຍ',
        confirmButtonText: 'ຕົກລົງ',
      });
    }
  };


  const renderProductCard = (item) => (
    <div key={item.id_products} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-800">#{item.id_products}</h3>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          ເຫຼືອ {item.amount_products}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <div><strong>ປະເພດ:</strong> {item.type_products}</div>
        <div><strong>ຂະໜາດ:</strong> {item.size_products}</div>
        <div><strong>ລາຄາ:</strong> <span className="text-blue-600 font-semibold">{item.price_products} ກີບ</span></div>
      </div>

      <button
        onClick={() => addToCart(item)}
        className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors"
        disabled={item.amount_products <= 0}
      >
        ➕ ເພີ່ມສິນຄ້າ
      </button>
    </div>
  );

  const renderCreateSaleForm = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-2xl">
      {/* ລາຍການສິນຄ້າ */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">📦 ລາຍການສິນຄ້າ</h3>

          {/* ຊ່ອງຄົນຫາ */}
          <input
            type="text"
            placeholder="🔍 ຄົ້ນຫາສິນຄ້າ..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* แสดงสินค้า */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {products
              .filter(item =>
                item.type_products?.toLowerCase().includes(search.toLowerCase()) ||
                item.size_products?.toLowerCase().includes(search.toLowerCase())
              )
              .map(renderProductCard)
            }
          </div>
        </div>
      </div>

      {/* ตะกร้าสินค้า */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">🛒 ສ້າງບິນຂາຍ</h3>

          {/* STEP 1: รายการสินค้า */}
          {step === 1 && (
            <>

              {/* รายการสินค้าในตะกร้า */}
              <div className="space-y-1 mb-4 max-h-60 overflow-y-auto">
                {selectedProducts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🛒</div>
                    <p>ເພີ່ມສິນຄ້າ</p>
                  </div>
                ) : (
                  selectedProducts.map(item => (
                    <div key={item.id_products} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm">
                          <div className="font-medium">{item.type_products}</div>
                          <div className="text-gray-600">{item.size_products}</div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id_products)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✖
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => updateQuantity(item.id_products, item.quantity - 1)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 w-6 h-6 rounded-full text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id_products, item.quantity + 1)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 w-6 h-6 rounded-full text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm text-gray-600">
                        {item.price} × {item.quantity} = <span className="font-semibold text-green-600">{item.total} ກີບ</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* ยอดรวม */}
              {selectedProducts.length > 0 && (
                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>ລວມທັງໝົດ:</span>
                    <span className="text-green-600">
                      {selectedProducts.reduce((sum, item) => sum + item.total, 0).toLocaleString()} ກີບ
                    </span>
                  </div>
                </div>
              )}


              {/* ปุ่มไปต่อ */}
              {selectedProducts.length > 0 && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  ➡️ ຖັດໄປ
                </button>
              )}
            </>
          )}

          {/* STEP 2: ข้อมูลลูกค้า */}
          {step === 2 && (
            <>


              {/* ข้อมูลลูกค้า */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="block text-sm font-medium text-gray-700 mb-1">ການຊຳລະ</label>
                  <select
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                    className='w-full border border-gray-300 px-3 py-2 rounded-lg text-sm'>
                    <option value="">-- ເລືອກ --</option>
                    <option value="ເງິນສົດ">ເງິນສົດ</option>
                    <option value="ເງິນໂອນ">ເງິນໂອນ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ຊື່ຜູ້ຊື້</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                    placeholder="ປ້ອນຊື່ຜູ້ຊື້..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ໝາຍເຫດ</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm"
                    rows="2"
                    placeholder="ໝາຍເຫດເພີ່ມເຕີມ..."
                  />
                </div>
                <div className="flex justify-center items-center gap-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full  hover:bg-gray-100 hover:text-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    ⬅️ ຍ້ອນກັບ
                  </button>
                  <button
                    onClick={handleSaveOrder}
                    disabled={selectedProducts.length === 0 || !customerName.trim() || !payment.trim()}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    🖨️ ບັນທຶກ ແລະ ພິມ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ฟังก์ชันแสดงข้อมูลการขาย
  const renderSalesData = () => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">📊 ຂໍ້ມູນການຂາຍ</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="🔍 ຄົ້ນຫາລູກຄ້າ..."
              className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={fetchSales}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              🔄 ໂຫຼດໃໝ່
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລະຫັດ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ວັນທີ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຜູ້ຊື້</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ສິນຄ້າ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຈຳນວນ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລາຄາ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລວມ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ສະຖານະ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ໝາຍເຫດ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales
              .filter(sale =>
                !search ||
                sale.user_buy?.toLowerCase().includes(search.toLowerCase()) ||
                sale.type_products?.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => new Date(b.date_shop) - new Date(a.date_shop))
              .map((sale, index) => (
                <tr key={sale.id_shop || index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{sale.id_shop}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {isNaN(new Date(sale.created_at)) ? "ວັນທີບໍ່ຖືກຕ້ອງ" : new Date(sale.created_at).toLocaleDateString('lo-LA')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{sale.user_buy}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="font-medium">{sale.type_products}</div>
                    <div className="text-gray-500">{sale.size_products}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.amount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Number(sale.price).toLocaleString()} ກີບ
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {Number(sale.total).toLocaleString()} ກີບ
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {sale.payment}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {sale.note}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {sales.filter(sale =>
          !search ||
          sale.user_buy?.toLowerCase().includes(search.toLowerCase()) ||
          sale.type_products?.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນການຂາຍ</p>
            </div>
          )}
      </div>
    </div>
  );

  // Statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.amount_products < 5).length;
  const totalSales = sales.length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">🛒 ລະບົບຂາຍສິນຄ້າ</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="text-3xl font-extrabold text-blue-600 mb-1">{totalProducts}</div>
          <div className="text-sm font-semibold text-blue-700">ສິນຄ້າທັງໝົດ</div>
        </div>
        <div className="bg-red-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="text-3xl font-extrabold text-red-600 mb-1">{lowStockProducts}</div>
          <div className="text-sm font-semibold text-red-700">ສິນຄ້າເຫຼືອໜ້ອຍ</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="text-3xl font-extrabold text-purple-600 mb-1">{totalSales}</div>
          <div className="text-sm font-semibold text-purple-700">ການຂາຍທັງໝົດ</div>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div className="text-3xl font-extrabold text-green-600 mb-1">
            {todaySales.toLocaleString()} ກີບ
          </div>
          <div className="text-sm font-semibold text-green-700">ຍອດຂາຍປະຈຳວັນ</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              🛒 ສ້າງການຂາຍ
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'sales'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              📊 ຂໍ້ມູນການຂາຍ
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">⏳ ກຳລັງໂຫຼດ...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'create' && renderCreateSaleForm()}
          {activeTab === 'sales' && renderSalesData()}
        </>
      )}
    </div>
  );
};

export default List;