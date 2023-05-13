import {body} from "express-validator";

export const taskValidation = [
    body('text', 'Задача должна содержать как минимум 1 символ').isLength({min: 1})
];