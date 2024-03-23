import express from "express"
import { User } from "../models/userModel.js"
const router = express.Router()

router.get('/', async (req,res) => {
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

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        return res.status(201).json({
            count: user.length,
            data: user
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

router.post('/', async(req,res) => {
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

router.put('/:id', async(req,res) => {
    try{
        if(
            !req.body.username 
        ) {
            return res.status(400).send({
                message: "Send username",
            });
        }
        
        const { id } = req.params;
        const result = await User.findByIdAndUpdate(id)
        if (!result){
            return res.status(404).send({ message: "User not found" })
        }

    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

export default router;