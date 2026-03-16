import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "../.env") })
const mongo_uri=process.env.MONGO_URI
const databaseConnection=async()=>{
    if (!mongo_uri) {
        console.error("Error: MONGO_URI is not defined in the environment variables. Please check your .env file.")
        return
    }
    try{
       const connection= await mongoose.connect(mongo_uri )
        console.log(`database connected successfully ${connection.connection.host}`)
    }catch(error){
        console.error(`Database Connection Failed: ${error.message}`);
        if (error.code === 8000 || error.codeName === 'AtlasError' || error.message.includes('bad auth')) {
            console.error("Action Required: Please verify the username and password in your 'src/.env' file matches your MongoDB Atlas Database Access credentials.");
        }
    }

}
export default databaseConnection