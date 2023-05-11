import express, {Router} from "express";
import {registerValidation} from "../validations/registerValidation.js";
import {validationResult} from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path';

export const registerRoute = new Router();
const __dirname = path.resolve();
const urlencodedParser = express.urlencoded({extended: false});

registerRoute.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
})


registerRoute.post('/register', urlencodedParser, registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            login: req.body.login,
            email: req.body.email,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
        'secretKey123',
        {
            expiresIn: '30d'
        });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send( {
            massage: 'Не удалось зарегестрироваться'
        })
    }
});
