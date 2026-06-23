import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function seedHistory() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    console.log('🌱 Adding premium dynamic sales history to local SQLite...');

    // 1. Delete all mock sales from 2024 and mock transactions
    await db.run("DELETE FROM sales WHERE invoice_no IN ('INV-2024-001', 'INV-2024-002')");
    await db.run("DELETE FROM transactions WHERE id IN ('t1', 't2', 't3')");

    // 2. Define historical sales covering the last 6 months (Dec 2025 to May 2026)
    // Jan: 18,500, Feb: 22,300, Mar: 19,800, Apr: 25,600, May: 28,900, Dec: 14,200
    const sales = [
      {
        id: 'so_dec2025', invoice_no: 'INV-2025-1201', customer_id: 'c1', customer_name: 'John Smith',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 150, price: 89.99, total: 13498.50, taxRate: 8 }
        ]),
        subtotal: 13498.50, discount: 0, tax: 701.50, tax_rate: 8, total_amount: 14200.00, status: 'paid', user_id: 'u1', created_at: '2025-12-15T10:00:00Z'
      },
      {
        id: 'so_jan2026', invoice_no: 'INV-2026-0101', customer_id: 'c2', customer_name: 'Maria Garcia',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 200, price: 89.99, total: 17998.00, taxRate: 8 }
        ]),
        subtotal: 17998.00, discount: 500.0, tax: 1002.00, tax_rate: 8, total_amount: 18500.00, status: 'paid', user_id: 'u1', created_at: '2026-01-18T10:00:00Z'
      },
      {
        id: 'so_feb2026', invoice_no: 'INV-2026-0201', customer_id: 'c3', customer_name: 'Bob Johnson',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 240, price: 89.99, total: 21597.60, taxRate: 8 }
        ]),
        subtotal: 21597.60, discount: 500.0, tax: 1202.40, tax_rate: 8, total_amount: 22300.00, status: 'paid', user_id: 'u1', created_at: '2026-02-20T11:00:00Z'
      },
      {
        id: 'so_mar2026', invoice_no: 'INV-2026-0301', customer_id: 'c4', customer_name: 'Sarah Williams',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 210, price: 89.99, total: 18897.90, taxRate: 8 }
        ]),
        subtotal: 18897.90, discount: 200.0, tax: 1102.10, tax_rate: 8, total_amount: 19800.00, status: 'paid', user_id: 'u1', created_at: '2026-03-15T09:30:00Z'
      },
      {
        id: 'so_apr2026', invoice_no: 'INV-2026-0401', customer_id: 'c1', customer_name: 'John Smith',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 275, price: 89.99, total: 24747.25, taxRate: 8 }
        ]),
        subtotal: 24747.25, discount: 500.0, tax: 1352.75, tax_rate: 8, total_amount: 25600.00, status: 'paid', user_id: 'u1', created_at: '2026-04-22T14:15:00Z'
      },
      {
        id: 'so_may2026', invoice_no: 'INV-2026-0501', customer_id: 'c2', customer_name: 'Maria Garcia',
        items: JSON.stringify([
          { productId: 'p1', productName: 'Power Drill 18V', qty: 310, price: 89.99, total: 27896.90, taxRate: 8 }
        ]),
        subtotal: 27896.90, discount: 600.0, tax: 1603.10, tax_rate: 8, total_amount: 28900.00, status: 'paid', user_id: 'u1', created_at: '2026-05-12T16:00:00Z'
      }
    ];

    for (const s of sales) {
      await db.run(
        'INSERT OR REPLACE INTO sales (id, invoice_no, customer_id, customer_name, items, subtotal, discount, tax, tax_rate, total_amount, status, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [s.id, s.invoice_no, s.customer_id, s.customer_name, s.items, s.subtotal, s.discount, s.tax, s.tax_rate, s.total_amount, s.status, s.user_id, s.created_at]
      );
    }

    // 3. Define matching transactions covering the income/expense trend
    const transactions = [
      { id: 't_dec2025_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2025-1201', amount: 14200.00, date: '2025-12-15', reference: 'INV-2025-1201', user_id: 'u1' },
      { id: 't_dec2025_ex', type: 'expense', category: 'Utilities', description: 'Electricity Bill', amount: 3500.00, date: '2025-12-16', reference: 'BILL-DEC', user_id: 'u1' },
      
      { id: 't_jan2026_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2026-0101', amount: 18500.00, date: '2026-01-18', reference: 'INV-2026-0101', user_id: 'u1' },
      { id: 't_jan2026_ex', type: 'expense', category: 'Rent', description: 'Store Monthly Rent', amount: 5000.00, date: '2026-01-05', reference: 'RENT-JAN', user_id: 'u1' },
      
      { id: 't_feb2026_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2026-0201', amount: 22300.00, date: '2026-02-20', reference: 'INV-2026-0201', user_id: 'u1' },
      { id: 't_feb2026_ex', type: 'expense', category: 'Rent', description: 'Store Monthly Rent', amount: 5000.00, date: '2026-02-05', reference: 'RENT-FEB', user_id: 'u1' },
      
      { id: 't_mar2026_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2026-0301', amount: 19800.00, date: '2026-03-15', reference: 'INV-2026-0301', user_id: 'u1' },
      { id: 't_mar2026_ex', type: 'expense', category: 'Rent', description: 'Store Monthly Rent', amount: 5000.00, date: '2026-03-05', reference: 'RENT-MAR', user_id: 'u1' },
      
      { id: 't_apr2026_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2026-0401', amount: 25600.00, date: '2026-04-22', reference: 'INV-2026-0401', user_id: 'u1' },
      { id: 't_apr2026_ex', type: 'expense', category: 'Rent', description: 'Store Monthly Rent', amount: 5000.00, date: '2026-04-05', reference: 'RENT-APR', user_id: 'u1' },
      
      { id: 't_may2026_in', type: 'income', category: 'Sales', description: 'POS Card Sale INV-2026-0501', amount: 28900.00, date: '2026-05-12', reference: 'INV-2026-0501', user_id: 'u1' },
      { id: 't_may2026_ex', type: 'expense', category: 'Rent', description: 'Store Monthly Rent', amount: 5000.00, date: '2026-05-05', reference: 'RENT-MAY', user_id: 'u1' }
    ];

    for (const t of transactions) {
      await db.run(
        'INSERT OR REPLACE INTO transactions (id, type, category, description, amount, date, reference, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [t.id, t.type, t.category, t.description, t.amount, t.date, t.reference, t.user_id]
      );
    }

    console.log('✅ Premium dynamic sales history successfully seeded!');
    await db.close();
  } catch (error) {
    console.error('❌ Failed to seed history:', error);
  }
}

seedHistory();
