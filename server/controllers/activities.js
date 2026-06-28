import { pool } from '../config/database.js'

const createActivity = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const { title, description } = req.body
        const results = await pool.query(
            'INSERT INTO activities (title, description, num_likes, trip_id) \
            VALUES ($1, $2, $3, $4) \
            RETURNING *',
            [title, description, 0, trip_id]
        )
        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getActivities = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM activities ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getTripActivities = async (req, res) => {
    try {
        const trip_id = parseInt(req.params.trip_id)
        const results = await pool.query(
            'SELECT * FROM activities WHERE trip_id = $1 ORDER BY id ASC',
            [trip_id]
        )
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const updateActivityLikes = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query(
            'UPDATE activities SET num_likes = num_likes + 1 WHERE id = $1 RETURNING *',
            [id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const deleteActivity = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query(
            'DELETE FROM activities WHERE id = $1 RETURNING *',
            [id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    createActivity,
    getActivities,
    getTripActivities,
    updateActivityLikes,
    deleteActivity
}
