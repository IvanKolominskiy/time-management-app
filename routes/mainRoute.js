import {Router} from "express";
import {registerValidation} from "../validations/registerValidation.js";
import {validationResult} from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path';
import {PRIVATE_ACCESS_KEY, PRIVATE_REFRESH_KEY} from "../secrets.js";

export const mainRoute = new Router();
const __dirname = path.resolve();

mainRoute.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main.html'));
});


mainRoute.post('/', registerValidation, async (req, res) => {
    console.log(req.body);

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
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

        const accessToken = jwt.sign({
                _id: user._id,
            },
            PRIVATE_ACCESS_KEY,
            {
                expiresIn: '15m'
            });

        const refreshToken = jwt.sign({
                _id: user._id,
            },
            PRIVATE_REFRESH_KEY,
            {
                expiresIn: '30d'
            });

        const refreshTokenEndTime = new Date();
        refreshTokenEndTime.setHours(refreshTokenEndTime.getHours() + 720);

        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        res.cookie('refreshTokenEndTime', refreshTokenEndTime, {httpOnly: true});

        const expiresIn = new Date();
        expiresIn.setMinutes(expiresIn.getMinutes() + 15);

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            accessToken,
            refreshToken,
            expiresIn
        });
    } catch (error) {
        console.log(error);
        res.status(500).json( {
            message: 'Не удалось зарегестрироваться'
        })
    }
});
