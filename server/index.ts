import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import session, { SessionData } from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: { username: string; user_id: string };
  }
}
import mongoose from 'mongoose';
import dotenv from 'dotenv';
mongoose.connect(dotenv.config().parsed?.DATABASE_URI as string);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(`Database error: ${error}`)
})

database.once('connected', () => {
    console.log('Connected to database')
})

const app: Express = express()
const PORT = 4000

app.use(cors())
app.use(session({
    secret: 'thisismysecretkey',
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}, // 24 hours
    resave: false
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


import userRoutes from './routes/userRoutes'
app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
