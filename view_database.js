import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function dumpDatabase() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    console.log('\n======================================================');
    console.log('📊 MUTHUWADIGE HARDWARE - LOCAL SQLITE DATABASE DUMP');
    console.log('======================================================');

    // 1. Show Runtime Settings
    console.log('\n⚙️  SYSTEM SETTINGS (RUNTIME-BACKED):');
    console.log('System settings are now stored in memory by the server and are not persisted in hardware.db.');

    // 2. Show Preseeded Profiles (Staff Logins)
    console.log('\n👥 STAFF PROFILES:');
    const profiles = await db.all('SELECT id, name, email, role FROM profiles');
    console.table(profiles);

    // 3. Show Products Inventory
    console.log('\n📦 INVENTORY PRODUCTS (Top 5):');
    const products = await db.all('SELECT id, sku, name, category, price, stock, unit FROM products LIMIT 5');
    console.table(products);

    // 4. Show Customers list
    console.log('\n🤝 LOYALTY CUSTOMERS (Top 5):');
    const customers = await db.all('SELECT id, name, phone, loyalty_points, total_purchases FROM customers LIMIT 5');
    console.table(customers);

    // 5. Show Sales Orders
    console.log('\n🧾 TRANSACTIONS / SALES ORDERS (Top 5):');
    const sales = await db.all('SELECT invoice_no, customer_name, subtotal, discount, tax, total_amount, created_at FROM sales ORDER BY created_at DESC LIMIT 5');
    console.table(sales);

    console.log('\n💡 Tip: To view the full database visually, download "DB Browser for SQLite" from sqlitebrowser.org or install the "SQLite Viewer" VS Code extension!');
    console.log('======================================================\n');
    await db.close();
  } catch (error) {
    console.error('Error reading database:', error);
  }
}

dumpDatabase();
