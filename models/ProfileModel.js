const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ProfileSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        bio: { type: String, required: true },
        social: { 
            youtube: { type: String },
            twitter: { type: String },
            facebook: { type: String },
            instagram: { type: String }
        },

    },
    { timestamps: true }
);

module.exports = model("Profile", ProfileSchema);
