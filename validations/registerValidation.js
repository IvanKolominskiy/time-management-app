import {body} from "express-validator";

export const registerValidation = [
    body('login', 'Логин должен содержать как минимум 3 символа').isLength({min: 3}),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать как минимум 8 символов').isLength({min: 8}),
];