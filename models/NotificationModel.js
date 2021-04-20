const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const NotificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    notifications: [
        {
            type: { type: String, enum: ["newLike", "newComment", "newFollower"] },
            user: { type: Schema.Types.ObjectId, ref: "User" },
            post: { type: Schema.Types.ObjectId, ref: "Post" },
            commentId: { type: String },
            text: { type: String },
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = model("Notification", NotificationSchema);
