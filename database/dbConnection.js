import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "mern_stack_job_seeking"
        });

        console.log(`mongodb conneted ${conn.connection.host}`)

    } catch (error) {
        console.log(`ERROR OCCURED WHILE CONNECTED DB${error}`)
        process.exit(1);
    }

}