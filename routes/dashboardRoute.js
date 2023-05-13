import express, {Router} from "express";
import {validationResult} from "express-validator";
import {taskValidation} from "../validations/taskValidation.js";
import TaskModel from "../models/Task.js";
import path from 'path';
import checkAuth from "../utils/checkAuth.js";

export const dashboardRoute = new Router();
const __dirname = path.resolve();
const urlencodedParser = express.urlencoded({extended: false});

dashboardRoute.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

dashboardRoute.post('/dashboard', checkAuth, urlencodedParser, taskValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const doc = new TaskModel({
            text: req.body.text,
            user: req.userId
        });

        const task = await doc.save();
        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать задачу',
        });
    }
});

dashboardRoute.get('/dashboard/:user', async (req, res) => {
    try {
        const tasks = await TaskModel.find( {user: req.params.user} );
        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить задачи',
        });
    }
});