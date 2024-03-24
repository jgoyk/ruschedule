import mongoose from "mongoose";

const majminSchema = mongoose.Schema(
    {
        majminName: {
            type: String,
            required: true,
        },
        programType: {
            type: Number, //2 = both, 1 = major only, 0 = minor only
            required: false,
        },
        programCode: {
            type: String,
            required: false,
        },
        school: {
            type: String,
            required: false,
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

export const MajorMinor = mongoose.model('majorsminors', majminSchema)