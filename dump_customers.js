import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function showAllCustomers() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    const customers = await db.all('SELECT * FROM customers');
    console.log('--- ALL CUSTOMERS IN DATABASE ---');
    console.table(customers);
    
    await db.close();
  } catch (error) {
    console.error('Error reading database:', error);
  }
}

showAllCustomers();
