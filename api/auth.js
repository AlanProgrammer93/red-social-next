const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const FollowerModel = require('../models/FollowerModel');
const NotificationModel = require('../models/NotificationModel');
const ChatModel = require('../models/ChatModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/", authMiddleware, async (req, res) => {
    const {userId} = req;

    try {
        const user = await UserModel.findById(userId);
        const userFollowStats = await FollowerModel.findOne({user: userId});

        return res.status(200).json({ user, userFollowStats });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
})

router.post("/", async (req, res) => {
    const { email, password } = req.body.user;

    if (!isEmail(email)) return res.status(401).send("Email invalido");

    if (password.length < 6) return res.status(401).send("La contraseña debe tener al menos 6 caracteres");

    try {
        const user = await UserModel.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).send("Credenciales Invalidas");
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).send("Credenciales Invalidas");
        }

        const notificationModel = await NotificationModel.findOne({ user: user._id });

        if (!notificationModel) {
            await new NotificationModel({ user: user._id, notifications: [] }).save();
        }

        const payload = { userId: user._id };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err) throw err;
            res.status(200).json(token);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error en el servidor");
    }
})

module.exports = router;
