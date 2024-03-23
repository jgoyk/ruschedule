import mongodb from "mongodb"
import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js "
import courseRoute from "./routes/courseRoute.js "
import majminRoute from "./routes/majminRoute.js "

dotenv.config()

const app = express();

app.use(express.json())
app.use(cors());

const port = process.env.PORT || 8000

app.get('/', (req,res) => {
    console.log(req);
    return res.status(234).send("Server Running")
});

app.use('/users', userRoute)
app.use('/courses', courseRoute)
app.use('/majmins', majminRoute)

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("App connected to DB")
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        });
    })
    .catch((error) => {
        console.log(error)
    })

