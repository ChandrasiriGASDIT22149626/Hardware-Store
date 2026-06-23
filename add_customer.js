import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function addCustomers() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    // 1. Define new customers to insert
    const newCustomers = [
      {
        id: 'c_' + Date.now() + '_1',
        name: 'Amshi',
        email: 'amshi@gmail.com',
        phone: '077-1234567',
        address: 'Colombo, Sri Lanka',
        loyaltyPoints: 120,
        totalPurchases: 2500.0,
        joinDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 'c_' + Date.now() + '_2',
        name: 'Krish',
        email: 'krish@gmail.com',
        phone: '077-7654321',
        address: 'Negombo, Sri Lanka',
        loyaltyPoints: 85,
        totalPurchases: 1800.0,
        joinDate: new Date().toISOString().split('T')[0]
      }
    ];

    // 2. Insert into customers table
    for (const c of newCustomers) {
      // Check if already exists to prevent duplicate test runs
      const existing = await db.get('SELECT id FROM customers WHERE name = ?', [c.name]);
      if (existing) {
        console.log(`⚠️ Customer '${c.name}' already exists in database.`);
        continue;
      }

      await db.run(
        'INSERT INTO customers (id, name, email, phone, address, loyalty_points, total_purchases, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [c.id, c.name, c.email, c.phone, c.address, c.loyaltyPoints, c.totalPurchases, c.joinDate]
      );
      console.log(`✅ Successfully added customer: ${c.name}`);
    }

    await db.close();
  } catch (error) {
    console.error('Error modifying database:', error);
  }
}

addCustomers();
