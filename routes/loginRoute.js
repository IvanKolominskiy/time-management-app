import express, {Router} from "express";
import path from 'path';
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginRoute = new Router();
const __dirname = path.resolve();
const urlencodedParser = express.urlencoded({extended: false});

loginRoute.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

loginRoute.post('/login', urlencodedParser,async (req, res) => {
    console.log(req.body);
    try {
        const user = await UserModel.findOne({ login: req.body.login });
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Неверный логин или пароль"
            });
        }

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
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
});