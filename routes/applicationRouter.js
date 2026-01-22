import express from "express"
import {empolyerGetAllApplications,jobseekerGetAllApplications,jobSeekerDeleteApplication } from "../controller/applicationController.js";
import {isAuthorized} from "../middleware/auth.js"

const router = express.Router()
router.delete("/jobseeker/getall",isAuthorized,jobseekerGetAllApplications)
router.delete("/employer/getall",isAuthorized,empolyerGetAllApplications)
router.delete("/delete/:id",isAuthorized,jobSeekerDeleteApplication)

export default router;