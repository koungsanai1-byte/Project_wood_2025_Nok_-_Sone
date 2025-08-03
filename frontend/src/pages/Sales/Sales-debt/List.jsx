import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function InvoiceTable() {
  const [debtList, setDebtList] = useState([]);
  const [di, setDi] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDebtList();
    fetchDI();
  }, []);

  const fetchDebtList = () => {
    fetch("http://localhost:3000/api/list_debt")
      .then((res) => res.json())
      .then((data) => setDebtList(data))
      .catch((err) => console.error("Error fetching debt data:", err));
  };

  const fetchDI = () => {
    fetch("http://localhost:3000/api/list_debt_invoices")
      .then((res) => res.json())
      .then((data) => setDi(data))
      .catch((err) => console.error("Error fetching DI data:", err));
  };

  const getPayAmount = (invoiceId) => {
    const match = di.find((item) => item.id_invoices === invoiceId);
    return match ? parseFloat(match.pay_amount).toFixed(2) : 0;
  };

  const handlePayClick = (invoice) => {
    const paid = parseFloat(getPayAmount(invoice.id_invoices));
    setSelectedInvoice({ ...invoice, paid });
    setPayAmount("");
    setNote("");
    setSuccess("");
  };

  const handleSubmitDebt = async (e) => {
    e.preventDefault();
    const enteredAmount = parseFloat(payAmount);
    const currentPaid = parseFloat(selectedInvoice.paid || 0);
    const maxAmount = parseFloat(selectedInvoice.total);

    const newTotalPaid = enteredAmount + currentPaid;

    if (!payAmount || isNaN(enteredAmount) || newTotalPaid > maxAmount) {
      Swal.fire({
        icon: 'error',
        title: '❌ ຍອດເກີນໜີ້',
        text: 'ກະລຸນາໃສ່ຈໍານວນໃໝ່ທີ່ຖືກຕ້ອງ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/create_debt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_invoices: selectedInvoice.id_invoices,
          pay_amount: enteredAmount,
          note,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '✅ ບັນທຶກການຈ່າຍໜີ້ສຳເລັດ',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
        setSuccess("ບັນທຶກການຈ່າຍໜີ້ສຳເລັດ");
        setSelectedInvoice(null);
        fetchDebtList();
        fetchDI();
      } else {
        Swal.fire({
          icon: 'error',
          title: '❌ ບັນທຶກລົ້ມເຫຼວ',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Error submitting debt:", err);
      Swal.fire({
        icon: 'error',
        title: '❌ ການຈ່າຍໜີ້ຜິດພາດ',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ລະບົບຈັດການໜີ້
              </h1>
              <p className="text-gray-600 mt-2">ການຄຸ້ມຄອງແລະຕິດຕາມລາຍການໜີ້ທັງໝົດ</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{debtList.length}</div>
                <div className="text-sm opacity-90">ລາຍການໜີ້</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="px-2 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ລຳດັບ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ປະເພດສິນຄ້າ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຂະໜາດ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ລາຄາ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຈຳນວນ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຍອດໜີ້</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຈ່າຍແລ້ວ</th>
                  <th className="px-4 py-4 text-center text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຊຳລະ</th>
                  <th className="px-4 py-4 text-center text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ສະຖານະ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຜູ້ຊື້</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ຕິດຕໍ່</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ແຂວງ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ເມືອງ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ບ້ານ</th>
                  <th className="px-4 py-4 text-left text-sm sm:text-sm font-semibold text-gray-700 border-b-2 border-gray-200">ໝາຍເຫດ</th>
                </tr>
              </thead>
              <tbody>
                {debtList.length > 0 ? (
                  debtList.map((item, index) => {
                    const paid = parseFloat(getPayAmount(item.id_invoices));
                    const total = parseFloat(item.total);
                    const isPaidOff = paid >= total;

                    return (
                      <tr key={index} className={`transition-all duration-200 hover:bg-gray-50 ${isPaidOff ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400" : "border-l-4 border-transparent"
                        }`}>
                        <td className="px-2 py-2 text-xs sm:text-sm text-gray-600 border-b border-gray-100">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-900 border-b border-gray-100 font-medium">{item.type_products}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100">{item.size_products}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-900 border-b border-gray-100 font-semibold">{item.price}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100 text-center">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">{item.amount}</span>
                        </td>
                        <td className="px-4 py-4 text-sm sm:text-sm border-b border-gray-100">
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {item.total}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm border-b border-gray-100 sm:text-sm">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {paid}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center border-b border-gray-100 sm:text-sm">
                          <button
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${isPaidOff
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                              }`}
                            onClick={() => handlePayClick(item)}
                            disabled={isPaidOff}
                          >
                            ຊຳລະ
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center border-b border-gray-100 sm:text-sm">
                          {isPaidOff ? (
                            <div className="flex items-center justify-center">
                              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span>✓</span>
                                <span>ຈ່າຍແລ້ວ</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <span>⏳</span>
                                <span>ຍັງບໍ່ຈ່າຍ</span>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-900 border-b border-gray-100 font-semibold">{item.user_buy}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100">{item.contect}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100">{item.provinces}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100">{item.districts}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-600 border-b border-gray-100">{item.villages}</td>
                        <td className="px-4 py-4 text-sm sm:text-sm text-gray-500 border-b border-gray-100 italic">{item.note}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="15" className="px-4 py-12 text-center sm:text-sm">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <span className="text-2xl">📄</span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">ບໍ່ພົບຂໍ້ມູນໜີ້</p>
                        <p className="text-gray-400 text-sm mt-1">ກະລຸນາເພີ່ມຂໍ້ມູນໜີ້ເພື່ອເລີ່ມຕົ້ນ</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-3xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>💰</span>
                ຊຳລະໜີ້: {selectedInvoice.user_buy}
              </h2>
            </div>

            <div onSubmit={handleSubmitDebt} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ຍອດໜີ້ທັງໝົດ</label>
                  <input
                    value={selectedInvoice.total}
                    readOnly
                    className="w-full border-2 border-gray-200 p-3 bg-white rounded-xl font-bold text-lg text-red-600 focus:outline-none"
                  />
                </div>

                <div className="bg-blue-50 rounded-2xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ຈ່າຍແລ້ວ</label>
                  <input
                    value={selectedInvoice.paid || 0}
                    readOnly
                    className="w-full border-2 border-blue-200 p-3 bg-white rounded-xl font-bold text-lg text-blue-600 focus:outline-none"
                  />
                </div>

                <div className="bg-green-50 rounded-2xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ຈຳນວນເງິນທີ່ຈ່າຍ (ເພີ່ມ)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full border-2 border-green-200 p-3 rounded-xl font-semibold text-lg focus:border-green-400 focus:outline-none transition-colors"
                    placeholder="ປ້ອນຈຳນວນເງິນ..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ໝາຍເຫດ</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-400 focus:outline-none transition-colors resize-none"
                    rows={3}
                    placeholder="ເພີ່ມໝາຍເຫດ..."
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  onClick={() => setSelectedInvoice(null)}
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleSubmitDebt}
                >
                  ບັນທຶກ
                </button>
              </div>

              {success && (
                <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <p className="text-green-700 font-semibold">{success}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}