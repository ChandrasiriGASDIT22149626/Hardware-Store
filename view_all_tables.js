import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function dumpAllTables() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    console.log('\n======================================================================');
    console.log('📊 MUTHUWADIGE HARDWARE ERP - COMPLETE DATABASE TABLE EXPLORER');
    console.log('======================================================================\n');

    const tables = [
      { name: 'profiles', emoji: '👥', title: 'USER PROFILES / STAFF LOGINS' },
      { name: 'products', emoji: '📦', title: 'INVENTORY PRODUCTS' },
      { name: 'customers', emoji: '🤝', title: 'LOYALTY CUSTOMERS' },
      { name: 'sales', emoji: '🧾', title: 'SALES ORDERS / INVOICES' },
      { name: 'purchase_orders', emoji: '📥', title: 'PURCHASE ORDERS' }
    ];

    for (const table of tables) {
      console.log(`\n${table.emoji} ${table.title} (Table: '${table.name}'):`);
      const rows = await db.all(`SELECT * FROM ${table.name}`);
      if (rows && rows.length > 0) {
        console.table(rows);
      } else {
        console.log(`  (No records found in table '${table.name}')`);
      }
      console.log('----------------------------------------------------------------------');
    }

    console.log('\n💡 Tip: To query the database visually or run custom SQL statements,');
    console.log('   install the "SQLite Viewer" extension in VS Code or download DB Browser for SQLite!\n');

    await db.close();
  } catch (error) {
    console.error('Error reading database tables:', error);
  }
}

dumpAllTables();
