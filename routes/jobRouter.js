import express from "express"
import { deleteJob, getAllJobs, getMyJobs, updateJob } from "../controller/jobController.js";
import { isAuthorized } from "../middleware/auth.js";
import { postJob } from "../controller/jobController.js";

const router = express.Router()

router.get("/getall",getAllJobs)
router.post("/post",isAuthorized,postJob)
router.get("/getmyjobs",isAuthorized,getMyJobs)
router.put("/update/:id",isAuthorized,updateJob)
router.delete("/delete/:id",isAuthorized,deleteJob)

export default router;