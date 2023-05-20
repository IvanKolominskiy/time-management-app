import {body} from "express-validator";

export const taskValidation = [
    body('name', 'Имя задачи должно содержать как минимум 1 символ').isLength({min: 1}),
    body('description', 'Описание задачи должно содержать как минимум 1 символ').optional({checkFalsy: true}).isLength({min: 1}),
    body('deadlineDay', 'День должен быть числом').optional({checkFalsy: true}).isNumeric(),
    body('deadlineMonth', 'Месяц должен быть числом').optional({checkFalsy: true}).isNumeric(),
    body('deadlineYear', 'Год должен быть числом').optional({checkFalsy: true}).isNumeric(),
];