import express from 'express'
import cors from 'cors'
import databaseConnection from './config/db.js'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()
import router from './route.js'
const server=express()
const port=3000
const allowedOrigins=process.env.ALLOWED_ORIGINS? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim()) : []
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // 2. Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
server.use(morgan('dev'))
server.use(cors(corsOptions))
server.use(express.json())
server.use("/api/v1",router)
server.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
    databaseConnection()

})