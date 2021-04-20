const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const FollowerSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        followers: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" }
            }
        ],
        following: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" }
            }
        ]
    }
);

module.exports = model("Follower", FollowerSchema);
