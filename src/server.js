import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import databaseConnection from './config/db.js'
import morgan from 'morgan'
import router from './route.js'
import waitList from './model/waitList.js'
const server=express()
const port=process.env.PORT || 3000
// Keep ALLOWED_ORIGINS in Render updated with deployed frontend origins to avoid CORS blocks.
const allowedOrigins=process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim()) : []
const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // 2. Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app')) {
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

// Health check endpoint for Render
server.get('/', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

server.listen(port,()=>{
    console.log(`server is running on port http://localhost:${port}`)
    databaseConnection()

    // Keep-alive ping to prevent Render free tier from sleeping
    const pingUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
    setInterval(async () => {
        try {
            const response = await fetch(pingUrl);
            const dbase=await waitList.countDocuments()
            console.log(`Keep-alive ping to ${pingUrl}: ${response.status} database working ${dbase}`);
        } catch (error) {
            console.error(`Keep-alive ping failed: ${error.message}`);
        }
    }, 60 * 1000); 
})
