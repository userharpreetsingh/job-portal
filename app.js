import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "../backend/routes/userRoute.js"
import applicationRouter from "../backend/routes/applicationRouter.js"
import jobRouter from "../backend/routes/jobRouter.js"
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";




 const app = express();

 dotenv.config({path:"./config/config.env"})

 app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true,
    methods:['GET','PUT','POST','DELETE'],
 }))

 app.use(cookieParser())

app.use(express.json())

app.use(express.urlencoded({extended:true}))


app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/temp/",
    }
))

app.use("/api/v1/user",userRouter)
app.use("/api/v1/job",jobRouter)
app.use("/api/v1/application",applicationRouter)

dbConnection();



app.use(errorMiddleware)
 export default app;