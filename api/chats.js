const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const ChatModel = require('../models/ChatModel');
const authMiddleware = require('../middleware/authMiddleware');

// obtener todos los chats
router.get('/', authMiddleware, async (req, res) => {
    try {
        const {userId} = req;

        const user = await ChatModel.findOne({ user: userId }).populate("chats.messagesWith");

        let chatsToBeSent = [];
        
        if (user.chats.length > 0) {
            chatsToBeSent = await user.chats.map(chat => ({
                messagesWith: chat.messagesWith._id,
                name: chat.messagesWith.name,
                profilePicUrl: chat.messagesWith.profilePicUrl,
                lastMessage: chat.messages[chat.messages.length - 1].msg,
                date: chat.messages[chat.messages.length - 1].date
            }));
        }

        return res.json(chatsToBeSent);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
});

router.get('/user/:userToFindId', authMiddleware, async (req, res) => {
    try {
       const user = await UserModel.findById(req.params.userToFindId);

       if (!user) {
        return res.status(404).send("Usuario no encontrado");
       }

       return res.json({name: user.name, profilePicUrl: user.profilePicUrl});
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
});

router.delete('/:messagesWith', authMiddleware, async (req, res) => {
    try {
        const {userId} = req;
        const {messagesWith} = req.params;

        const user = await ChatModel.findOne({user: userId});

        const chatToDelete = user.chats.find(
            chat => chat.messagesWith.toString() === messagesWith
        );

        if (!chatToDelete) {
            return res.status(404).send("Chat no encontrado");
        }

        const indexOf = user.chats
            .map(chat => chat.messagesWith.toString())
            .indexOf(messagesWith);

        user.chats.splice(indexOf, 1);

        await user.save();

        return res.status(200).send("Chat eliminado");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error en el servidor");
    }
})

module.exports = router;