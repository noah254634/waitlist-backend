import { exists } from "fs";
import mongoose from "mongoose";
const Schema=mongoose.Schema
const waitListSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['buyer','annotator'],
        default:'annotator'
    },
    position:{
        type:Number,
        default:0
    },
    exists:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})
export default mongoose.model("WaitList",waitListSchema)