import { pool } from '../config/database.js'

const createDestination = async (req, res) => {
    try {
        const { destination, country, img_url, lat, lng } = req.body
        const results = await pool.query(
            'INSERT INTO destinations (destination, country, img_url, lat, lng) \
            VALUES ($1, $2, $3, $4, $5) \
            RETURNING *',
            [destination, country, img_url, lat, lng]
        )
        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getDestinations = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM destinations ORDER BY id ASC')
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getDestination = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query(
            'SELECT * FROM destinations WHERE id = $1',
            [id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const updateDestination = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { destination, country, img_url, lat, lng } = req.body
        const results = await pool.query(
            'UPDATE destinations \
            SET destination = $1, country = $2, img_url = $3, lat = $4, lng = $5 \
            WHERE id = $6 \
            RETURNING *',
            [destination, country, img_url, lat, lng, id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const deleteDestination = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const results = await pool.query(
            'DELETE FROM destinations WHERE id = $1 RETURNING *',
            [id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    createDestination,
    getDestinations,
    getDestination,
    updateDestination,
    deleteDestination
}
