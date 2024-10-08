import express from "express"
import { MajorMinor } from "../models/majminModel.js"
const router = express.Router()

//get all
router.get('/', async (req,res) => {
    try {
        const majmins = await MajorMinor.find({})
        return res.status(201).json({
            count: majmins.length,
            data: majmins
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

//get by id
router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const majmin = await MajorMinor.find({programCode: id})
        return res.status(201).json(majmin)
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

export default router;