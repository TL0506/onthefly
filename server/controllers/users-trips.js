import { pool } from '../config/database.js'

const createTripUser = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const { username } = req.body

        const results = await pool.query(
            'INSERT INTO trips_users (trip_id, username) \
            VALUES($1, $2) \
            RETURNING *',
            [trip_id, username]
        )

        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getTripUsers = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)

        const results = await pool.query(
            'SELECT * FROM trips_users WHERE trip_id = $1',
            [trip_id]
        )

        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getUserTrips = async (req, res) => {
    try {
        const username = req.params.username

        const results = await pool.query(
            'SELECT t.* FROM trips_users tu, trips t \
            WHERE tu.trip_id = t.id \
            AND tu.username = $1',
            [username]
        )

        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    createTripUser,
    getTripUsers,
    getUserTrips
}
