const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const ProfileModel = require('../models/ProfileModel');
const FollowerModel = require('../models/FollowerModel');
const NotificationModel = require('../models/NotificationModel');
const ChatModel = require('../models/ChatModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const userPng = "https://res.cloudinary.com/alanpragrammer/image/upload/v1618710872/avatar-default_r8kyqw.png";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    try {
        if (username.length < 1) return res.status(401).send("Invalido");

        if (!regexUserName.test(username)) return res.status(401).send("Invalido");

        const user = await UserModel.findOne({ username: username.toLowerCase() });

        if (user) return res.status(401).send("Username ya está en uso");

        return res.status(200).send("Disponible");

    } catch (error) {
        console.error(error);
        return res.status(500).send(`Error en servidor`);
    }
});

router.post("/", async (req, res) => {
    
    const {
        name,
        email,
        username,
        password,
        bio,
        facebook,
        youtube,
        twitter,
        instagram
    } = req.body.user;

    if (!isEmail(email)) return res.status(401).send("Email invalido");

    if (password.length < 6) return res.status(401).send("La contraseña debe tener al menos 6 caracteres");

    try {
        let user;
        user = await UserModel.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(401).send("El email ya esta en uso");
        }

        user = new UserModel({
            name,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password,
            profilePicUrl: req.body.profilePicUrl || userPng
        });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        let profileFields = {};
        profileFields.user = user._id;

        profileFields.bio = bio;
        profileFields.social = {};
        if (facebook) profileFields.social.facebook = facebook;
        if (youtube) profileFields.social.youtube = youtube;
        if (instagram) profileFields.social.instagram = instagram;
        if (twitter) profileFields.social.twitter = twitter;

        await new ProfileModel(profileFields).save();
        await new FollowerModel({ user: user._id, followers: [], following: [] }).save();
        await new NotificationModel({ user: user._id, notifications: [] }).save();
        await new ChatModel({ user: user._id, chats: [] }).save();

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
