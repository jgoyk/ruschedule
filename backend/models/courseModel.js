import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
    {
        courseString: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
        },
        coreCodes: {
            type: Array,
            required: false,
        },
        credits: {
            type: Number,
            required: false,
        },
        prereqs: {
            type: String,
            required: false,
        },
        semsOffered: {
            type: String,
            required: false,
        }
    }, {
        timestamps: true,
    }
)

export const Course = mongoose.model('course', courseSchema)