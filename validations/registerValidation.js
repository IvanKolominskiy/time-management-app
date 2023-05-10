import {body} from "express-validator";

export const registerValidation = [
    body('login').isLength({min: 3}),
    body('password').isLength({min: 8})
]