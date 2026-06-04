const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    await client.query(`ALTER TABLE paper_submission ALTER COLUMN penulis TYPE jsonb USING json_build_array(json_build_object('nama', penulis, 'email', '', 'afiliasi', '', 'isCorresponding', true));`);
    console.log("Success");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
