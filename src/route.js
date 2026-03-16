import express from "express"
import { waitListController } from "./controllers/waitListController.js"
const router=express.Router()
router.post("/email_endpoint",waitListController.waitlist)
router.get("/system_stats",waitListController.system_stats)
//router.get("/waiters",waitListController.getWaitlist)
export default router