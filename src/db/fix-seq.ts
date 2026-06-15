import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  const tables = ['event', 'kategori', 'provinsi', 'kota', 'users', 'pendaftaran', 'peserta', 'paper_submission', 'penulis_paper', 'jadwal_event', 'pembicara'];
  try {
    for (const table of tables) {
      const query = sql.raw(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM "${table}";`);
      await db.execute(query);
      console.log(`Sequence for ${table} updated successfully!`);
    }
  } catch (error) {
    console.error("Error updating sequence:", error);
  }
  process.exit(0);
}

main();
