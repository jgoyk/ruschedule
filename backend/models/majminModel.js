import mongoose from "mongoose";

const majminSchema = mongoose.Schema(
    {
        majminName: {
            type: String,
            required: true,
        },
        requiredCourses: {
            type: Array,
            required: false,
        },
        electives: {
            type: Array,
            required: false,
        },
        majmin: {
            type: Number,
            required: true,
        }
    }, {
        timestamps: true,
    }
)

export const MajorMinor = mongoose.model('majmin', majminSchema)