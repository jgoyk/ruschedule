import mongodb from "mongodb"
import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express";
dotenv.config()

const app = express();
const port = process.env.PORT || 8000

app.get('/', (req,res) => {
    console.log(req);
    return response.status(234).send("Server Running")
});



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

