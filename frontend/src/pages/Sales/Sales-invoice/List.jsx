// pages/List.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const List = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleType, setSaleType] = useState('retail'); // retail หรือ wholesale
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // create, sales
  const [step, setStep] = useState(1); // step 1 = ตะกร้า, step 2 = ข้อมูลลูกค้า


  // สำหรับฟอร์มสร้างการขาย
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  // ຂໍ້ມູນປາຍທາງ
  const [contect, setContect] = useState('');
  const [provinces, setProvinces] = useState('');
  const [districts, setDistricts] = useState('');
  const [villages, setVillages] = useState('');
  const [vall, setVall] = useState('');
  const [payment, setPayment] = useState('');
  const [payments, setPayments] = useState('');


  const [note, setNote] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/list_shop_invoices');
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
      const updated = [...selectedProducts];
      if (updated[existingIndex].quantity < product.amount_products) {
        updated[existingIndex].quantity += 1;
        updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
        setSelectedProducts(updated);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'ສິນຄ້າບໍ່ພໍ',
          toast: true,
          position: 'top-end',
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } else {
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
    axios.get('http://localhost:3000/api/today_sales_invoices')
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
  <title>ໃບເສັດຮັບເງິນ</title>
  <meta charset="UTF-8">
  <style>
    @media print {
      @page { size: 80mm 297mm; margin: 2mm; }
      body { margin: 0; font-family: phetsarath ot; font-size: 16px; line-height: 1.4; }
      .no-print { display: none !important; }
    }
    body {
      font-family: 'phetsarath ot';
      max-width: 80mm;
      margin: 0 auto;
      padding: 5px;
      font-size: 16px;
      line-height: 1.4;
      background: white;
    }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
    .shop-name { font-size: 20px; font-weight: bold; margin-bottom: 6px; }
    .phone-number { font-size: 16px; margin-bottom: 6px; }
    .receipt-title { font-size: 18px; font-weight: bold; margin: 8px 0; }
    .info-section { margin-bottom: 12px; font-size: 16px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; align-items: center; }
    .info-label { font-weight: bold; min-width: 60px; }
    .info-value { text-align: right; flex: 1; }
    .items-section { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 12px 0; }
    .item-row { margin-bottom: 8px; font-size: 15px; }
    .item-details { margin-bottom: 3px; }
    .item-name { font-weight: bold; margin-bottom: 2px; }
    .item-size { font-size: 14px; color: #666; margin-bottom: 2px; }
    .item-price-qty { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
    .item-total { font-weight: bold; font-size: 16px; text-align: right; margin-top: 3px; padding-top: 3px; border-top: 1px dotted #999; }
    .total-section { margin-top: 12px; font-weight: bold; font-size: 18px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-top: 2px solid #000; align-items: center; }
    .qr-section { text-align: left; margin-top: 5px; }
    .qr-section img { width: 70px; height: 70px; }
    .footer { text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #000; font-size: 14px; }
    .footer-line { margin-bottom: 4px; }
    .print-button { margin: 20px auto; display: block; padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
    .print-button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="header">
    <div class="shop-name">ໂຮງງານສັງລວມ</div>
    <div class="phone-number">📞 020-57447582</div>
    <div class="receipt-title">ໃບເສັດຮັບເງິນ</div>
  </div>

  <div class="info-section">
    <div class="info-row"><span class="info-label">ວັນທີ:</span><span class="info-value">${currentDate}</span></div>
    <div class="info-row"><span class="info-label">ຜູ້ຊື້ / ຮ້ານ:</span><span class="info-value">${customerName}</span></div>
    <div class="info-row"><span class="info-label">ເບີໂທ:</span><span class="info-value">${contect}</span></div>
    <div class="info-row"><span class="info-label">ແຂວງ:</span><span class="info-value">${provinces}</span></div>
    <div class="info-row"><span class="info-label">ເມືອງ:</span><span class="info-value">${districts}</span></div>
    <div class="info-row"><span class="info-label">ບ້ານ:</span><span class="info-value">${villages}</span></div>
    <div class="info-row"><span class="info-label">ຮ່ອມ:</span><span class="info-value">${vall}</span></div>
    <div class="info-row"><span class="info-label">ຊຳລະເປັນ:</span><span class="info-value">${payment}</span></div>
    <div class="info-row"><span class="info-label">ການຊຳລະ:</span><span class="info-value">${payments}</span></div>
    ${note ? `<div class="info-row"><span class="info-label">ໝາຍເຫດ:</span><span class="info-value">${note}</span></div>` : ''}
  </div>

  <div class="items-section">
    ${orderData.map(item => `
      <div class="item-row">
        <div class="item-details">
          <div class="item-name">${item.type_products}</div>
          <div class="item-size">${item.size_products}</div>
          <div class="item-price-qty">
            <span>${item.price.toLocaleString()} ກີບ</span>
            <span>× ${item.quantity}</span>
          </div>
        </div>
        <div class="item-total">${item.total.toLocaleString()} ກີບ</div>
      </div>
    `).join('')}
  </div>

  <div class="total-section">
    <div class="total-row">
      <span>ລວມທັງໝົດ:</span>
      <span>${total.toLocaleString()} ກີບ</span>
    </div>
  </div>

  <!-- ✅ QR Code แสดงเฉพาะเมื่อจ่ายแบบເງິນໂອນ -->
  ${payment === 'ເງິນໂອນ' ? `
  <div class="qr-section">
    <img src="../../../public/QR code Mr Nok SANAI.png" alt="QR Code">
  </div>` : ''}

  <div class="footer">
    <div class="footer-line">ຂອບໃຈທີ່ໃຊ້ບໍລິການ</div>
    <div class="footer-line">🙏 ຍິນດີຕ້ອນຮັບສະເໝີ 🙏</div>
  </div>

  <button class="print-button no-print" onclick="window.close();">ອອກ</button>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    }
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
      const orderForPrint = [...selectedProducts];

      for (const item of selectedProducts) {
        await axios.post('http://localhost:3000/api/create_shop_invoices', {
          id_products: item.id_products,
          type_products: item.type_products,
          size_products: item.size_products,
          price: item.price,
          amount: item.quantity,
          total: item.total,
          user_buy: customerName,
          contect: contect,
          provinces: provinces,
          districts: districts,
          villages: villages,
          vall: vall,
          payment: payment,
          payments: payments,
          note: note
        });
      }

      re();
      fetchProducts();
      fetchSales();
      re();

      printReceipt(orderForPrint);

      setSelectedProducts([]);
      setCustomerName('');
      setContect('');
      setProvinces('');
      setDistricts('');
      setVillages('');
      setVall('');
      setPayment('');
      setPayments('');
      setNote('');
      //  กลับไป step 1
      setStep(1);
      Swal.fire({
        icon: 'success',
        title: '✅ ບັນທຶກສຳເລັດ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      // แนะนำไม่ต้อง reload ทั้งหน้า จะทำให้ประสบการณ์ดีขึ้น
      // window.location.reload();

    } catch (err) {
      console.error('Error saving order:', err);
      Swal.fire({
        icon: 'error',
        title: '❌ ເກີດຂໍ້ຜິດພາດ',
        text: err.message || 'ກະລຸນາລອງໃໝ່',
        toast: true,
        position: 'top-end',
        timer: 4000,
        showConfirmButton: false,
      });
    }
  };

  const handleConfirmSale = async (id) => {
    try {
      // ສົ່ງຄຳຮ້ອງໄປຫາ API ເພື່ອຢືນຢັນການຂາຍ
      await axios.patch(`http://localhost:3000/api/confirm_sale/${id}`);

      // ແສດງແຈ້ງເຕືອນວ່າຢືນຢັນສຳເລັດ
      await Swal.fire({
        icon: 'success',
        title: 'ສຳເລັດ!',
        text: 'ຢືນຢັນການຂາຍແລ້ວ',
        timer: 1500,
        showConfirmButton: false,
      });
      // ໂຫຼດຂໍ້ມູນການຂາຍໃໝ່ເພື່ອປັບປຸງຫນ້າຈໍ
      fetchSales();
      // ໂຫຼດຂໍ້ມູນການຂາຍປະຈໍາວັນ
      re();
    } catch (error) {
      console.error('Error confirming sale:', error);

      // ຖ້າເກີດຂໍ້ຜິດພາດ ແຈ້ງເຕືອນຜູ້ໃຊ້
      Swal.fire({
        icon: 'error',
        title: 'ຜິດພາດ',
        text: 'ມີຂໍ້ຜິດພາດໃນການຢືນຢັນ',
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
              <div className="mb-6 font-extrabold underline text-lg text-gray-700">
                ຂໍ້ມູນປາຍທາງ
              </div>
              <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* ซ้าย */}
                  <div className="space-y-5">
                    <label className="block text-gray-800 font-semibold text-sm">
                      ຊຳລະເປັນ
                      <select
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="">-- ເລືອກ --</option>
                        <option value="ເງິນສົດ">ເງິນສົດ</option>
                        <option value="ເງິນໂອນ">ເງິນໂອນ</option>
                        <option value="ຕິດໜີ້">ຕິດໜີ້</option>
                      </select>
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ຊື່ / ຮ້ານຄ້າ
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="ປ້ອນຊື່ / ຮ້ານຄ້າ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ເບີໂທ
                      <input
                        type="text"
                        value={contect}
                        onChange={(e) => setContect(e.target.value)}
                        placeholder="ປ້ອນເບີໂທ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ຕົ້ນທາງ / ປາຍທາງ
                      <select
                        value={payments}
                        onChange={(e) => setPayments(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        <option value="active">-- ເລືອກ --</option>
                        <option value="ຕົ້ນທາງ">ຕົ້ນທາງ</option>
                        <option value="ປາຍທາງ">ປາຍທາງ</option>
                      </select>
                    </label>
                  </div>

                  {/* ขวา */}
                  <div className="space-y-5">
                    <label className="block text-gray-800 font-semibold text-sm">
                      ແຂວງ
                      <input
                        type="text"
                        value={provinces}
                        onChange={(e) => setProvinces(e.target.value)}
                        placeholder="ປ້ອນແຂວງ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ເມືອງ
                      <input
                        type="text"
                        value={districts}
                        onChange={(e) => setDistricts(e.target.value)}
                        placeholder="ປ້ອນເມືອງ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ບ້ານ
                      <input
                        type="text"
                        value={villages}
                        onChange={(e) => setVillages(e.target.value)}
                        placeholder="ປ້ອນບ້ານ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>

                    <label className="block text-gray-800 font-semibold text-sm">
                      ຮ່ອມ
                      <input
                        type="text"
                        value={vall}
                        onChange={(e) => setVall(e.target.value)}
                        placeholder="ປ້ອນຮ່ອມ..."
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                      />
                    </label>
                  </div>
                </div>

                <label className="block text-gray-800 font-semibold text-sm mt-4">
                  ໝາຍເຫດ
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="ໝາຍເຫດເພີ່ມເຕີມ..."
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  />
                </label>

                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full max-w-xs border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg py-3 font-semibold transition-colors"
                  >
                    ⬅️ ຍ້ອນກັບ
                  </button>

                  <button
                    onClick={handleSaveOrder}
                    disabled={
                      selectedProducts.length === 0 ||
                      !customerName.trim() ||
                      !contect.trim() ||
                      !provinces.trim() ||
                      !districts.trim() ||
                      !villages.trim() ||
                      !payment.trim() ||
                      !payments.trim()
                    }
                    className="w-full max-w-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    🖨️ ພິມ
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
    <div className="bg-white rounded-lg">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຜູ້ຊື້ / ຊື່ຮ້ານ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ສິນຄ້າ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຈຳນວນ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລາຄາ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລວມ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຊຳລະເປັນ</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຕົ້ນທາງ / ປາຍທາງ</th>
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
                    {sale.id_invoices}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(sale.created_at).toLocaleDateString('lo-LA')}
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
                    {sale.payments}
                  </td>
                  {sale.statuss === 'ຢືນຢັນ' ? (
                    <button
                      className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate"
                      onClick={() => handleConfirmSale(sale.id_invoices)}
                    >
                      <div className="bg-green-400 px-4 py-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-green-600">
                        {sale.statuss}
                      </div>
                    </button>
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {sale.statuss}
                    </div>
                  )}

                  <td className="px-1 py-4 text-sm text-gray-500 max-w-xs truncate ">
                    <div className="hover:text-gray-900 text-gray-600 flex justify-center rounded-lg py-2" >
                      {sale.note}
                    </div>
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
        {[{
          count: totalProducts,
          label: "ສິນຄ້າທັງໝົດ",
          bg: "bg-blue-50",
          textMain: "text-blue-600",
          textSub: "text-blue-700",
        }, {
          count: lowStockProducts,
          label: "ສິນຄ້າເຫຼືອໜ້ອຍ",
          bg: "bg-red-50",
          textMain: "text-red-600",
          textSub: "text-red-700",
        }, {
          count: totalSales,
          label: "ການຂາຍທັງໝົດ",
          bg: "bg-purple-50",
          textMain: "text-purple-600",
          textSub: "text-purple-700",
        }, {
          count: `${todaySales.toLocaleString()} ກີບ`,
          label: "ຍອດຂາຍປະຈຳວັນ",
          bg: "bg-green-50",
          textMain: "text-green-600",
          textSub: "text-green-700",
        }].map(({ count, label, bg, textMain, textSub }, i) => (
          <div key={i} className={`${bg} p-5 rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-300`}>
            <div className={`text-3xl font-extrabold ${textMain} mb-1`}>{count}</div>
            <div className={`text-sm font-medium ${textSub}`}>{label}</div>
          </div>
        ))}
      </div>


      {/* Tabs */}
      <div className="mb-6 shadow-2xl">
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