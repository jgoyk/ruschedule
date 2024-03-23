import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        major: {
            type: Number,
            required: false,
        },
        minor: {
            type: Number,
            required: false ,
        },
        courses: {
            type: Array,
            required: false,
        }
    }, {
        timestamps: true,
    }
)

export const User = mongoose.model('user', userSchema)