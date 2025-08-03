const db = require('../Config/db');

exports.createInspection = async (req, res) => {
    console.log(req.body)
    const {
        type_products,
        size_products,
        amount,
        amount_a,
        amount_b,
        note,
        id_drying,
        id_improvement,
        data_source,
         user
    } = req.body;

    try {
        await db.beginTransaction();

        // ตรวจสอบข้อมูลต้นทางตาม data_source
        if (data_source === 'drying' && id_drying) {
            // ตรวจสอบ drying ที่เลือก
            const dryingExists = await db.query('SELECT * FROM drying WHERE id_drying = ?', [id_drying]);
            if (dryingExists.length === 0) {
                await db.rollback();
                return res.status(400).json({ error: 'ไม่พบข้อมูลการอบแห้งที่เลือก' });
            }

            // ตรวจสอบสถานะ drying
            if (dryingExists[0].status === 'ກວດສອບແລ້ວ') {
                await db.rollback();
                return res.status(400).json({ error: 'ลายการนี้ถูกตรวจสอบแล้ว ไม่สามารถตรวจสอบซ้ำได้' });
            }
        } else if (data_source === 'improvement' && id_improvement) {
            // ตรวจสอบ improvement ที่เลือก
            const improvementExists = await db.query('SELECT * FROM improvement WHERE id_imporvement = ?', [id_improvement]);
            if (improvementExists.length === 0) {
                await db.rollback();
                return res.status(400).json({ error: 'ไม่พบข้อมูลการปรับปรุงที่เลือก' });
            }
        }

        // บันทึก inspection
        const sqlInsert = `
            INSERT INTO inspection (
                type_products, 
                size_products, 
                amount, 
                amount_a, 
                amount_b, 
                note, 
                status, 
                id_drying, 
                id_improvement, 
                data_source,
                user
            )
            VALUES (?, ?, ?, ?, ?, ?, 'ກວດສອບແລ້ວ', ?, ?, ?, ?)
        `;

        const result = await db.query(sqlInsert, [
            type_products,
            size_products,
            amount,
            amount_a,
            amount_b,
            note,
            id_drying || null,
            id_improvement || null,
            data_source || 'drying',
             user
        ]);

        console.log('✅ บันทึก inspection สำเร็จ ID:', result.insertId);

        // อัปเดตสถานะตามประเภทข้อมูล
        if (data_source === 'drying' && id_drying) {
            await db.query('UPDATE drying SET status = "ກວດສອບແລ້ວ" WHERE id_drying = ?', [id_drying]);
            console.log('✅ อัปเดตสถานะ drying สำเร็จ');
        } else if (data_source === 'improvement' && id_improvement) {
            await db.query('UPDATE improvement SET status = "ນຳໄປກວດສອບແລ້ວ" WHERE id_imporvement = ?', [id_improvement]);
            console.log('✅ อัปเดตสถานะ improvement สำเร็จ');
        }

        // 🔍 ค้นหา products ที่มี type และ size ตรงกับ inspection
        const findProductSql = `
            SELECT p.* 
            FROM products p
            LEFT JOIN type_products t ON p.id_type_products = t.id_type_products
            LEFT JOIN size_products s ON p.id_size_products = s.id_size_products
            WHERE t.type_products = ? AND s.size_products = ?
        `;

        const matchingProducts = await db.query(findProductSql, [type_products, size_products]);

        if (matchingProducts.length > 0) {
            // อัปเดตจำนวนของทุก products ที่ตรงกัน
            for (const product of matchingProducts) {
                const newAmount = (product.amount_products || 0) + (amount_a || 0);

                await db.query(
                    'UPDATE products SET amount_products = ? WHERE id_products = ?',
                    [newAmount, product.id_products]
                );

                console.log(`✅ อัปเดต product ID ${product.id_products}: ${product.amount_products} + ${amount_a} = ${newAmount}`);
            }

            console.log(`📦 อัปเดต ${matchingProducts.length} products ที่มี type: ${type_products}, size: ${size_products}`);
        } else {
            console.log(`ℹ️ ไม่พบ products ที่มี type: ${type_products}, size: ${size_products}`);
        }

        await db.commit();

        res.status(201).json({
            success: true,
            message: 'ບັນທຶກສຳເລັດ',
            inspection_id: result.insertId,
            data_source: data_source,
            drying_status_updated: data_source === 'drying' ? true : false,
            improvement_status_updated: data_source === 'improvement' ? true : false,
            products_updated: matchingProducts.length,
            products_updated_details: matchingProducts.map(p => ({
                product_id: p.id_products,
                old_amount: p.amount_products,
                added_amount: amount_a,
                new_amount: (p.amount_products || 0) + (amount_a || 0)
            }))
        });

    } catch (err) {
        await db.rollback();
        console.error("❌ CREATE INSPECTION ERROR:", err);
        res.status(500).json({
            error: 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງ',
            details: err.message
        });
    }
};

// GET: Drying ที่รอตรวจสอบ
exports.getDryingReadyForInspection = async (req, res) => {
    try {
        const sql = `
            SELECT id_drying, type_drying, size_drying, amount_drying, time_start, time_end
            FROM drying 
            WHERE status = 'ກວດສອບ'
            ORDER BY id_drying DESC
        `;
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error("❌ Get drying for inspection error:", err);
        res.status(500).json({ error: "ดึงข้อมูลไม่สำเร็จ" });
    }
};

// GET: All Inspections (Updated to include data source info)
exports.getAllInspections = async (req, res) => {
    try {
        const results = await db.query(`
            SELECT 
                i.*, 
                d.type_drying, 
                d.size_drying,
                imp.type_inspection,
                imp.size as improvement_size
            FROM inspection i
            LEFT JOIN drying d ON i.id_drying = d.id_drying
            LEFT JOIN improvement imp ON i.id_improvement = imp.id_imporvement
            ORDER BY i.id_inspection DESC
        `);
        res.json(results);
    } catch (err) {
        console.error("❌ Get all inspections error:", err);
        res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
    }
};

// GET: Inspection by ID (Updated to include data source info)
exports.getInspectionById = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query(`
            SELECT 
                i.*, 
                d.type_drying, 
                d.size_drying, 
                d.amount_drying,
                imp.type_inspection,
                imp.size as improvement_size,
                imp.amount_update
            FROM inspection i
            LEFT JOIN drying d ON i.id_drying = d.id_drying
            LEFT JOIN improvement imp ON i.id_improvement = imp.id_imporvement
            WHERE i.id_inspection = ?
        `, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลการตรวจสอบ' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error("❌ Get inspection by ID error:", err);
        res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
    }
};

// DELETE: Inspection
exports.deleteInspection = async (req, res) => {
    const { id } = req.params;

    try {
        const existingInspection = await db.query('SELECT * FROM inspection WHERE id_inspection = ?', [id]);
        if (existingInspection.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }

        await db.query('DELETE FROM inspection WHERE id_inspection = ?', [id]);
        res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
    } catch (err) {
        console.error("❌ Delete inspection error:", err);
        res.status(500).json({ error: 'ลบข้อมูลไม่สำเร็จ' });
    }
};

// GET: Improved Inspections (Updated function name and query)
exports.getImprovedInspections = async (req, res) => {
    try {
        const sql = `
            SELECT 
                * 
            FROM  
                improvement 
            WHERE status = 'ປັບປຸງແລ້ວ'
            ORDER BY id_imporvement DESC
        `;
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error("❌ Get improved inspections error:", err);
        res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
    }
};