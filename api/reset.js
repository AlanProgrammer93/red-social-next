const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const baseUrl = require('../utils/baseUrl');
const isEmail = require('validator/lib/isEmail');
const options = {
    auth: {
        api_key: process.env.sendGrid_api
    }
}

const transporter = nodemailer.createTransport(sendGridTransport(options));


router.post('/', async (req, res) => {
    try {
        const {email} = req.body;

        if (!isEmail(email)) {
            return res.status(401).send('Email incorrecto');
        }

        const user = await UserModel.findOne({email: email.toLowerCase()});

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const token = crypto.randomBytes(32).toString('hex');

        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;

        await user.save();

        const href = `${baseUrl}/reset/${token}`;

        const mailOptions = {
            to: user.email,
            from: "alanwebprogrammer@gmail.com",
            subject: "Solicitud de restablecimiento de contraseña",
            html: `<p>Hola ${user.name.split(" ")[0].toString()
            }, hubo una solicitud para restablecer la contraseña. <a href=${href}>Click Aqui</p>
            <p>Este token es valido por 1 hora.</p>`
        }

        transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

        return res.status(200).send('Email enviado correctamente');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
});

router.post('/token', async (req, res) => {
    try {
        const {token, password} = req.body;

        if (!token) {
            return res.status(401).send("No Autorizado");
        }

        if (password.length < 6) return res.status(401).send("No Autorizado");
        
        const user = await UserModel.findOne({resetToken: token});

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (Date.now() > user.expireToken) {
            return res.status(404).send("Token expirado");
        }

        user.password = await bcrypt.hash(password, 10);

        user.resetToken = '';
        user.expireToken = undefined;

        await user.save();

        return res.status(200).send("Contraseña Modificada");
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el servidor');
    }
})

module.exports = router;
