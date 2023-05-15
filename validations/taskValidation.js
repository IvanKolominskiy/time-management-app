import {body} from "express-validator";

export const taskValidation = [
    body('name', 'Имя задачи должно содержать как минимум 1 символ').isLength({min: 1}),
    body('description', 'Описание задачи должно содержать как минимум 1 символ').isLength({min: 1}),
    body('deadlineDay', 'День должен быть числом').isNumeric(),
    body('deadlineMonth', 'Месяц должен быть числом').isNumeric(),
    body('deadlineYear', 'Год должен быть числом').isNumeric(),
];