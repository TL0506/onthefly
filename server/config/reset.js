import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), '../config/data/data.json'))
const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
    const createTripsTableQuery = `
        DROP TABLE IF EXISTS trips CASCADE;

        CREATE TABLE IF NOT EXISTS trips (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            img_url text NOT NULL,
            num_days integer NOT NULL,
            start_date date NOT NULL,
            end_date date NOT NULL,
            total_cost money NOT NULL
        );
    `
    try {
        const res = await pool.query(createTripsTableQuery)
        console.log('🎉 trips table created successfully')
    } catch (err) {
        console.error('⚠️ error creating trips table', err)
    }
}

const seedTripsTable = async () => {
    await createTripsTable()

    tripsData.forEach((trip) => {
        const insertQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        }
        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ]
        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting trip', err)
                return
            }
            console.log(`✅ ${trip.title} added successfully`)
        })
    })
}

const createDestinationsTable = async () => {
    const createDestinationsTableQuery = `
        DROP TABLE IF EXISTS destinations CASCADE;

        CREATE TABLE IF NOT EXISTS destinations (
            id serial PRIMARY KEY,
            destination varchar(100) NOT NULL,
            country varchar(100) NOT NULL,
            img_url text NOT NULL,
            lat numeric(9, 6),
            lng numeric(9, 6)
        );
    `
    try {
        const res = await pool.query(createDestinationsTableQuery)
        console.log('🎉 destinations table created successfully')
    } catch (err) {
        console.error('⚠️ error creating destinations table', err)
    }
}

const createActivitiesTable = async () => {
    const createActivitiesTableQuery = `
        DROP TABLE IF EXISTS activities;

        CREATE TABLE IF NOT EXISTS activities (
            id serial PRIMARY KEY,
            title varchar(100) NOT NULL,
            description varchar(500) NOT NULL,
            num_likes integer DEFAULT 0,
            trip_id integer REFERENCES trips(id)
        );
    `
    try {
        const res = await pool.query(createActivitiesTableQuery)
        console.log('🎉 activities table created successfully')
    } catch (err) {
        console.error('⚠️ error creating activities table', err)
    }
}

const createTripsDestinationsTable = async () => {
    const createTripsDestinationsTableQuery = `
        DROP TABLE IF EXISTS trips_destinations;

        CREATE TABLE IF NOT EXISTS trips_destinations (
            trip_id integer REFERENCES trips(id),
            destination_id integer REFERENCES destinations(id),
            PRIMARY KEY (trip_id, destination_id)
        );
    `
    try {
        const res = await pool.query(createTripsDestinationsTableQuery)
        console.log('🎉 trips_destinations table created successfully')
    } catch (err) {
        console.error('⚠️ error creating trips_destinations table', err)
    }
}

const createUsersTable = async () => {
    const createUsersTableQuery = `
        DROP TABLE IF EXISTS users CASCADE;

        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            githubid int NOT NULL,
            username varchar(200) NOT NULL,
            avatarurl varchar(500),
            accesstoken varchar(500) NOT NULL
        );
    `
    try {
        const res = await pool.query(createUsersTableQuery)
        console.log('🎉 users table created successfully')
    } catch (error) {
        console.error('⚠️ error creating users table', error)
    }
}

const createTripsUsersTable = async () => {
    const createTripsUsersTableQuery = `
        DROP TABLE IF EXISTS trips_users;

        CREATE TABLE IF NOT EXISTS trips_users (
            id serial PRIMARY KEY,
            trip_id integer NOT NULL REFERENCES trips(id),
            username text NOT NULL
        );
    `
    try {
        const res = await pool.query(createTripsUsersTableQuery)
        console.log('🎉 trips_users table created successfully')
    } catch (error) {
        console.error('⚠️ error creating trips_users table', error)
    }
}

seedTripsTable()
createDestinationsTable()
createActivitiesTable()
createTripsDestinationsTable()
createUsersTable()
createTripsUsersTable()
