import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        major: {
            type: String,
            required: false,
        },
        minor: {
            type: String,
            required: false,
        },
        courses: {
            type: Array,
            required: false,
        },
        year: {
            type: String,
            required: false,
        },
        currentSem: {
            type: String,
            required: false,
        }
    }, {
        timestamps: true,
    }
)

export const User = mongoose.model('user', userSchema)