import mongodb from "mongodb"
import dotenv from "dotenv"
import mongoose from "mongoose"
import express from "express";
import { User } from "./models/userModel.js";

dotenv.config()

const app = express();

app.use(express.json())

const port = process.env.PORT || 8000

app.get('/', (req,res) => {
    console.log(req);
    return res.status(234).send("Server Running")
});

app.get('/users', async (req,res) => {
    try {
        const users = await User.find({})
        return res.status(201).json({
            count: users.length,
            data: users
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

app.post('/user', async(req,res) => {
    try{
        if(
            !req.body.username 
        ) {
            return res.status(400).send({
                message: "send username",
            });
        }
        const newUser = {
            username: req.body.username
        }

        const user = await User.create(newUser)
        return res.status(201).send(user)
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})


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

