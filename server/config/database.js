import pg from 'pg'
import './dotenv.js'

const { Pool } = pg

export const pool = new Pool({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    ssl: { rejectUnauthorized: false }
})
