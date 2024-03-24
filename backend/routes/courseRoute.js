import express from "express"
import { Course } from "../models/courseModel.js"
const router = express.Router()

//get all
router.get('/', async (req,res) => {
    try {
        const courses = await Course.find({})
        return res.status(201).json({
            count: courses.length,
            data: courses
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
        const course = await Course.findById(id)
        return res.status(201).json({
            count: course.length,
            data: course
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

router.get('/search/:term', async (req,res) => {
    try {
        const searchTerm = req.params.term;
        const regex = new RegExp(searchTerm, 'i');
        const courses = await Course.find({ title: { $regex: regex } });
        return res.status(201).json({
            count: course.length,
            data: course
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})


export default router;