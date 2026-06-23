import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'hardware.db');

async function updateAdmin() {
  try {
    const db = await open({
      filename: DB_FILE,
      driver: sqlite3.Database
    });

    // 1. Add password column to active DB if not already present
    try {
      await db.exec("ALTER TABLE profiles ADD COLUMN password TEXT DEFAULT '123456'");
      console.log('✅ Added password column to profiles table.');
    } catch (e) {
      console.log('ℹ️ Password column already exists in database.');
    }

    // 2. Update the super_admin profile to set password sanoj123
    const result = await db.run(
      "UPDATE profiles SET email = ?, name = ?, avatar = ?, password = ? WHERE role = 'super_admin' OR id = 'u1'",
      ['sanojhardware@gmail.com', 'Sanoj Hardware', 'S', 'sanoj123']
    );

    console.log('✅ Database admin password updated successfully!');
    console.log(`Rows modified: ${result.changes}`);

    // Verify change
    const profile = await db.get("SELECT * FROM profiles WHERE id = 'u1'");
    console.log('Verified Profile Row:', profile);

    await db.close();
  } catch (error) {
    console.error('Error modifying database:', error);
  }
}

updateAdmin();
