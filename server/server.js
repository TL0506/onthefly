import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import tripRoutes from './routes/trips.js'
import activityRoutes from './routes/activities.js'
import destinationRoutes from './routes/destinations.js'
import tripDestinationRoutes from './routes/trips_destinations.js'
import userTripRoutes from './routes/users-trips.js'
import authRoutes from './routes/auth.js'
import { GitHub } from './config/auth.js'

const app = express()

app.set('trust proxy', 1)

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET || 'codepath',
    resave: false,
    saveUninitialized: true,
    cookie: process.env.NODE_ENV === 'production'
        ? { secure: true, sameSite: 'none' }
        : {}
}))

app.use(cors({
    origin: 'https://client-m5na.onrender.com',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(GitHub)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>')
})

app.use('/auth', authRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/trips_destinations', tripDestinationRoutes)
app.use('/api/users-trips', userTripRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
