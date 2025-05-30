import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     ca: fs.readFileSync(path.resolve('certs', 'aiven-ca.pem')).toString(),
//   },
// });

// export { pool };

const sslConfig = process.env.PG_CA_CERT
  ? { ca: process.env.PG_CA_CERT.replace(/\\n/g, '\n') }
  : { rejectUnauthorized: false }; // fallback for local dev

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});