const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ChatSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        chats: [
            {
                messagesWith: { type: Schema.Types.ObjectId, ref: "User" },
                messages: [
                    {
                        msg: { type: String, required: true },
                        sender: { type: Schema.Types.ObjectId, ref: "User" },
                        receiver: { type: Schema.Types.ObjectId, ref: "User" },
                        date: { type: Date }
                    }
                ]
            }
        ]
    }
);

module.exports = model("Chat", ChatSchema);
