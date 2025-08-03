const db = require('../Config/db');

exports.getTotalSales = async (req, res) => {
  try {
    const shopResult = await db.query('SELECT SUM(total) AS shop_total FROM shop');
    const invoiceResult = await db.query('SELECT SUM(total) AS invoice_total FROM invoice');

    const shopTotal = shopResult[0].shop_total || 0;
    const invoiceTotal = invoiceResult[0].invoice_total || 0;
    const totalSales = shopTotal + invoiceTotal;

    res.json({
      shop_total: shopTotal,
      invoice_total: invoiceTotal,
      total_sales: totalSales
    });
  } catch (err) {
    console.error('🔥 SQL Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};


exports.getMTS = async (req, res) => {
  try {
    const shopResult = await db.query(`
      SELECT SUM(total) AS shop_total 
      FROM shop 
      WHERE MONTH(created_at) = MONTH(CURDATE()) 
        AND YEAR(created_at) = YEAR(CURDATE())
    `);

    const invoiceResult = await db.query(`
      SELECT SUM(total) AS invoice_total 
      FROM invoice
      WHERE MONTH(created_at) = MONTH(CURDATE()) 
        AND YEAR(created_at) = YEAR(CURDATE())
    `);

    const shopTotal = shopResult[0].shop_total || 0;
    const invoiceTotal = invoiceResult[0].invoice_total || 0;
    const totalSales = shopTotal + invoiceTotal;

    res.json({
      month: new Date().toLocaleString('default', { month: 'long' }),
      shop_total: shopTotal,
      invoice_total: invoiceTotal,
      total_sales: totalSales
    });
  } catch (err) {
    console.error('🔥 SQL Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};



exports.getLatestTotalSales = async (req, res) => {
  try {
    const shopResult = await db.query(`
      SELECT total FROM shop ORDER BY created_at DESC LIMIT 1
    `);

    const invoiceResult = await db.query(`
      SELECT total FROM invoice ORDER BY created_at DESC LIMIT 1
    `);

    const latestShopTotal = shopResult.length > 0 ? shopResult[0].total : 0;
    const latestInvoiceTotal = invoiceResult.length > 0 ? invoiceResult[0].total : 0;
    const total = latestShopTotal + latestInvoiceTotal;

    res.json({
      latest_shop_total: latestShopTotal,
      latest_invoice_total: latestInvoiceTotal,
      latest_combined_total: total
    });
  } catch (err) {
    console.error('🔥 SQL Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};


// controllers/sale_check_chart.js
exports.getChartData = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        SUM(total) AS amount
      FROM (
        SELECT total, created_at FROM shop
        WHERE YEAR(created_at) = YEAR(CURDATE())

        UNION ALL

        SELECT total, created_at FROM invoice
        WHERE YEAR(created_at) = YEAR(CURDATE())
      ) AS combined_data
      GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY MONTH(created_at)
    `);

    res.json(result);
  } catch (err) {
    console.error("🔥 Chart Data Error:", err.message);
    res.status(500).json({ error: 'Internal Server Error', detail: err.message });
  }
};
