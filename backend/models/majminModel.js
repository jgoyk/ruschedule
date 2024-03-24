import mongoose from "mongoose";

const majminSchema = mongoose.Schema(
    {
        majminName: {
            type: String,
            required: true,
        },
        programType: {
            type: Number, //2 = both, 1 = major only, 0 = minor only
            required: true,
        },
        programCode: {
            type: String,
            required: true,
        },
        school: {
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
        }
    }, {
        timestamps: true,
    }
)

export const MajorMinor = mongoose.model('majmin', majminSchema)