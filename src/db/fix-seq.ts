import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  try {
    const query = sql`SELECT setval(pg_get_serial_sequence('event', 'id'), COALESCE(MAX(id), 1) + 1, false) FROM event;`;
    await db.execute(query);
    console.log("Sequence updated successfully!");
  } catch (error) {
    console.error("Error updating sequence:", error);
  }
  process.exit(0);
}

main();
